const express = require("express");
const router = express.Router();
const {authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware.js');
const restrictedRequest = require('../middlewares/request.restrict.js');
const restrictedResponse = require('../middlewares/response.restrict.js');
const permission = require('../config/event.perm.js');
const {getEvents, getEvent, createEvent, updateEvent, deleteEvent} = require("../controllers/event.controller.js");

router.get('/', authenticateToken, restrictedResponse(permission.view), getEvents);
router.get('/:id', authenticateToken, getEvent);

router.post('/', authenticateToken, restrictedRequest(permission.create), createEvent);

router.put('/:id', authenticateToken, restrictedRequest(permission.edit), updateEvent);
router.put('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete('/:id', authenticateToken, deleteEvent);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;