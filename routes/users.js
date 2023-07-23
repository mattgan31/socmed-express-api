const express = require('express');

const router = express.Router();
const usersControllers = require('../controllers/userControllers');
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.post('/register', usersControllers.createUser);
router.post('/login', usersControllers.userLogin);
router.get('/profile', verifyToken, usersControllers.getUserByAuth);
router.get('/', verifyToken, usersControllers.getUsers);
router.get('/:id', verifyToken, usersControllers.getUserById);
router.put('/:id', verifyToken, usersControllers.updateUser);
router.post('/:id/follow', verifyToken, usersControllers.followUser);
router.delete('/:id/unfollow', verifyToken, usersControllers.unfollowUser);

module.exports = router;
