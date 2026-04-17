const express = require("express");
const router = express.Router();
const {authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware.js');
const restrictedRequest = require('../middlewares/request.restrict.js');
const restrictedResponse = require('../middlewares/response.restrict.js');
const permission = require('../config/event.perm.js');
const ownership = require('../middlewares/ownership.js');
const {getEvents, getEvent, createEvent, updateEvent, deleteEvent} = require("../controllers/event.controller.js");

router.get('/', authenticateToken, restrictedResponse(permission.view), getEvents);
router.get('/:id', authenticateToken, restrictedResponse(permission.view), getEvent);

router.post('/', authenticateToken, authorizeRoles('Admin', 'Leader'), restrictedRequest(permission.create), createEvent);

router.put('/:id', authenticateToken, ownership, restrictedRequest(permission.edit), updateEvent);
router.put('/', authenticateToken, (req, res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteEvent);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;