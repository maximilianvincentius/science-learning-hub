import logger from '../config/logger';
import { courseStatus, quizStatus, errors } from '../constants';
import { transformNextCourse, transformQuizResponse } from '../transformers/transformCourse';
const { ServerError } = require('../errors');

const { COURSE_TYPE } = courseStatus;
const { QUIZ_STATUS } = quizStatus;
const { ERROR_CODES, ERROR_MESSAGES, ERROR_STATUS_CODE } = errors;

class CourseController {
  constructor(courseService, enrollmentService, awsConnector) {
    this._courseService = courseService;
    this._enrollmentService = enrollmentService;
    this._awsConnector = awsConnector;

    this.getCourseById = this.getCourseById.bind(this);
    this.computeCourseProgress = this.computeCourseProgress.bind(this);
    this.computeQuizResult = this.computeQuizResult.bind(this);
  }

  async getCourseById(req, res) {
    try {
      const userId = req['x-user-id'];
      const courseId = req.params.courseId;
      const subCourseId = req.params.subCourseId;
      let content;

      const [courseData, enrollmentData] = await Promise.all([
        this._courseService.findOne({ courseId: courseId }),
        this._enrollmentService.findOne({
          courseId: courseId,
          userId: userId,
          'subCourse.subCourseId': subCourseId,
        }),
      ]);
      if (!courseData) {
        throw new ServerError(
          ERROR_MESSAGES.COURSE_NOT_FOUND,
          ERROR_CODES.COURSE_NOT_FOUND,
          ERROR_STATUS_CODE.NOT_FOUND,
        );
      }

      const enrollmentSubCourseData = enrollmentData.subCourse.find(
        (item) => item.subCourseId === subCourseId,
      );

      const subCourseData = courseData.courses
        .map((item) => item.content)
        .flat()
        .find((item) => item.subCourseId === subCourseId);

      switch (subCourseData.type) {
        case COURSE_TYPE.QUIZ:
          content = transformQuizResponse(subCourseData);
          break;

        default:
          content = await this._awsConnector.getObjectCommand(subCourseId);
          break;
      }

      logger.info(`[INFO] Success retrieve data ${subCourseId}`);

      return res.status(200).json({
        courseId,
        ...subCourseData,
        ...enrollmentSubCourseData,
        content,
      });
    } catch (error) {
      logger.error(error);
      throw new ServerError(error.message, error.code, error.statusCode);
    }
  }

  async _updateCourseProgress(requestProps, quizResult = null, mapAnswers = null) {
    const { courseId, subCourseId, userId } = requestProps;
    const query = { courseId, userId };

    let progress = requestProps.progress;
    let updatePayloadData = {};
    if (quizResult && quizResult?.status === QUIZ_STATUS.PASSED) {
      progress = 100;
      updatePayloadData.$set = {
        'subCourse.$[current].additionalData': { ...quizResult, ...mapAnswers },
      };
    }

    updatePayloadData.$set = {
      ...updatePayloadData.$set,
      'subCourse.$[current].progress': progress,
    };
    const arrayFilters = [{ 'current.subCourseId': subCourseId }];

    if (progress === 100) {
      const courseData = await this._enrollmentService.findOne(query);
      const nextCourseId = transformNextCourse(courseData, subCourseId)?.subCourseId;

      updatePayloadData.$set['subCourse.$[current].status'] = courseStatus.STATUS.COMPLETED;

      if (nextCourseId) {
        updatePayloadData.$set['subCourse.$[next].status'] = courseStatus.STATUS.AVAILABLE;
        arrayFilters.push({ 'next.subCourseId': nextCourseId });
      }
    }
    await this._enrollmentService.findOneAndUpdate(query, updatePayloadData, { arrayFilters });

    logger.info(
      `[INFO] Success save progress course ${courseId} and subCourse ${subCourseId} for user ${userId}`,
    );
  }

  async computeCourseProgress(req, res) {
    try {
      const courseId = req.params.courseId;
      const subCourseId = req.params.subCourseId;
      const userId = req['x-user-id'];
      const progress = req.body.progress || 0;
      const requestProps = {
        courseId,
        subCourseId,
        userId,
        progress,
      };

      await this._updateCourseProgress(requestProps);

      return res.status(200).json({ message: 'SUCCESS_UPDATE_PROGRESS' });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  _calculateQuizResult(result) {
    const { correct, totalQuestions, incorrect } = result;
    const correctPercentage = Math.round((correct / totalQuestions) * 100);
    let status;
    if (correctPercentage >= 80 && totalQuestions <= 15 && incorrect <= 3) {
      status = QUIZ_STATUS.PASSED;
    } else if (correctPercentage >= 80 && totalQuestions > 15 && incorrect <= 3) {
      status = QUIZ_STATUS.PASSED;
    } else {
      status = QUIZ_STATUS.FAILED;
    }

    return {
      correctPercentage,
      status,
    };
  }

  async computeQuizResult(req, res) {
    try {
      const { courseId, subCourseId, answers: userAnswers } = req.body;
      const userId = req['x-user-id'];

      const courseData = await this._courseService.findOne({ courseId });

      let subCourseData;
      courseData.courses.forEach((course) => {
        const foundSubCourse = course.content.find((item) => item.subCourseId === subCourseId);
        if (foundSubCourse) {
          subCourseData = foundSubCourse;
        }
      });
      if (!subCourseData) {
        return res.status(404).json({ message: 'SIMULATION_NOT_FOUND' });
      }

      const quiz = subCourseData.content;
      const mapAnswers = {
        correct: 0,
        incorrect: 0,
        unanswered: 0,
        totalQuestions: quiz.length,
      };

      quiz.forEach((quizItem, index) => {
        const isUndefined = userAnswers[index] === undefined || userAnswers[index] === null;
        if (isUndefined) {
          mapAnswers.unanswered += 1;
          return;
        }

        const isCorrect = userAnswers[index] === quizItem.correct;

        return isCorrect ? (mapAnswers.correct += 1) : (mapAnswers.incorrect += 1);
      });
      const quizResult = this._calculateQuizResult(mapAnswers);

      const requestProps = {
        courseId,
        subCourseId,
        userId,
      };
      await this._updateCourseProgress(requestProps, quizResult, mapAnswers);

      logger.info(`[INFO] Quiz submitted with courseId ${courseId} and subCourse ${subCourseId}`);

      return res.status(200).json({ ...quizResult, ...mapAnswers });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
}

module.exports = CourseController;
