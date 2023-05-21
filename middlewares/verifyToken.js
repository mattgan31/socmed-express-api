const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey');

function verifyToken(req, res, next) {

  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next()
  } catch (error) {
    console.log(err);
    return res.status(403).json({
        status: 403,
        error: 'Forbidden'
      });
  }
}


module.exports = verifyToken
