const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topicController");
const {
  getArticleIdWithComment,
  allArticles,
  pullArticleID,
  patchArticleIncreaseVotes,
  postInCommentById,
} = require("./controllers/articlesController");
const { allUsers } = require("./controllers/userController");
const { deleteCommentByID } = require("./controllers/commentController");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", allArticles);
app.get("/api/articles/:article_id", pullArticleID);
app.patch("/api/articles/:article_id", patchArticleIncreaseVotes);
app.get("/api/articles/:article_id/comments", getArticleIdWithComment);
app.get("/api/users", allUsers);
app.post("/api/articles/:article_id/comments", postInCommentById);
app.delete("/api/comments/:comment_id", deleteCommentByID);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid URL - passed invalid ID" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
