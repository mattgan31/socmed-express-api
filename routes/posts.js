const express = require('express');

const router = express.Router();
const postsControllers = require('../controllers/postsControllers');
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/', verifyToken, postsControllers.getPosts);
router.post('/', verifyToken, postsControllers.createPost);
router.post('/:postId', verifyToken, postsControllers.createCommentPost);

module.exports = router;
