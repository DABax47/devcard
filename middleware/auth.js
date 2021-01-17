import jwt from "jsonwebtoken";
import config from "config";

module.exports = function (req, res, next) {
  //get token from client
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "no totken, autherization denied" });
  }
  // verify toeken
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "token not valid" });
  } finally {
  }
};
