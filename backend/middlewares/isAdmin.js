// middleware/isAdmin.js
export const isAdmin = (req, res, next) => {

    console.log(req.user)
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
