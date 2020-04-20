const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
// Load Profile Model
const Profile = require("../../models/Profile");

// Load User Model
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
            .populate("user", ["name", "avatar"])
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

// @route   'GET' 'api/profile/user/:user_id'
// @descr   'Get profile by userId'
// @access  'Public'

router.get("/user/:user_id", (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
        .populate("user", ["name", "avatar"])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch((err) =>
            res
                .status(404)
                .json({ noprofile: "There is no profile for this user" })
        );
});

// @route   'GET' 'api/profile/handle/:handle'
// @descr   'Get profile by handle'
// @access  'Public'

router.get("/handle/:handle", (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        .populate("user", ["name", "avatar"])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch((err) => res.status(404).json(err));
});

// @route   'GET' 'api/profile/all'
// @descr   'Get all profiles'
// @access  'Public'
router.get("/all", (req, res) => {
    Profile.find()
        .populate("user", ["name", "avatar"])
        .then((profiles) => {
            if (!profiles) {
                errors.noprofile = "There are no profiles";
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch((err) =>
            res.status(404).json({ profile: "There are no profiles" })
        );
});

// @route   'POST' 'api/profile'
// @descr   'Create or Edit user profile'
// @access  'private'

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);

        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

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

// @route   'POST' 'api/profile/experience'
// @descr   'Add experience to profile'
// @access  'Private'
router.post(
    "/experience",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateExperienceInput(req.body);

        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id }).then((profile) => {
            const newExp = (({
                title,
                company,
                location,
                from,
                to,
                current,
                description,
            }) => ({
                title,
                company,
                location,
                from,
                to,
                current,
                description,
            }))(req.body);

            console.log("req.body : ", profile.experience);

            // Add new exp on front
            profile.experience.unshift(newExp);

            profile.save().then((profile) => res.json(profile));
        });
    }
);

// @route   'POST' 'api/profile/education'
// @descr   'Add education to profile'
// @access  'Private'
router.post(
    "/education",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateEducationInput(req.body);

        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id }).then((profile) => {
            const newEdu = (({
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description,
            }) => ({
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description,
            }))(req.body);

            // Add new edu array on front
            profile.education.unshift(newEdu);

            profile.save().then((profile) => res.json(profile));
        });
    }
);

// @route   'DELETE' 'api/profile/experience/:exp_id'
// @descr   'Delete experience from profile'
// @access  'Private'
router.delete(
    "/experience/:exp_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then((profile) => {
                // Get remove index

                const removeIndex = profile.experience
                    .map((item) => item.id)
                    .indexOf(req.params.exp_id);

                profile.experience.splice(removeIndex, 1);

                // Save
                profile.save().then((profile) => res.json(profile));
            })
            .catch((err) => res.status(404).json(err));
    }
);

// @route   'DELETE' 'api/profile/education/:edu_id'
// @descr   'Delete education from profile'
// @access  'Private'
router.delete(
    "/education/:edu_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then((profile) => {
                // Get remove index

                const removeIndex = profile.education
                    .map((item) => item.id)
                    .indexOf(req.params.exp_id);

                profile.education.splice(removeIndex, 1);

                // Save
                profile.save().then((profile) => res.json(profile));
            })
            .catch((err) => res.status(404).json(err));
    }
);

// @route   'DELETE' 'api/profile'
// @descr   'Delete user(no flag) and profile'
// @access  'Private'
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOneAndRemove({ user: req.user.id })
            .then(() => {
                User.findOneAndRemove({ _id: req.user.id }).then(() =>
                    res.json({ success: true })
                );
            })
            .catch((err) => res.status(404).json(err));
    }
);

module.exports = router;
