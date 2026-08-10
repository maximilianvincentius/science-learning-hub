const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema(
//   {
//     id: { type: Number, required: true },
//     question: { type: String, required: true },
//     options: { type: [String], required: true },
//     content: { type: Number, required: true }
//   },
//   { _id: false }
// );

const courseContentSchema = new mongoose.Schema(
  {
    subCourseId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    content: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

const courseSchema = new mongoose.Schema(
  [
    {
      courseId: { type: String, required: true },
      courses: { type: [courseContentSchema], required: true },
    },
  ],
  {
    versionKey: false,
  },
);

const enrollment = mongoose.model('courses', courseSchema);

module.exports = enrollment;
