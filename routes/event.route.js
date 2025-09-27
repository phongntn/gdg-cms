const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {getEvents, getEvent, createEvent, updateEvent, deleteEvent} = require("../controllers/event.controller.js");

router.get('/', authenticateToken, getEvents);
router.get('/:id', authenticateToken, getEvent);

router.post('/', authenticateToken, createEvent);

router.put('/:id', authenticateToken, updateEvent);
router.put('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete('/:id', authenticateToken, deleteEvent);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;