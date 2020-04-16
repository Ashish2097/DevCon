const express = require("express");
const router = express.Router();

// @route   GET api/posts/test
// @descr   Test post route
// @access  public

router.get("/test", (req, res) => res.json({ message: "posts page" }));

module.exports = router;
