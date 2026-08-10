class SimulationService {
  constructor(simulation) {
    this.simulation = simulation;
  }

  async findAllBy(searchBy = {}, sortBy, order, skip, limit) {
    return this.simulation
      .find(searchBy)
      .select('-_id')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);
  }

  async count(filter = {}) {
    return this.simulation.countDocuments(filter);
  }

  async findOne(query) {
    return this.simulation.findOne(query).select('-_id').lean();
  }

  async find(query) {
    return this.simulation.find(query);
  }
}

module.exports = SimulationService;
