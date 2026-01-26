function auth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
  req.user = { id: req.session.userId };
  next();
}

module.exports = {
  auth
};