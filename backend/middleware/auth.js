const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'JWT secret not configured' });

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
