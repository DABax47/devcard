import express from "express";
import auth from "../../middleware/auth";
import User from "../../models/User";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";
const bcrypt = require("bcrypt");
const router = express.Router();
// @route GET api/auth
// @desc get a registered  user auth token
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    res
      .status(500)
      .json({ msg: console.error(e) })
      .send("sever error");
  }
});
// @route POST api/auth
// @desc login/authenticate/validate user w/ token
// @access Public
router.post(
  "/",
  check("email").isEmail().withMessage("must be a valid email").exists(),
  check("password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json([{ errors: errors.array() }]);
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "invalid login" }] });
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(400).json({ errors: [{ msg: "password error" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const options = {
        expiresIn: 36000000,
      };
      jwt.sign(payload, config.get("jwtSecret"), options, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
