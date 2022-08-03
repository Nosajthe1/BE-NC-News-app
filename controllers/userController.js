const { selectUsers } = require("../models/userModels");

exports.allUsers = (req, res) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      err;
    });
};
