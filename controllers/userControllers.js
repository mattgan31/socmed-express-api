// const db = require("../db.js");
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey');
const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
const User = require('./../models/userModel.js')

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        if (users.length === 0) {
            return res.status(400).json({
                status: 400,
                error: `Data user is unavailable`
            });
        }
        res.json({
            status: 200,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: `Error retrieving users`
        });
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const user = await User.findByPk(id);

        if (user) {
            res.json({
            status: 200,
            data: user
            });
        } else {
            res.status(400).json({
                status: 400,
                error: `Data user is unavailable`
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: `Error retrieving user`
        });
    }
}

const createUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                error: `Username is required`
            });
        }
        const isUserExists = await getUserByUsername(username);

        if (isUserExists) {
            return res.status(409).json({
                status: 409,
                error: "Username has already used"
            })
        }

        const hashPassword = bcrypt.hashSync(password, salt);

        const result = await User.create({ username: username, password: hashPassword });

        res.status(201).json({
            status: 201,
            data: `User added successfully`
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: `Error adding user`
        });
    }
}

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                error: `Username is required`
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({
                status: 400,
                error: `Username not found`
            });
        }

        const isUserExists = await getUserByUsername(username);
        if (isUserExists) {
            return res.status(409).json({
                status: 409,
                error: "Username is unavailable"
            })
        }

        var hashPassword = bcrypt.hashSync(password, salt);

        const result = await User.update({ username: username, password: hashPassword }, {
            where: {
            id: id
        }});
        res.status(201).json({
            status: 201,
            data: "User updated successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: `Error updating user`
        });
    }
}

const userLogin = (async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({
            status: 401,
            error: "Invalid username or password"
            })
        }

        const verify = bcrypt.compareSync(password, user.password)

        if (!verify) {
            return res.status(401).json({
            status: 401,
            error: "Invalid username or password"
            })
        }

        const token = jwt.sign({ id: user.id, username: user.username }, secretKey);

        res.status(200).json({
            status: 200,
            token: token
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: err
        })
    }
})

const getUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ where: { username: username } });
        return user;
    } catch (err) {
        throw new Error("Error retrieving user by username");
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    userLogin
}
