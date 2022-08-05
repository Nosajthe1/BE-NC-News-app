const {
  getAllArticles,
  getArticleById,
  patchIncreaseVotes,
  articleIdWithComment,
  addCommentWithId,
} = require("../models/articlesModels");

exports.allArticles = (req, res, next) => {
  getAllArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => next(err));
};

exports.pullArticleID = (req, res, next) => {
  const id = req.params.article_id;
  getArticleById(id)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => next(err));
};

exports.patchArticleIncreaseVotes = (req, res, next) => {
  if (
    req.body.hasOwnProperty("inc_votes") &&
    typeof req.body.inc_votes !== "number"
  ) {
    res.status(400).send({ msg: "Invalid input, wrong data type" });
    return;
  }
  if (!req.body.hasOwnProperty("inc_votes")) {
    res.status(400).send({ msg: "Invalid input missing inc_votes prop" });
    return;
  }

  const vote = req.body.inc_votes;
  const id = req.params.article_id;
  if (isNaN(id)) {
    res.status(400).send({ msg: "ID is not a number" });
    return;
  }

  patchIncreaseVotes(id, vote).then(() => {
    getArticleById(id)
      .then((updatedArticles) => {
        res.status(200).send({ articles: updatedArticles });
      })
      .catch((err) => next(err));
  });
};

exports.getArticleIdWithComment = (req, res, next) => {
  const id = req.params.article_id;
  getArticleById(id)
    .then(() => {
      return articleIdWithComment(id);
    })
    .then((commentArticleId) => {
      res.status(200).send({ comments: commentArticleId });
    })
    .catch((err) => next(err));
};

exports.postInCommentById = (req, res, next) => {
  const id = req.params.article_id;
  const newComment = req.body
 if (
   !req.body.hasOwnProperty("username") &&
   !req.body.hasOwnProperty("body")
 ) {
   res.status(400).send({ msg: "Invalid input, not correct props" });
   return;
 }

  getArticleById(id)
    .then(() => {
    return  addCommentWithId(id, newComment)
    })
    .then((comment) => {
      res.status(201).send({comment});
    })
    .catch((err) => next(err));
};
