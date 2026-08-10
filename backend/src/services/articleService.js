class ArticleService {
  constructor(article) {
    this.article = article;
  }

  async findOne(query) {
    return this.article.findOne(query).select('-_id').lean();
  }

  async findAllBy(searchBy, sortBy, order, skip, limit) {
    return this.article
      .find(searchBy)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);
  }

  async find(query) {
    return this.article.find(query);
  }

  async count(filter = {}) {
    return this.article.countDocuments(filter);
  }
}

module.exports = ArticleService;
