require("dotenv").config({ path: "../util/import-mongo/.env" });
const MongoClient = require("mongodb").MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
  try {
    if (dbInstance) {
      return dbInstance;
    }

    const client = new MongoClient(url);

    // Task 1: Connect to MongoDB
    await client.connect();

    // Task 2: Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db(dbName);

    // Task 3: Return database instance
    return dbInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    throw error;
  }
}

module.exports = connectToDatabase;
