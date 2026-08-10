class CourseService {
  constructor(course) {
    this.course = course;
  }

  async findOne(query) {
    return this.course.findOne(query).select('-_id').lean();
  }
}

module.exports = CourseService;
