const { body, validationResult } = require("express-validator");
const {
  getAllRentals,
  addRental,
  getRentalById,
  markRentalReturned
} = require("../models/Rental");
const {
  getAllMovies,
  getMovieById,
  adjustStock
} = require("../models/Movie");

const rentalRules = [
  body("customerName").trim().notEmpty().withMessage("Imię klienta jest wymagane"),
  body("customerEmail").isEmail().withMessage("E-mail jest błędny"),
  body("movieId").notEmpty().withMessage("Wybierz film"),
  body("days").isInt({ min: 1 }).withMessage("Dni muszą być większe od 0")
];

async function listRentals(req, res, next) {
  try {
    const rentals = await getAllRentals();
    res.render("rentals/list", { title: "Wypożyczenia", rentals });
  } catch (err) {
    next(err);
  }
}

async function showNewRental(req, res, next) {
  try {
    const movies = await getAllMovies({}, { title: 1 });
    res.render("rentals/new", { title: "Nowe wypożyczenie", errors: [], rental: {}, movies });
  } catch (err) {
    next(err);
  }
}

async function createRental(req, res, next) {
  try {
    const movies = await getAllMovies({}, { title: 1 });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("rentals/new", {
        title: "Nowe wypożyczenie",
        errors: errors.array(),
        rental: req.body,
        movies
      });
    }

    const movie = await getMovieById(req.body.movieId);
    if (!movie || movie.stock < 1) {
      const err = new Error("Brak filmu na stanie");
      err.status = 400;
      throw err;
    }

    await adjustStock(String(movie._id), -1);
    await addRental({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      movieId: req.body.movieId,
      days: Number(req.body.days)
    });
    res.redirect("/rentals");
  } catch (err) {
    next(err);
  }
}

async function finishRental(req, res, next) {
  try {
    const rental = await getRentalById(req.params.id);
    if (!rental) {
      const err = new Error("Wypożyczenie nie istnieje");
      err.status = 404;
      throw err;
    }
    if (!rental.returned) {
      await markRentalReturned(req.params.id);
      if (rental.movieId) {
        await adjustStock(String(rental.movieId), 1);
      }
    }
    res.redirect("/rentals");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  rentalRules,
  listRentals,
  showNewRental,
  createRental,
  finishRental
};
