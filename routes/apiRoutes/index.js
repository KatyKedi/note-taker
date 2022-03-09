const router = require('express').Router();
const db = require('../../Develop/db/db');
const fs = require('fs');
const path = require('path');

function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
      filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if (query.text) {
      filteredResults = filteredResults.filter(note => note.text === query.text);
    }
    return filteredResults;
};

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, '../../Develop/db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return note;
};

router.get('/notes', (req, res) => {
    let results = db;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get('/notes/:id', (req, res) => {
    const result = findById(req.params.id, db);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post('/notes', (req, res) => {
    // set Id based on what the next index of the array will be
    req.body.id = db.length.toString();
    // add note to json file and notes array in this function
    const note = createNewNote(req.body, db);
    res.json(note);
});

module.exports = router;