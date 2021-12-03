const fs = require("fs");
const path = require("path");
const express = require("express");
const { notes } = require("./data/notes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./data/notes.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  return result;
}

// GET /api/notes - read db.json and return all saved notes as json
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// POST /api/notes -  recieve new note, add to db.json, return new note --- give each note a unique id, look into npm packages
app.post("/api/notes", (req, res) => {
  req.body.id = notes.length.toString();

  const note = createNewNote(req.body, notes);
  res.json(note);
});

// DELETE /api/notes/:id - read all notes, remove note qith given id, rewrite all anotes to db.json
app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);

  res.json(result);
});

// GET /notes - return notes file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
