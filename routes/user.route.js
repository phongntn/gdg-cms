const express = require("express");
const router = express.Router();
const {createUser, getUser, getUsers, updateUser, deleteUser} = require('../controllers/user.controller');

router.get('/', getUsers);
router.get('/:id', getUser);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;