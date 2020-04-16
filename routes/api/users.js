const express = require("express");
const router = express.Router();

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
            return res.status(400).json({ message: "email already exists" });
        } else {
            const name = req.body.name;
            const password = req.body.password;

            const newUser = new User({
                name,
                email,
                avatar,
                password,    
            });
        }
    });
});
module.exports = router;
