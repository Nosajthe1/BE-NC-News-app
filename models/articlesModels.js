const db = require("../db/connection");

exports.getArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID does not exist",
        });
      }
      //   rows[0].comment_count = responesFromMyNewQuery
      return rows[0];
    });
  // now look at comments table
  // see how mant comments are for my article (id)
  // add that numbre of comments to my article OBJECT
  //
};

exports.patchIncreaseVotes = (id, vote) => {
  return db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [vote, id]
  );
};
// return db.query(" SELECT * FROM comments WHERE article_id = $1")
