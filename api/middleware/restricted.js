const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");

module.exports = (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    next({ status: 403, message: "token required" });
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.decodedToken = decoded;
      next();
    } catch (error) {
      next({ status: 401, message: "token invalid" });
    }
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
