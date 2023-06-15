const { Comment, Post } = require('../models');
// const User = require('../models/userModel');

// mengambil data post dari req dan userId berdasarkan jwt
const createPost = async (req, res) => {
    const { post } = req.body;
    const { id } = req.user;

    try {
        if (!post) {
            return res.status(400).json({
                status: 400,
                error: 'Post is required'
            });
        }

        var userId = id;

        let newPost = await Post.create({ post, userId });

        return res.status(200).json({
            status: 200,
            data: newPost
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            error: err
        });
    }
}


const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: Comment,
                as: 'comments'
            }
        });
        if (!posts) {
            res.status(404).json({
                status: 404,
                error: 'Post is not available'
            });
        }
        return res.status(200).json({
            status: 200,
            posts
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            error: err
        });
    }
}

module.exports = {
    getPosts,
    createPost,
}
