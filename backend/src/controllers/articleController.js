const { errors } = require('../constants');
const { ServerError } = require('../errors');
const logger = require('../config/logger');
const {
  Types: { ObjectId },
} = require('mongoose');

const { ERROR_CODES, ERROR_MESSAGES } = errors;

class ArticleController {
  constructor(articleService) {
    this._articleService = articleService;

    this.getArticles = this.getArticles.bind(this);
    this.getArticleById = this.getArticleById.bind(this);
  }

  async getArticles(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const categoriesQuery = req.query.categories || null;
      const sortBy = req.query.sortBy || 'title';
      const order = req.query.order === 'desc' ? -1 : 1;

      const categoriesArray = categoriesQuery
        ? categoriesQuery
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const filter = categoriesArray.length ? { category: { $in: categoriesArray } } : {};

      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this._articleService.findAllBy(filter, sortBy, order, skip, limit),
        this._articleService.count(filter),
      ]);

      const respData = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: data.length,
        limit,
        data: data,
      };
      logger.info('[INFO] Success get articles from DB');

      return res.status(200).json(respData);
    } catch (error) {
      logger.error(error);
      throw new ServerError(error.message, error.code, error.statusCode);
    }
  }

  async getArticleById(req, res) {
    try {
      const { id } = req.params;
      const article = await this._articleService.findOne(new ObjectId(id));

      if (!article) {
        throw new ServerError(ERROR_MESSAGES.ARTICLE_NOT_FOUND, ERROR_CODES.ARTICLE_NOT_FOUND);
      }
      logger.info(`[INFO] Success get article by ID ${id} from DB`);

      return res.status(200).json(article);
    } catch (error) {
      logger.error(error);
      throw new ServerError(error.message, error.code, error.statusCode);
    }
  }
}

module.exports = ArticleController;
