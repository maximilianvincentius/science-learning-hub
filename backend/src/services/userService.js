class UserService {
  constructor(user) {
    this.user = user;
  }

  async createUser(data) {
    try {
      const result = await this.user.collection.insertOne(data);

      return result;
    } catch (error) {
      throw new Error('Error saving new user: ' + error.message);
    }
  }

  async findOne(query) {
    return await this.user.findOne(query);
  }

  async findIn(fields, values) {
    return await this.user.find({ [fields]: { $in: values } }).lean();
  }

  async findOneAndUpdate(query, update) {
    const updatePayloadData = { $set: update };
    const result = await this.user.findOneAndUpdate(query, updatePayloadData, {
      returnDocument: 'after',
    });

    return result;
  }

  async updateOne(query, update) {
    const updatePayloadData = { $set: update };
    await this.user.updateOne(query, updatePayloadData);
  }
}

module.exports = UserService;
