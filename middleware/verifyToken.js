/* eslint-disable consistent-return */

const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if the Authorization header contains the Bearer token format
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 403,
      error: 'Forbidden',
    });
  }
}

module.exports = verifyToken;
