/* eslint-disable consistent-return */

// const db = require("../db.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = require('../config/secretKey');

const salt = bcrypt.genSaltSync(10);
const { User, Post, Relationship } = require('../models');

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    return user;
  } catch (err) {
    console.log(err);
    throw new Error('Error retrieving user by username');
  }
};

const getJWTToken = async (user) => {
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
  return token;
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include:Post
    });

    if (users.length === 0) {
      return res.status(400).json({
        status: 400,
        error: 'Data user is unavailable',
      });
    }

    const formattedUsers = users.map((user) => {
      const {
        id, username, createdAt, updatedAt,
      } = user;
      return {
        id, username, createdAt, updatedAt,
      };
    });

    res.json({
      status: 200,
      data: formattedUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      error: 'Error retrieving users',
    });
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await User.findByPk(userId);

    if (user) {
      const {
        id, username, createdAt, updatedAt,
      } = user;

      res.json({
        status: 200,
        data: {
          id, username, createdAt, updatedAt,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        error: 'Data user is unavailable',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Error retrieving user',
    });
  }
};

const getUserByAuth = async (req, res) => {
  const { username: authUser } = req.user;
  try {
    if (!authUser) {
      return res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }

    const user = await getUserByUsername(authUser);

    if (!user) {
      res.status(400).json({
        status: 400,
        error: 'Data user is unavailable',
      });
    }

    const {
      id, username, createdAt, updatedAt,
    } = user;

    res.json({
      status: 200,
      data: {
        id,
        username,
        createdAt,
        updatedAt,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      error: err,
    });
  }
};

const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        error: 'Username is required',
      });
    }
    const isUserExists = await getUserByUsername(username);

    if (isUserExists) {
      return res.status(409).json({
        status: 409,
        error: 'Username has already used',
      });
    }

    const hashPassword = bcrypt.hashSync(password, salt);

    await User.create({ username, password: hashPassword });

    const user = await getUserByUsername(username);

    const token = await getJWTToken(user);

    res.status(201).json({
      status: 201,
      data: 'User added successfully',
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Error adding user',
    });
  }
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        error: 'Username is required',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({
        status: 400,
        error: 'Username not found',
      });
    }

    const isUserExists = await getUserByUsername(username);
    if (isUserExists) {
      return res.status(409).json({
        status: 409,
        error: 'Username is unavailable',
      });
    }

    const hashPassword = bcrypt.hashSync(password, salt);

    await User.update({ username, password: hashPassword }, {
      where: {
        id,
      },
    });
    res.status(201).json({
      status: 201,
      data: 'User updated successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Error updating user',
    });
  }
};

const userLogin = (async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid username or password',
      });
    }

    const verify = bcrypt.compareSync(password, user.password);

    if (!verify) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid username or password',
      });
    }

    const token = await getJWTToken(user);

    res.status(200).json({
      status: 200,
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: err,
    });
  }
});

const followUser = async(req,res) => {
  try {
    const followerId  = (req.user.id);
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }
    if (followerId == id) {
      return res.status(400).json({
        status: 400,
        error: 'Cannot following yourself'
      })
    }
    User.findByPk(followerId).then((follower) => {
      User.findByPk(id).then((following) => {
        Relationship.create({ followerId: follower.id, followingId: following.id }).then(() => {
          return res.status(201).json({
            status: 201,
            message: `Following user with ID ${following.id} Success`
          });
        })
      })
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      error
    });
  }
}

const unfollowUser = async(req,res) => {
  try {
    const followerId  = (req.user.id);
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }
    if (followerId == id) {
      return res.status(400).json({
        status: 400,
        error: 'Cannot unfollow yourself'
      })
    }

    const follower = await Relationship.findOne({ where: { followerId: followerId } });
    const following = await Relationship.findOne({ where: { followingId: id } });

    if (!follower || !following) {
      return res.status(404).json({
        status: 404,
        error: 'Relationship not found',
      });
    }

    Relationship.destroy({ where:{followerId: followerId, followingId: id} }).then(() => {
      return res.json({
        status: 200,
        message:`Unfollow user with ID ${id} Success`
      })
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      error
    });
  }
}

module.exports = {
  getUsers,
  getUserById,
  getUserByAuth,
  createUser,
  updateUser,
  userLogin,
  followUser,
  unfollowUser
};
