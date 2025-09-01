const jwt = require("jsonwebtoken");

validate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(404).send({ message: "no token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(404).send({ message: "invalid token provided" });
  }
  try {
    const decode = jwt.verify(token, "123");
    req.body = decode;
    next();
  } catch (error) {
    return res.status(404).send({ message: "expired or invalid token" });
  }
};

module.exports = validate;
