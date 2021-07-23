module.exports = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    next({ status: 400, message: "username and password required" });
  } else {
    req.user = { username: req.body.username, password: req.body.password };
    next();
  }
};
