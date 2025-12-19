const bcrypt = require("bcryptjs");
const { connectDB, getDB, closeDB } = require("../data/db");

async function seed() {
  try {
    await connectDB();
    const db = getDB();
    const movies = db.collection("movies");
    const users = db.collection("users");

    await movies.deleteMany({});
    await users.deleteMany({});

    await movies.insertMany([
      {
        title: "Królowie VHS",
        genre: "komedia",
        year: 1999,
        stock: 3,
        dailyPrice: 5,
        description: "Film o kasetach",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Kosmos 2000",
        genre: "sci-fi",
        year: 2000,
        stock: 2,
        dailyPrice: 7,
        description: "Rakieta i pies",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Łzy Ninja",
        genre: "akcja",
        year: 2003,
        stock: 4,
        dailyPrice: 6,
        description: "Ninja płacze",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const hash = await bcrypt.hash("sekret12", 10);
    await users.insertOne({
      username: "admin",
      passwordHash: hash,
      role: "owner",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("Seed gotowy");
  } catch (error) {
    console.error("Seed error", error);
  } finally {
    await closeDB();
  }
}

seed();
