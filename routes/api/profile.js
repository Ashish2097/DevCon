const express = require("express");
const router = express.Router();

// @route   GET api/profile/test
// @descr   Test profile route
// @access  public

router.get("/test", (req, res) => res.json({ message: "profile page" }));

module.exports = router;
