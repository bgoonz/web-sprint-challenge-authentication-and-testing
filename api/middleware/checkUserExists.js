const Users = require("../auth/users-model");

module.exports = async (req, res, next) => {
  const user = await Users.get({
    username: req.body.username,
    password: req.body.password,
  });
  if (!user) {
    req.user.exists = false;
  } else {
    req.user = { ...user, exists: true };
  }
  next();
};
