const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {getEvents, getEvent, createEvent, updateEvent, deleteEvent} = require("../controllers/event.controller.js");

router.get('/', authenticateToken, getEvents);
router.get('/:id', authenticateToken, getEvent);

router.post('/', authenticateToken, createEvent);

router.put('/:id', authenticateToken, updateEvent);

router.delete('/:id', authenticateToken, deleteEvent);

module.exports = router;