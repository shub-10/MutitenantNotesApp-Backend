const express = require("express");

const {authMiddleware} = require('../middleware/auth');
const {addNote, deleteNote, updateNote, getNote, getOneNote} = require("../Controllers/notes");
const router = express.Router();


router.post('/', authMiddleware, addNote);
router.post('/:id',authMiddleware, updateNote);
router.get('/',authMiddleware, getNote);
router.get('/:id',authMiddleware, getOneNote);
router.delete('/:id',authMiddleware, deleteNote)

module.exports = router;