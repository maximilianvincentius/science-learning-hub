class EnrollmentService {
  constructor(enrollment) {
    this.enrollment = enrollment;
  }

  async findOne(query) {
    return this.enrollment.findOne(query).select('-_id').lean();
  }

  async findOneAndUpdate(query, updateData, options = {}) {
    return this.enrollment.findOneAndUpdate(query, updateData, options);
  }

  async insertOne(data) {
    return this.enrollment.insertOne(data);
  }

  async findAllBy(query) {
    return this.enrollment.find(query).select('-_id').lean();
  }
}

module.exports = EnrollmentService;
