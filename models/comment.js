'use strict';
const { DataTypes } = require('sequelize');
const db = require('../db');

module.exports = () => {
  const Comment = db.define('Comment', {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'comments'
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as:'comments' });
    Comment.belongsTo(models.User, { foreignKey: 'userId', as:'user_comment' });
  };

  return Comment;
};


// id, description, userId, postId
