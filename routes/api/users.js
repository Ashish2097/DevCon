const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");

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

    //find user by email
    User.findOne({ email }).then((user) => {
        // check for user
        if (!user) {
            return res.status(400).json({ email: "User not found" });
        }

        // check password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // correct password
                res.json({ message: "success" });
            } else {
                return res.status(400).json({ password: "Incorrect Password" });
            }
        });
    });
});
module.exports = router;
