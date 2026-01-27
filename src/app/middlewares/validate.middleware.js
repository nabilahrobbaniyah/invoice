const ALLOWED_SORT = ["name", "created_at"];

module.exports = function validateClientSort(req, res, next) {
  const { sort } = req.query;

  if (!sort) {
    req.sortField = "name"; // default
    return next();
  }

  if (!ALLOWED_SORT.includes(sort)) {
    return res.status(400).json({
      error: {
        code: "INVALID_SORT",
        message: "Invalid sort field"
      }
    });
  }

  req.sortField = sort;
  next();
};