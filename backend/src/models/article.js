const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    topic: { type: String, required: true },
  },
  { _id: false },
);

const article = mongoose.model('articles', articlesSchema);

module.exports = article;
