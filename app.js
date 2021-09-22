const express = require("express");
const Datastore = require("nedb");

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("data.db");
database.loadDatabase();

app.get("/api", (req, res) => {
  database.find({}, (err, data) => {
    res.json(data);
  });
});

module.exports = app;
