class SearchController {
  constructor(opts) {
    this.articleService = opts.articleService;
    this.simulationService = opts.simulationService;
    this.searchArticlesAndCourses = this.searchArticlesAndCourses.bind(this);
  }

  async searchArticlesAndCourses(req, res) {
    try {
      const { keyword } = req.query;
      const searchQuery = { title: { $regex: keyword, $options: 'i' } };
      const [articles, simulations] = await Promise.all([
        this.articleService.find(searchQuery),
        this.simulationService.find(searchQuery),
      ]);

      res.status(200).json({ articles, simulations });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = SearchController;
