const express = require("express");
const {
  movieRules,
  listMovies,
  showNewMovie,
  createMovie,
  showMovie,
  editMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movieController");

const router = express.Router();

router.get("/", listMovies);
router.get("/new", showNewMovie);
router.post("/", movieRules, createMovie);
router.get("/:id", showMovie);
router.get("/:id/edit", editMovie);
router.post("/:id/update", movieRules, updateMovie);
router.post("/:id/delete", deleteMovie);

module.exports = router;
