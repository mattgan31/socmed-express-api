var express = require('express');
var router = express.Router();
const usersControllers = require('../controllers/userControllers');
const verifyToken = require('../middlewares/verifyToken');

/* GET users listing. */
router.get('/profile', verifyToken, usersControllers.getUserByAuth);
router.get('/', verifyToken, usersControllers.getUsers);
router.get('/:id', verifyToken, usersControllers.getUserById);
router.put('/:id', verifyToken, usersControllers.updateUser);

module.exports = router;
