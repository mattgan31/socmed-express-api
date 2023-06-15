const { Post, Comment } = require('./../models');

const createComment = async (req, res) => {
    const { id } = req.user;
    const { description } = req.body;
    const postId = req.params.postId;

    try {
        let thisPost = await Post.findByPk(postId);
        if (!postId | !thisPost) {
            return res.status(400).json({
                status: 400,
                error: 'Post not found'
            });
        }

        var userId = id;

        let newComment = await Comment.create({ description, userId, postId });

        return res.status(200).json({
            status: 200,
            data: newComment
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            error: err
        });
    }
}

const deleteComment = async (req, res) => {
    const { id } = req.user;
    const commentId = req.params.commentId;

    try {
        const currentComment = await Comment.findByPk(commentId);
        if (!currentComment) {
            return res.status(404).json({
                status: 404,
                error: "Comment not found"
            });
        }
        if (currentComment.userId !== id) {
            return res.status(401).json({
                status: 401,
                error: "You're cannot remove comment from another user"
            });
        }

        Comment.destroy({ where: { id: commentId } }).then(() => {
            return res.json({
                status: 200,
                message:`Remove comment with ID ${commentId} Success`
              })
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
    createComment,
    deleteComment
}
