const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const user = mongoose.model('users', userSchema);

module.exports = user;
