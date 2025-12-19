function notFound(req, res, next) {
  const err = new Error("Strona nie istnieje");
  err.status = 404;
  next(err);
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Coś poszło nie tak";
  if (req.accepts("html")) {
    res.status(status).render("error", { title: "Błąd", message, status });
  } else {
    res.status(status).json({ status, message });
  }
}

module.exports = { notFound, errorHandler };
