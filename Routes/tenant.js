// routes/tenants.js
const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/auth");
const {rolecheck} = require("../middleware/role");

const {upgradePlan} = require('../Controllers/subscription');

router.post("/:slug/upgrade", authMiddleware, rolecheck("ADMIN"), upgradePlan);

module.exports = router;
