const express = require('express');

const router = express.Router();
const commentControllers = require('../controllers/commentControllers');
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.delete('/:commentId', verifyToken, commentControllers.deleteComment);

module.exports = router;
