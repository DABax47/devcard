import express from "express";
import User from "../../models/User";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";
const bcrypt = require("bcrypt");
const router = express.Router();
// @route POST api/user
// @desc register new user
// @access Public
router.post(
  "/",
  [
    check("email").isEmail().withMessage("must be a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("must be at least 6 chars long "),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ name });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists" }] });
      }
      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

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
