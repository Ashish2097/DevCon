const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Post Model
const Post = require("../../models/Post");

// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @descr   Test post route
// @access  public
router.get("/test", (req, res) => res.json({ message: "posts page" }));

// @route   GET api/posts
// @descr   Get posts
// @access  Public
router.get("/", (req, res) => {
    Post.find().then().catch(err => res.status(404).send(err));
});

// @route   POST api/posts
// @descr   Create post
// @access  Private
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        //Check Validation
        if (!isValid) {
            // if any errors, send 400 with errors object
            return res.status(400).json(errors);
        }
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.body.user,
        });

        newPost.save().then((post) => res.json(post));
    }
);
module.exports = router;
