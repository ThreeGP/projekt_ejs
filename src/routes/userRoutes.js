const express = require("express");
const { listUsers, showNewUser, createUser, userRules } = require("../controllers/userController");

const router = express.Router();

router.get("/", listUsers);
router.get("/new", showNewUser);
router.post("/", userRules, createUser);

module.exports = router;
