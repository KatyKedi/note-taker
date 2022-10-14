const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Read the database file
async function read() {
    return await readFileAsync(path.join(__dirname, '../../db/db.json'), 'utf8');
}

// Rewrite the datbase file
async function write(notesArray) {
    return await writeFileAsync(
        path.join(__dirname, '../../db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
}

// Find a note by it's id value
function findById(id, notesArray) {
    return notesArray.filter(note => note.id === id)[0];
};

async function createNewNote(note, notesArray) {
    notesArray.push(note);
    await write(notesArray)
    return note;
};

async function deleteNote(result, notesArray) {
    notesArray = notesArray.filter(note => note.id !== result.id);
    await write(notesArray)
    return notesArray
};

router.get('/notes', async (req, res) => {
    let results = await read()
    results = JSON.parse(results)
    res.json(results);
});

router.post('/notes', async (req, res) => {
    let results = await read()
    results = JSON.parse(results)
    // set Id based on what the next index of the array will be
    req.body.id = results.length.toString();
    // add note to json file and notes array in this function
    const note = createNewNote(req.body, results);
    res.json(note);
});

router.delete('/notes/:id', async (req, res) => {
    let results = await read()
    results = JSON.parse(results)
    const result = await findById(req.params.id, results);
    const notesArray = await deleteNote(result, results);
    res.json(notesArray)
});

module.exports = router;