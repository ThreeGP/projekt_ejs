const express = require("express");
const movieRoutes = require("./movieRoutes");
const rentalRoutes = require("./rentalRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", { title: "Wypożyczalnia" });
});

router.use("/movies", movieRoutes);
router.use("/rentals", rentalRoutes);
router.use("/users", userRoutes);

module.exports = router;
