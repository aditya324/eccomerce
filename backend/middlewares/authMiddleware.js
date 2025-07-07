import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

const protect = async (req, res, next) => {
  console.log("req.cookies:", req.cookies); // debug output
  let token;

  // ✅ Corrected: check for jwt not token
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } 
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};


export default protect;
