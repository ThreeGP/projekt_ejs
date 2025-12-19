const express = require("express");
const {
  listRentals,
  showNewRental,
  createRental,
  finishRental,
  rentalRules
} = require("../controllers/rentalController");

const router = express.Router();

router.get("/", listRentals);
router.get("/new", showNewRental);
router.post("/", rentalRules, createRental);
router.post("/:id/finish", finishRental);

module.exports = router;
