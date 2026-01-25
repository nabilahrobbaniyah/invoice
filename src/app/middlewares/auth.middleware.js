const { error } = require("../utils/response");

function auth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return error(res, 401, "Unauthorized");
  }
  next();
}

module.exports = auth;