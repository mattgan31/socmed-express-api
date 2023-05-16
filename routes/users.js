var express = require('express');
var router = express.Router();
const query = require('./../queries');

/* GET users listing. */
router.get('/', query.getUsers);
router.post('/', query.createUser);
router.get('/:id', query.getUserById);
router.put('/:id', query.updateUser);

module.exports = router;
