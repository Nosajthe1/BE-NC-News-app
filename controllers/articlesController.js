const { getArticleById } = require("../models/articlesModels");

exports.pullArticle = (req, res, next) => {
  const id = req.params.article_id;
  getArticleById(id) 
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => next(err));
};
