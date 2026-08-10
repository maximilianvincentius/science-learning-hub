const mongoose = require('mongoose');

const subCourse = new mongoose.Schema(
  {
    subCourseId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['COMPLETED', 'AVAILABLE', 'LOCKED'],
    },
    progress: { type: Number, required: true },
    type: { type: String, required: true },
    additionalData: { type: Object },
  },
  { _id: false },
);

const enrollmentSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    subCourse: { type: [subCourse], required: true },
    userId: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

const enrollment = mongoose.model('enrollments', enrollmentSchema);

module.exports = enrollment;
