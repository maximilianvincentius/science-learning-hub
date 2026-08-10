import { COURSE_TYPE, STATUS } from '../constants/course.js';

const transformSimulationListResponse = (response, enrollmentData = null) => {
  return response.map((item) => {
    const obj = item.toObject ? item.toObject() : item;
    delete obj.quiz;

    const enrollmentDataItem = enrollmentData ? Number(enrollmentData[obj.simulationId]) : NaN;

    return Number.isFinite(enrollmentDataItem) && enrollmentDataItem >= 0
      ? { ...obj, progress: enrollmentDataItem }
      : obj;
  });
};

const transformEnrollmentData = (courseData, userId) => {
  const { courses, courseId } = courseData;

  let mappedSubCourse = [];
  courses.forEach((itemSubcourse) => {
    const subCourse = itemSubcourse.content.map((item) => {
      let payload = {
        subCourseId: item.subCourseId,
        status: STATUS.AVAILABLE,
        progress: 0,
        type: item.type,
      };
      if (item.type === COURSE_TYPE.QUIZ) {
        payload = {
          ...payload,
          status: STATUS.LOCKED,
        };
      }

      return payload;
    });

    mappedSubCourse.push(...subCourse);
  });

  return { subCourse: mappedSubCourse, courseId, userId };
};

const _mapSimulationDetailResponse = (content, enrollmentData) =>
  content.map((item) => {
    if (item.quiz) {
      delete item.quiz;
    }

    const enrollmentItem = enrollmentData.subCourse.find(
      (subCourse) => subCourse.subCourseId === item.subCourseId,
    );

    return {
      ...item,
      status: enrollmentItem ? enrollmentItem.status : STATUS.LOCKED,
    };
  });

const transformSimulationDetailResponse = (
  simulationData,
  courseData,
  enrollmentData = null,
  courseProgress = null,
) => {
  const { courses } = courseData;
  const mappedSubCourse = courses.map((item) => {
    const mapSimulationDetail = _mapSimulationDetailResponse(item.content, enrollmentData);

    return {
      topic: item.topic,
      subCourses: mapSimulationDetail,
    };
  });

  return {
    ...simulationData,
    progress: courseProgress ? courseProgress[courseData.courseId] : 0,
    courses: mappedSubCourse,
  };
};

export {
  transformSimulationListResponse,
  transformSimulationDetailResponse,
  transformEnrollmentData,
};
