const logger = require('../config/logger');
const {
  transformSimulationListResponse,
  transformSimulationDetailResponse,
} = require('../transformers/transformSimulation');
const { transformEnrollmentData } = require('../transformers/transformEnrollment');
const { errors } = require('../constants');
const { ServerError } = require('../errors');

const { ERROR_CODES, ERROR_MESSAGES, ERROR_STATUS_CODE } = errors;

class SimulationController {
  constructor(simulationService, courseService, enrollmentService, userService, config) {
    this._simulationService = simulationService;
    this._courseService = courseService;
    this._enrollmentService = enrollmentService;
    this._userService = userService;
    this._config = config;

    this.getSimulationList = this.getSimulationList.bind(this);
    this.getSimulationById = this.getSimulationById.bind(this);
    this.enrollSimulation = this.enrollSimulation.bind(this);
  }

  async getSimulationList(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const categoriesQuery = req.query.categories || null;
      const sortBy = req.query.sortBy || 'title';
      const order = req.query.order === 'desc' ? -1 : 1;
      const userId = req['x-user-id'];

      const categoriesArray = categoriesQuery
        ? categoriesQuery
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const filter = categoriesArray.length ? { category: { $in: categoriesArray } } : {};

      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this._simulationService.findAllBy(filter, sortBy, order, skip, limit),
        this._simulationService.count(filter),
      ]);

      let transformedEnrollmentData = null;
      if (userId) {
        const enrollmentData = await this._enrollmentService.findAllBy({ userId });
        transformedEnrollmentData = transformEnrollmentData(enrollmentData);
      }

      const mappedData = transformSimulationListResponse(data, transformedEnrollmentData);
      logger.info('[INFO] Success retrieve data from DB');

      const respData = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: data.length,
        limit,
        data: mappedData,
      };

      return res.status(200).json(respData);
    } catch (error) {
      logger.error(error);
      throw new ServerError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSimulationById(req, res) {
    try {
      const simulationId = req.params.id;
      const userId = req['x-user-id'];
      let isUnEnrolledCourse = false;

      let [simulationData, courseData, enrollmentData] = await Promise.all([
        this._simulationService.findOne({ simulationId: simulationId }),
        this._courseService.findOne({ courseId: simulationId }),
        this._enrollmentService.findOne({ courseId: simulationId, userId: userId }),
      ]);

      if (!simulationData && !courseData) {
        return res.status(404).json({ message: 'NOT_FOUND' });
      }

      if (!enrollmentData) {
        isUnEnrolledCourse = true;
        return res.status(200).json({ ...simulationData, isUnEnrolledCourse });
      }

      const courseProgress = transformEnrollmentData([enrollmentData]);

      const mappedData = transformSimulationDetailResponse(
        simulationData,
        courseData,
        enrollmentData,
        courseProgress,
      );
      logger.info(`[INFO] Success retrieve data ${simulationId}`);

      return res.status(200).json({ ...mappedData, isUnEnrolledCourse });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  async enrollSimulation(req, res) {
    try {
      const simulationId = req.params.id;
      const userId = req['x-user-id'];

      const [course, enrollments] = await Promise.all([
        this._courseService.findOne({ courseId: simulationId }),
        this._enrollmentService.findOne({ courseId: simulationId, userId: userId }),
      ]);

      if (enrollments) {
        throw new ServerError(
          ERROR_MESSAGES.ALREADY_ENROLLED,
          ERROR_CODES.ALREADY_ENROLLED,
          ERROR_STATUS_CODE.BAD_REQUEST,
        );
      }

      if (!course) {
        throw new ServerError(
          ERROR_MESSAGES.COURSE_NOT_FOUND,
          ERROR_CODES.COURSE_NOT_FOUND,
          ERROR_STATUS_CODE.NOT_FOUND,
        );
      }

      const enrollmentData = transformEnrollmentData(course, userId);

      await this._enrollmentService.insertOne(enrollmentData);

      logger.info(`[INFO] Success enroll user ${userId} to course ${simulationId}`);

      return res.status(200).json({ message: 'ENROLLMENT_SUCCESS' });
    } catch (error) {
      logger.error({ error }, '[SimulationController] Failed to enroll user');
      throw new ServerError(error.message, error.code, error.statusCode);
    }
  }
}

module.exports = SimulationController;
