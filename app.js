const express = require("express");
const app = express();
const { allTopics } = require("./controllers/topicController");
const {
  pullArticle,
  patchArticleIncreaseVotes,
} = require("./controllers/articlesController");
app.use(express.json());

app.get("/api/topics", allTopics);
app.get("/api/articles/:article_id", pullArticle);
app.patch("/api/articles/:article_id", patchArticleIncreaseVotes);

app.use((err, req, res, next) => {
  if (err.code === "22P02") { 
    res.status(400).send({ msg: "Invalid URL" });
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
