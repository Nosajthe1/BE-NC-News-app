const { deleteCommentId, commentByID } = require("../models/commentModels");

exports.selectCommentByID = (req, res, next) => {
  const id = req.params.comment_id;
  console.log(id);
  commentByID(id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => next(err));
};

exports.deleteCommentByID = (req, res, next) => {
  const id = req.params.comment_id;
  commentByID(id)
    .then(() => {
      return deleteCommentId(id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
