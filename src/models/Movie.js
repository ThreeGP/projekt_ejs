var mongodb = require("mongodb");
var dbTools = require("../data/db");
var ObjectId = mongodb.ObjectId;

function moviesCollection() {
  return dbTools.getDB().collection("movies");
}

function copyMovieData(movieData) {
  var doc = {};
  if (movieData) {
    if (movieData.title !== undefined) {
      doc.title = movieData.title;
    }
    if (movieData.genre !== undefined) {
      doc.genre = movieData.genre;
    }
    if (movieData.year !== undefined) {
      doc.year = movieData.year;
    }
    if (movieData.stock !== undefined) {
      doc.stock = movieData.stock;
    }
    if (movieData.dailyPrice !== undefined) {
      doc.dailyPrice = movieData.dailyPrice;
    }
    if (movieData.description !== undefined) {
      doc.description = movieData.description;
    }
  }
  return doc;
}

async function getAllMovies(filter, sort) {
  var useFilter = filter || {};
  var useSort = sort || { title: 1 };
  var col = moviesCollection();
  var list = await col.find(useFilter).sort(useSort).toArray();
  return list;
}

async function getMovieById(movieId) {
  if (!ObjectId.isValid(movieId)) {
    return null;
  }
  var col = moviesCollection();
  var movie = await col.findOne({ _id: new ObjectId(movieId) });
  return movie;
}

async function addMovie(movieData) {
  var col = moviesCollection();
  var now = new Date();
  var doc = copyMovieData(movieData);
  doc.createdAt = now;
  doc.updatedAt = now;
  var result = await col.insertOne(doc);
  doc._id = result.insertedId;
  return doc;
}

async function updateMovie(movieId, updates) {
  if (!ObjectId.isValid(movieId)) {
    return null;
  }
  var col = moviesCollection();
  var cleanUpdates = copyMovieData(updates);
  cleanUpdates.updatedAt = new Date();
  var result = await col.findOneAndUpdate(
    { _id: new ObjectId(movieId) },
    { $set: cleanUpdates },
    { returnDocument: "after" }
  );
  return result.value;
}

async function deleteMovie(movieId) {
  if (!ObjectId.isValid(movieId)) {
    return false;
  }
  var col = moviesCollection();
  var result = await col.deleteOne({ _id: new ObjectId(movieId) });
  if (result.deletedCount === 1) {
    return true;
  }
  return false;
}

async function adjustStock(movieId, change) {
  if (!ObjectId.isValid(movieId)) {
    return null;
  }
  var col = moviesCollection();
  var step = Number(change);
  if (isNaN(step)) {
    step = 0;
  }
  var result = await col.findOneAndUpdate(
    { _id: new ObjectId(movieId) },
    {
      $inc: { stock: step },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );
  return result.value;
}

async function getGenres() {
  var col = moviesCollection();
  var genres = await col.distinct("genre");
  return genres;
}

module.exports = {
  getAllMovies: getAllMovies,
  getMovieById: getMovieById,
  addMovie: addMovie,
  updateMovie: updateMovie,
  deleteMovie: deleteMovie,
  adjustStock: adjustStock,
  getGenres: getGenres
};
