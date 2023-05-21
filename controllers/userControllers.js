/* eslint-disable consistent-return */
/* eslint linebreak-style: ["error", "windows"] */
// const db = require("../db.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = require('../config/secretKey');

const salt = bcrypt.genSaltSync(10);
const User = require('../models/userModel');

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    return user;
  } catch (err) {
    throw new Error('Error retrieving user by username');
  }
};

const getJWTToken = async (user) => {
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
  return token;
};

const getUsers = async (res) => {
  try {
    const users = await User.findAll();

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

module.exports = {
  getUsers,
  getUserById,
  getUserByAuth,
  createUser,
  updateUser,
  userLogin,
};
