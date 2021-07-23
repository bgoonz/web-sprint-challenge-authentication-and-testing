module.exports = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    next({
      status: 400,
      message: "please fill in both the username and password field",
    });
  } else {
    req.user = { username: req.body.username, password: req.body.password };
    next();
  }
};
