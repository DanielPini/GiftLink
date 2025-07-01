const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");

dotenv.config({ path: "../util/import-mongo/.env" });

let dbInstance = null;

async function connectToDatabase() {
  try {
    if (dbInstance) {
      console.log("Using existing MongoDB connection");
      return dbInstance;
    }

    // MongoDB connection URL with authentication options
    const url = `${process.env.MONGO_URL}`;
    console.log("\nAttempting to connect to MongoDB at:", url);

    const dbName = `${process.env.DB_NAME}`;

    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    // Task 1: Connect to MongoDB
    await client.connect();
    console.log("\nSuccessfully connectedc to MongoDB");
    console.log(`Connected to database: ${dbName}`);
    console.log("=================================");

    // Task 2: Connect to database giftsDB and store in variable dbInstance
    dbInstance = client.db(dbName);

    // Task 3: Return database instance
    return dbInstance;
  } catch (error) {
    console.error("\nError connecting to MongoDB: ", error);
    console.log("=================================");
    throw error;
  }
}

// Initial connection attempt when the file is loaded
console.log("\nInitializing MongoDB Connection...");
connectToDatabase()
  .then(() => console.log("Application ready to handle requests"))
  .catch((err) => console.error("Initial connection failed:", err));

module.exports = connectToDatabase;
