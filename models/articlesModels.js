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

// exports.articleIdWithComment = (id) => {
//   return db
//     .query("SELECT * FROM comments WHERE article_id = $1;", [id])
//     .then(({ rows }) => {
//       return rows;
//     });
// };

exports.getArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count
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
