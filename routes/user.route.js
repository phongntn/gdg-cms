const express = require("express");
const router = express.Router();
const {authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware.js');
const requestRestrict = require('../middlewares/request.restrict.js');
const manageRole = require('../middlewares/manage.role.js');
const permission = require('../config/user.perm.js');
const {createUser, getUser, getUsers, updateUser, deleteUser} = require('../controllers/user.controller');

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);

router.put('/:id', authenticateToken, manageRole, requestRestrict(permission.edit),  updateUser);
router.put('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteUser);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;