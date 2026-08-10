const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    simulationUrl: { type: String, required: true },
    simulationId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    overview: { type: String, required: true },
    topics: { type: [String], required: true },
    learningGoals: { type: [String], required: true },
  },
  {
    versionKey: false,
  },
);

const simulation = mongoose.model('simulations', simulationSchema);

module.exports = simulation;
