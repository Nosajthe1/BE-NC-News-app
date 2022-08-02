const express = require("express");
const app = express();
const { allTopics } = require("./controllers/topicController");
app.use(express.json()) ;

app.get('/api/topics', allTopics)









module.exports = app