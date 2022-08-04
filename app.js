const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topicController");
const {
  allArticles,
  pullArticleID,
  patchArticleIncreaseVotes,
} = require("./controllers/articlesController");
const { allUsers } = require("./controllers/userController");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", allArticles);
app.get("/api/articles/:article_id", pullArticleID);
app.patch("/api/articles/:article_id", patchArticleIncreaseVotes);
app.get("/api/users", allUsers);

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
