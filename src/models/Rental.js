var mongodb = require("mongodb");
var dbTools = require("../data/db");
var ObjectId = mongodb.ObjectId;

function rentalsCollection() {
  return dbTools.getDB().collection("rentals");
}

function copyRentalData(rentalData) {
  var doc = {};
  if (rentalData) {
    if (rentalData.customerName !== undefined) {
      doc.customerName = rentalData.customerName;
    }
    if (rentalData.customerEmail !== undefined) {
      doc.customerEmail = rentalData.customerEmail;
    }
    if (rentalData.movieId !== undefined) {
      doc.movieId = rentalData.movieId;
    }
    if (rentalData.days !== undefined) {
      doc.days = rentalData.days;
    }
  }
  return doc;
}

async function getAllRentals() {
  var col = rentalsCollection();
  var pipeline = [
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "movie"
      }
    },
    { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
    { $sort: { rentedOn: -1 } }
  ];
  var list = await col.aggregate(pipeline).toArray();
  return list;
}

async function addRental(rentalData) {
  var col = rentalsCollection();
  var now = new Date();
  var doc = copyRentalData(rentalData);
  if (doc.movieId) {
    doc.movieId = new ObjectId(doc.movieId);
  }
  doc.rentedOn = now;
  doc.returned = false;
  doc.createdAt = now;
  doc.updatedAt = now;
  var result = await col.insertOne(doc);
  doc._id = result.insertedId;
  return doc;
}

async function getRentalById(rentalId) {
  if (!ObjectId.isValid(rentalId)) {
    return null;
  }
  var col = rentalsCollection();
  var rental = await col.findOne({ _id: new ObjectId(rentalId) });
  return rental;
}

async function markRentalReturned(rentalId) {
  if (!ObjectId.isValid(rentalId)) {
    return null;
  }
  var col = rentalsCollection();
  var result = await col.findOneAndUpdate(
    { _id: new ObjectId(rentalId) },
    { $set: { returned: true, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return result.value;
}

module.exports = {
  getAllRentals: getAllRentals,
  addRental: addRental,
  getRentalById: getRentalById,
  markRentalReturned: markRentalReturned
};
