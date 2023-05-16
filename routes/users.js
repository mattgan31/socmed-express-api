var express = require('express');
var router = express.Router();
const usersControllers = require('../controllers/userControllers');

/* GET users listing. */
router.get('/', usersControllers.getUsers);
router.post('/', usersControllers.createUser);
router.get('/:id', usersControllers.getUserById);
router.put('/:id', usersControllers.updateUser);

module.exports = router;
