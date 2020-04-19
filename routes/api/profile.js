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

// @route   'POST' 'api/profile'
// @descr   'Create or Edit user profile'
// @access  'private'

router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;

        // Skills -> Split into arrays
        if (typeof req.body.skills !== undefined) {
            profileFields.skills = req.body.skills.split(","); // array of skills separated by comas
        }

        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook)
            profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin)
            profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram)
            profileFields.social.instagram = req.body.instagram;

        Profile.findOne({ user: req.user.id }).then((profile) => {
            if (profile) {
                // if profile exists ... update it
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                    .then((profile) => res.json(profile))
                    .catch((err) => res.status(400).json(err));
            } else {
                // no premade profile... create it

                // Check if handle already exists
                Profile.findOne({ handle: profileFields.handle }).then(
                    (profile) => {
                        if (profile) {
                            errors.handle = "That handle already exists";
                            res.status(400).json(errors); // status 400 for validation errors
                        }
                    }
                );

                // Save Profile
                new Profile(profileFields)
                    .save()
                    .then((profile) => res.json(profile));
            }
        });
    }
);

module.exports = router;
