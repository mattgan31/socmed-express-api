const express = require('express');

const router = express.Router();
const usersControllers = require('../controllers/userControllers');
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/profile', verifyToken, usersControllers.getUserByAuth);
router.post('/:id/follow', verifyToken, usersControllers.followUser);
router.get('/', verifyToken, usersControllers.getUsers);
router.get('/:id', verifyToken, usersControllers.getUserById);
router.put('/:id', verifyToken, usersControllers.updateUser);

module.exports = router;
