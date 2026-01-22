const { error } = require("../utils/response");

function authMiddleware(req, res, next) {
    if (!req.session.userId) {
        return error(res, 401, "Unauthorized");
    }
    next();
}

module.exports = authMiddleware;