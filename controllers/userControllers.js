const db = require("../db.js");
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey');
const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);


const getUsers = async (req, res) => {
    try {
        const users = await db.any(`SELECT * FROM users`);

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
        console.error(err);
        res.status(500).json({
            status: 500,
            error: `Error retrieving users`
        });
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const user = await db.any(`SELECT * FROM users WHERE id = $1`, [id]);

        if (user.length === 0) {
            return res.status(400).json({
                status: 400,
                error: `Data user is unavailable`
            });
        }
        res.json({
            status: 200,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: `Error retrieving user`
        });
    }
}

const createUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            error: `Username is required`
        });
    }

    var hashPassword = bcrypt.hashSync(password, salt);

    try {
        const result = await db.any(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, hashPassword]);
        res.status(201).json({
            status: 201,
            data: `User added successfully`
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: `Error adding user`
        });
    }
}

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            error: `Username is required`
        });
    }

    try {
        const result = await db.any(`UPDATE users SET username = $1, password = $2 WHERE id = $3`, [username, password, id]);
        res.status(201).json({
            status: 201,
            data: "user updated successfully"
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: `Error updating user`
        });
    }
}

const userLogin = (async (req, res) => {
    try{
  // const payload = { id: 1, username: "JohnDoe" };
        const { username, password } = req.body;
        const userPassword = await db.query(`SELECT password FROM users WHERE username= $1`, [username]);

        if (userPassword.length === 0) {
            return res.status(401).json({
            status: 401,
            error: "Invalid username or password"
            })
        }

        const hashPassword = userPassword.map(password => password.password)

        console.log(hashPassword[0]);

        bcrypt.compare(password, hashPassword[0])
        const user = await db.query(`SELECT * FROM users WHERE username = $1 AND password = $2`, [username, password]);

        if (!user) {
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
        console.error(err);
        res.status(500).json({
            status: 500,
            error: err
        })
    }
})

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    userLogin
}
