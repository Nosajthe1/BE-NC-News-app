const db = require("../db/connection");

exports.getAllArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM comments
        RIGHT JOIN articles ON comments.article_id = articles.article_id
        JOIN users ON users.username = articles.author 
         GROUP BY articles.article_id
         ORDER BY articles.created_at DESC;
         `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.getArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id):: INTEGER AS comment_count
        FROM comments
        RIGHT JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
         GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID does not exist",
        });
      }

      return rows[0];
    });
};

exports.patchIncreaseVotes = (id, vote) => {
  return db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [vote, id]
  );
};

exports.articleIdWithComment = (id) => {
  return db
    .query(
      "SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1;",
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 200,
          msg: "No comments associated with this ID",
        });
      }
      return rows;
    });
};
