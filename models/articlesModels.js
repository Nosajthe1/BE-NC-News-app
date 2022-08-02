const db = require("../db/connection");

exports.getArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((articles) => {
      return articles.rows[0];
    });
};
