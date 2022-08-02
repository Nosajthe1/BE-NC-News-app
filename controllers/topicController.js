const { selectTopics } = require("../models/topicModels");

exports.allTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      err;
    });
};


