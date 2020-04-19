const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../../config/keys");
const passport = require("passport");
// Load user model
const User = require("../../models/Users");

// @route   GET api/users/test
// @descr   Test users route
// @access  public

router.get("/test", (req, res) => res.json({ message: "users page" }));

// @route   GET api/users/test
// @descr   Test users route
// @access  public

router.post("/register", (req, res) => {
    const email = req.body.email;
    User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "email already exists" });
        } else {
            const name = req.body.name;
            const password = req.body.password;
            const avatar = gravatar.url(req.body.email, {
                s: "200", // size
                r: "pg", // rating
                d: "mm", // default
            });
            const newUser = new User({
                name,
                email,
                avatar,
                password,
            });

            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch((err) => console.log(err));
                });
            });
        }
    });
});

// @route   'GET' 'api/user/login'
// @descr   'Login User / Returning JWT token'
// @access  'Public'

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // find user by email
    User.findOne({ email }).then((user) => {
        // check for user
        if (!user) {
            return res.status(400).json({ email: "User not found" });
        }

        // check password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User Matched
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                }; // create jwt payload

                // Sign Token
                jwt.sign(
                    payload,
                    secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "bearer " + token,
                        });
                    }
                );
                // res.json({ message: "success" });
            } else {
                return res.status(400).json({ password: "Incorrect Password" });
            }
        });
    });
});

// @route   'GET' 'api/users/current'
// @descr   'return current user'
// @access  'private'
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json(req.user);
    }
);

module.exports = router;
