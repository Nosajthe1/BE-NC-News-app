const db = require("../db/connection");
const { checkIfExists } = require("../utils");

exports.getAllArticles = (sort_by, order, topic) => { 
  if (sort_by === undefined ) {
     sort_by = 'created_at'
  } 
  if (order === undefined ) {
    order = 'DESC'
  }

   const queryValues = [];

let queryStr = ``; 
let queryStr1 = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM comments
        RIGHT JOIN articles ON comments.article_id = articles.article_id
        JOIN users ON users.username = articles.author `;

let queryStr2 = ` GROUP BY articles.article_id
         ORDER BY articles.${sort_by} ${order};`;

if (topic) {
  queryValues.push(topic);
  queryStr = queryStr1 + `WHERE topic = $1` + queryStr2;
};
   
  return db
    .query(queryStr, queryValues)
    .then(({ rows }) => {
     if (rows.length === 0) {
       return Promise.reject({
         status: 404,
         msg: "No data found",
       });
     }
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
      return rows;
    });
};

exports.addCommentWithId = (id, newComment) => {

  const { username, body }  = newComment
  
  return db
  .query(
  `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
          [username, body, id]
          ).then(({rows}) => {
            return rows[0] 
          }) 

};

