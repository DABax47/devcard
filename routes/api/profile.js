import express from "express";
import auth from "../../middleware/auth";
import Profile from "../../models/Profile";
import User from "../../models/User";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";
const router = express.Router();
// @route GET api/profile/
// @desc get all user profile
// @access Public
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("user", ["name"]);
    if (!profile) {
      return res.json({ msg: "profile doesnt exist" });
    }
    res.json(profile);
  } catch (e) {
    console.error(e.message());
    res.status(500).json({ msg: "server error" });
  }
});
// @route GET api/profile/me
// @desc get current user profile
// @access Public
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name"]);
    if (!profile) {
      return res.json({ msg: "profile doesn't exist" });
    }
    return res.json(profile);
  } catch (e) {
    console.error(e.message());
    res.status(500).json({ msg: "server error" });
  }
});

// @route GET api/profile/user/:user_id
// @desc get  user profile by id
// @access Private
router.get("/user/:user_id", async ({ params: { user_id } }, res) => {
  try {
    const profile = await Profile.findOne({
      user: user_id,
    }).populate("user", ["name"]);

    if (!profile) {
      return res.ststus(400).json({ msg: "profile not found" });
    }
    return res.json(profile);
  } catch (e) {
    console.error(e.message());
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.status(500).json({ msg: "server error" });
  }
});

// @route Post api/profile
// @desc create or update a user profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status").not().isEmpty().withMessage("required"),
      check("interests").not().isEmpty().withMessage("required"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, status, interests, bio, github } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (name) profileFields.name = name;
    if (status) profileFields.status = status;
    if (interests) {
      profileFields.interests = interests
        .split(",")
        .map((interest) => interest.trim());
    }
    if (bio) profileFields.bio = bio;
    if (github) profileFields.github = github;
    try {
      let profile = await User.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).json({ msg: "server error" });
    }
  }
);

module.exports = router;
