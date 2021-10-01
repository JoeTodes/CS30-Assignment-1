const { query } = require("express");
const express = require("express");
const Datastore = require("nedb");

const app = express();
app.use(express.static("public", { fallthrough: true }));
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

function isValid(data) {
	let valid = true;
	if (Object.keys(data).length == 0) {
		valid = false;
	} else {
		for (const key in data) {
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
	return valid;
}

app.post("/api", (req, res) => {
	let newData = req.body;

	if (isValid(newData)) {
		database.insert(newData, (err, newDoc) => {
			res.status(201);
			res.json(newDoc);
		});
	} else {
		res.status(400);
		res.json({ error: "invalid data" });
	}
});

app.put("/api/:id", (req, res) => {
	let newData = req.body;
	if (isValid(newData)) {
		database.find({ _id: req.params.id }, (err, docs) => {
			if (docs.length == 0) {
				newData._id = req.params.id;
				console.log(newData);
			}
		});
		database.update(
			{ _id: req.params.id },
			newData,
			{ upsert: true, returnUpdatedDocs: true },
			(err, num, affectedDocs, upsert) => {
				if (upsert) {
					res.status(201);
				} else {
					res.status(200);
				}
				res.json(affectedDocs);
			}
		);
	} else {
		res.status(400);
		res.json({ error: "invalid data" });
	}
});

app.delete("/api/:id", (req, res) => {
	database.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
		if (numRemoved > 0) {
			res.status(204);
			res.send();
		} else {
			res.status(404);
			res.json({ error: "no matching record to delete" });
		}
	});
});

app.use((req, res) => {
	res.status(404);
	res.sendFile(__dirname + "/public/404.html");
});

module.exports = app;
