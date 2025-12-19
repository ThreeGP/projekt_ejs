var dbTools = require("../data/db");

function usersCollection() {
  return dbTools.getDB().collection("users");
}

function copyUserData(userData) {
  var doc = {};
  if (userData) {
    if (userData.username !== undefined) {
      doc.username = userData.username;
    }
    if (userData.passwordHash !== undefined) {
      doc.passwordHash = userData.passwordHash;
    }
    if (userData.role !== undefined) {
      doc.role = userData.role;
    }
  }
  return doc;
}

async function getAllUsers() {
  var col = usersCollection();
  var list = await col.find().sort({ createdAt: -1 }).toArray();
  return list;
}

async function addUser(userData) {
  var col = usersCollection();
  var now = new Date();
  var doc = copyUserData(userData);
  doc.createdAt = now;
  doc.updatedAt = now;
  var result = await col.insertOne(doc);
  doc._id = result.insertedId;
  return doc;
}

async function findUserByUsername(username) {
  var col = usersCollection();
  var user = await col.findOne({ username: username });
  return user;
}

module.exports = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  findUserByUsername: findUserByUsername
};
