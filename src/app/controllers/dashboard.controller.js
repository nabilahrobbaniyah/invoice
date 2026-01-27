const dashboardService = require("../services/dashboard.services");

/* 
  GET /api/dashboard/summary
*/
module.exports = {
  getSummary: async function (req, res, next) {
    try {
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
};

