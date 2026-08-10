import { simulation, course } from '../models';
const simulationData = require('./simulations.json');
const coursesData = require('./courses.json');

const seedDb = async () => {
  await simulation.deleteMany({});
  await course.deleteMany({});
  await simulation.insertMany(simulationData);
  await course.insertMany(coursesData);
};

module.exports = seedDb;
