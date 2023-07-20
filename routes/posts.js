const express = require('express');

const router = express.Router();
const postsControllers = require('../controllers/postsControllers');
const commentControllers = require('../controllers/commentControllers');
const verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/', verifyToken, postsControllers.getPosts);
router.get('/:postId', verifyToken, postsControllers.getPostById);
router.post('/', verifyToken, postsControllers.createPost);
router.post('/:postId/comment/', verifyToken, commentControllers.createComment);

module.exports = router;
