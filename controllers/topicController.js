const { selectTopics } = require('../models/topicModel')

// console.log('hello hello im in the controller')

exports.allTopics = (req, res) => {
   
  selectTopics().then((topics) => {
 
    res.status(200).send({ topics });
    console.log({ topics });
  })
  .catch((err) => {
  console.log(err)
  })
};
