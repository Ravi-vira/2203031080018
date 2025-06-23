const express = require("express");
const { Log } = require("../middleware/logger");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    throw new Error("Simulate failure");
  } catch (error) {
    await Log("backend", "warn", "handler", "received string, expected bool");
    console.error("Error occurred:", error.message);
    res.status(500).send("error occurree and logged.");
  }
});

const ctrl = require("../controller/shortUrlController");

router.post("/shorturls", ctrl.create);
router.get("/shorturls/:shortcode", ctrl.stats);
router.get("/:shortcode", ctrl.redirect);

module.exports = router;
