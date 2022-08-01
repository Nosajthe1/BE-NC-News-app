const  db  = require('../db/connection')
console.log('hello im  in the model')
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    console.log(topics);
    return topics.rows;
  }).catch((err) => console.log(err));
};

