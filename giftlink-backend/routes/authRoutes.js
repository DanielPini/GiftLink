const express = require("express");
const app = express();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("../models/db");
const router = express.Router();
const dotenv = require("dotenv");
const pino = require("pino"); // Import Pino logger

const logger = pino(); // Create a Pino logger instance

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req, res) => {
    console.log("Registering user. Request body: ", req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
      const db = await connectToDatabase();

      if (!db) {
        logger.error("Database connection failed");
        return res.status(500).json({ error: "DB connection failed" });
      }

      // Task 2: Access MongoDB collection
      const collection = db.collection("users");

      //Task 3: Check for existing email
      const existingEmail = await collection.findOne({ email: req.body.email });

      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      const email = req.body.email;

      //Task 4: Save user details in database
      const newUser = await collection.insertOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        createdAt: new Date(),
      });

      if (!newUser.acknowledged) {
        logger.error("User insert not acknowledged by MongoDB");
        return res.status(500).json({ error: "Database insert failed" });
      }

      console.log(newUser);

      const payload = {
        user: {
          id: newUser.insertedId,
        },
      };

      const authtoken = jwt.sign(payload, JWT_SECRET);

      logger.info("User registered successfully");
      res.json({ authtoken, email });
    } catch (e) {
      logger.error("Registration error: ", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/login", async (req, res) => {
  console.log("\n\n Inside login");
  try {
    const db = await connectToDatabase();
    if (!db) {
      logger.error("Database connection failed");
      return res.status(500).json({ error: "DB connection failed" });
    }
    const collection = db.collection("users");

    const theUser = await collection.findOne({ email: req.body.email });

    if (!theUser) {
      logger.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatch = await bcryptjs.compare(
      req.body.password,
      theUser.password
    );
    if (!passwordMatch) {
      logger.error("Passwords do not match");
      return res.status(404).json({ error: "Wrong password" });
    }

    const payload = {
      user: {
        id: theUser._id.toString(),
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    const userName = theUser.firstName;
    const userEmail = theUser.email;

    res.json({ authtoken, userName, userEmail });
  } catch (e) {
    return res.status(500).send("Internal server error: ", e);
  }
});

router.put("/update", async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors in update request", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const email = req.headers.email;

    if (!email) {
      logger.error("Email not found in the request headers");
      return res
        .status(400)
        .json({ error: "Email not found in the reqest headers" });
    }

    const db = await connectToDatabase();
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ email });

    if (!existingUser) {
      logger.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    existingUser.firstName = req.body.name;
    existingUser.updatedAt = new Date();

    const updatedUser = await collection.findOneAndUpdate(
      { email },
      { $set: existingUser },
      { returnDocument: "after" }
    );

    const payload = {
      user: {
        id: updatedUser._id.toString(),
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info("User updated successfully");

    res.json({ authtoken });
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
