const { body, validationResult } = require("express-validator");
const {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  getGenres
} = require("../models/Movie");

const movieRules = [
  body("title").trim().notEmpty().withMessage("Tytuł jest wymagany"),
  body("genre").trim().notEmpty().withMessage("Gatunek jest potrzebny"),
  body("year").isInt({ min: 1900 }).withMessage("Rok musi być liczbą"),
  body("stock").isInt({ min: 0 }).withMessage("Stan to liczba"),
  body("dailyPrice").isFloat({ min: 0 }).withMessage("Cena musi być dodatnia"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Opis do 500 znaków")
];

async function listMovies(req, res, next) {
  try {
    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const sort = req.query.sort || "title";
    const order = req.query.order === "desc" ? -1 : 1;

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (genre) {
      filter.genre = genre;
    }

    const sortObj = {};
    if (["title", "year"].includes(sort)) {
      sortObj[sort] = order;
    } else {
      sortObj.title = 1;
    }

    const [movies, genres] = await Promise.all([
      getAllMovies(filter, sortObj),
      getGenres()
    ]);

    res.render("movies/list", {
      title: "Filmy",
      movies,
      genres,
      filters: { search, genre, sort, order }
    });
  } catch (err) {
    next(err);
  }
}

function showNewMovie(req, res) {
  res.render("movies/new", { title: "Nowy film", errors: [], movie: {} });
}

async function createMovie(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("movies/new", {
      title: "Nowy film",
      errors: errors.array(),
      movie: req.body
    });
  }
  try {
    const movieData = {
      title: req.body.title,
      genre: req.body.genre,
      year: Number(req.body.year),
      stock: Number(req.body.stock),
      dailyPrice: Number(req.body.dailyPrice),
      description: req.body.description || ""
    };
    await addMovie(movieData);
    res.redirect("/movies");
  } catch (err) {
    next(err);
  }
}

async function showMovie(req, res, next) {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      const err = new Error("Film nie istnieje");
      err.status = 404;
      throw err;
    }
    res.render("movies/detail", { title: movie.title, movie });
  } catch (err) {
    next(err);
  }
}

async function editMovie(req, res, next) {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      const err = new Error("Film nie istnieje");
      err.status = 404;
      throw err;
    }
    res.render("movies/edit", { title: "Edytuj film", errors: [], movie });
  } catch (err) {
    next(err);
  }
}

async function updateMovieHandler(req, res, next) {
  const errors = validationResult(req);
  const movieId = req.params.id;
  if (!errors.isEmpty()) {
    return res.status(400).render("movies/edit", {
      title: "Edytuj film",
      errors: errors.array(),
      movie: { ...req.body, _id: movieId }
    });
  }
  try {
    const movieData = {
      title: req.body.title,
      genre: req.body.genre,
      year: Number(req.body.year),
      stock: Number(req.body.stock),
      dailyPrice: Number(req.body.dailyPrice),
      description: req.body.description || ""
    };
    const updated = await updateMovie(movieId, movieData);
    if (!updated) {
      const err = new Error("Film nie istnieje");
      err.status = 404;
      throw err;
    }
    res.redirect(`/movies/${movieId}`);
  } catch (err) {
    next(err);
  }
}

async function deleteMovieHandler(req, res, next) {
  try {
    const removed = await deleteMovie(req.params.id);
    if (!removed) {
      const err = new Error("Film nie istnieje");
      err.status = 404;
      throw err;
    }
    res.redirect("/movies");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  movieRules,
  listMovies,
  showNewMovie,
  createMovie,
  showMovie,
  editMovie,
  updateMovie: updateMovieHandler,
  deleteMovie: deleteMovieHandler
};
