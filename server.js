//-------------- require
const fs = require('fs');
const path = require('path');
const express = require('express');

//--------------------------create app variable (STEP 1)
const app = express();


// Port
const PORT = 3001; //or process.env.PORT


// JSON file & it's path
const dirCurrent = __dirname;
const dbFilePath = './db/db.json';
const jsonNotesFile = require(dbFilePath);
const jsonNotesFileDir = path.join(dirCurrent, dbFilePath);


//-------------- express.use
app.use(express.json());
app.use(express.static('public'));


//----------------------------------------------------------- Functions
//---------------------------------------------------noteAdd
function noteAdd(arrNotes, oNote) {
    if (arrNotes === undefined) {
        arrNotes = [];
    }


    var iLen = arrNotes.length;
    var iMaxId = 0;
    for (let i = 0; i < iLen; i++) {
        if (arrNotes[i].id > iMaxId) {
            iMaxId = arrNotes[i].id;
        }
    }

    oNote.id = iMaxId + 1;
    arrNotes.push(oNote);

    fs.writeFileSync(
        jsonNotesFileDir,
        JSON.stringify(arrNotes, null, 4)
    );
    return oNote;
}


//---------------------------------------------------NoteRemove
function noteRemove(arrNotes, idDelete) {
    var iLen = arrNotes.length;
    for (let i = 0; i < iLen; i++) {
        if (arrNotes[i].id == idDelete) {
            arrNotes.splice(i, 1);
            fs.writeFileSync(
                jsonNotesFileDir,
                JSON.stringify(arrNotes, null, 4)
            );
            break;
        }
    }
}



//----------------------------------------------------Routes (Step 2)
    //------------- http://localhost:PORT get at /
    app.get('/', (req, res) => {
        var connectToFile = './public/index.html';
        res.sendFile(path.join(dirCurrent, connectToFile));
    });


    //------------- http://localhost:PORT get at /api/notes
    app.get('/api/notes', (req, res) => {
        res.json(jsonNotesFile);
    });


    //------------- http://localhost:PORT get at /notes
    app.get('/notes', (req, res) => {
        var connectToFile = './public/notes.html';
        res.sendFile(path.join(dirCurrent, connectToFile));
    });


    //------------- http://localhost:PORT get at anything else
    app.get('*', (req, res) => {
        var connectToFile = './public/index.html';
        res.sendFile(path.join(dirCurrent, connectToFile));
    });

//----------------------------------------------- Functions called from Express
//------------- post
app.post('/api/notes', (req, res) => {
    var noteBody = req.body;
    const oNote = noteAdd(jsonNotesFile, noteBody);
    res.json(oNote);
});


//------------- delete
app.delete('/api/notes/:id', (req, res) => {
    var noteId = req.params.id;
    noteRemove(jsonNotesFile, noteId);
    res.json(true);
});

//----------------------------------------- listen (Step 3)
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});