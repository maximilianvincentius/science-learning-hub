const { courseStatus } = require('../constants');

const { STATUS, COURSE_TYPE } = courseStatus;

const _isEligibleStartQuiz = (data, prefix) => {
  const prefixCount = data.reduce((count, item) => {
    const itemPrefix = item.subCourseId.match(/^([a-zA-Z]+)/)?.[1];
    if (itemPrefix === prefix) {
      count++;
    }

    return count;
  }, 0);

  const completedCount = data.reduce((count, item) => {
    const itemPrefix = item.subCourseId.match(/^([a-zA-Z]+)/)?.[1];
    if (itemPrefix === prefix && item.status === STATUS.COMPLETED) {
      count++;
    }

    return count;
  }, 1);

  return completedCount === prefixCount - 1;
};

const transformNextCourse = (course, currentCourseId) => {
  const { subCourse } = course;
  let nextSubCourse;

  const prefixCourseId = currentCourseId.match(/^([a-zA-Z]+)/)?.[1];
  const isEligible = _isEligibleStartQuiz(subCourse, prefixCourseId);
  if (isEligible) {
    const nextIndex = subCourse.findIndex(
      (item) => item.type === COURSE_TYPE.QUIZ && item.subCourseId.startsWith(prefixCourseId),
    );
    nextSubCourse = subCourse[nextIndex];
    nextSubCourse.status = STATUS.AVAILABLE;
  }

  return nextSubCourse;
};

const transformQuizResponse = (subCourseData) => {
  const quizResult = subCourseData.content.map((item) => {
    delete item.correct;
    return item;
  });

  return quizResult;
};

module.exports = { transformNextCourse, transformQuizResponse };
