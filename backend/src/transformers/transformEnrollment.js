const { STATUS } = require('../constants/course');

const transformEnrollmentData = (enrollmentData) => {
  const result = enrollmentData.reduce((acc, enrollment) => {
    const getCompletedModules = enrollment.subCourse.reduce(
      (count, subCourse) => (subCourse.status === STATUS.COMPLETED ? count + 1 : count),
      0,
    );

    acc[enrollment.courseId] = Math.floor(
      (getCompletedModules / enrollment.subCourse.length) * 100,
    );

    return acc;
  }, {});

  return result;
};

module.exports = { transformEnrollmentData };
