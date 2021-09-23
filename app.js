const { query } = require("express");
const express = require("express");
const Datastore = require("nedb");

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("data.db");
database.loadDatabase();

const sampleData = {
	sometext: "hihihihi",
	aNumber: 5,
	anArray: ["hi", 7],
	anObject: { childOne: "Autumn", childTwo: "Rae", nChildren: 2 },
	_id: "4RlVy5qmAbNyxy5m",
};

app.get("/api", (req, res) => {
	database.find({}, (err, data) => {
		res.json(data);
	});
});

app.get("/api/search", (req, res) => {
	let q = req.query;
	database.find(q, (err, data) => {
		if (Object.keys(data).length > 0) {
			res.json(data);
		} else {
			res.status(400);
			res.json({ error: "no records match search query" });
		}
	});
});

app.post("/api", (req, res) => {
	let newData = req.body;
	let valid = true;
	if (Object.keys(newData).length == 0) {
		valid = false;
	} else {
		for (const key in newData) {
			let keyValid = false;
			for (const prop in sampleData) {
				if (key == prop) {
					keyValid = true;
					break;
				}
			}
			if (!keyValid) {
				valid = false;
				break;
			}
		}
	}
	if (valid) {
		database.insert(newData, (err, newDoc) => {
			res.status(201);
			res.json(newDoc);
		});
	} else {
		res.status(400);
		res.json({ error: "invalid data" });
	}
});

module.exports = app;
