const dashboardService = require("../services/dashboard.services");

module.exports = {
  getSummary: async function (req, res, next) {
    try {
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
};

