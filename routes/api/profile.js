const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile Model
const Profile = require("../../models/Profile");

// Load User Profile Model
const User = require("../../models/Users");

// @route   GET api/profile/test
// @descr   Test profile route
// @access  public

router.get("/test", (req, res) => res.json({ message: "profile page" }));

// @route   'GET' 'api/profile'
// @descr   'Get current users profile'
// @access  'private'

router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};
        Profile.findOne({ user: req.user.id })
            .then((profile) => {
                if (!profile) {
                    errors.noprofile = "There is no profile for this user";
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch((err) => res.status(404).json(err));
    }
);

module.exports = router;
