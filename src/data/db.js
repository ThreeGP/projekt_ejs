const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const dbName = "film_rental";

let client;
let db;

async function connectDB() {
    if (db) {
        return db;
    }
    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log(`Connected to MongoDB (${uri}) DB: ${dbName}`);
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database not connected. Call connectDB first.");
    }
    return db;
}

async function closeDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}

module.exports = { connectDB, getDB, closeDB };