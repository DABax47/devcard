import express from "express";
import auth from "../../middleware/auth";
import User from "../../models/User";
import Post from "../../models/Post";
import Profile from "../../models/Profile";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";
const bcrypt = require("bcrypt");
const router = express.Router();
// @route POST api/posts
// @desc get user posts
// @access Private
router.post("/", [auth, [check("text").not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    const newPost = new Post({
      post: req.body.text,
      name: user.name,
      user: req.user.id,
    });
    console.log(user, req.user.id);
    let post = await newPost.save();
    res.json(post);
  } catch (e) {
    console.error("hello", e.message);
    res.status(500).send("server error");
  } finally {
  }
});

module.exports = router;
