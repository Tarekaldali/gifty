import mongoose from "mongoose"; // Import Mongoose ODM to interact with MongoDB
import dotenv from "dotenv"; // Import dotenv to load environment variables from a .env file
import express from "express"; // Import Express framework for HTTP server and routing
import cors from "cors"; // Import CORS to allow requests from the React frontend
import bcrypt from "bcrypt"; // Import bcrypt to hash passwords before saving
import jwt from "jsonwebtoken"; // Import JWT to create login tokens
 const app = express(); // Create an Express application instance
app.use(cors()); // Allow cross-origin requests (React on port 5173 → Express on 8000)
app.use(express.json()); // Parse incoming JSON request bodies
dotenv.config(); // Load environment variables into process.env
const PORT = process.env.PORT || 8000; // Use port from env or default to 8000
const MONGO_URL = process.env.MONGO_URL; // MongoDB connection string from environment

mongoose.connect(MONGO_URL).then(() => { // Connect to MongoDB with the provided URL
  console.log("Connected to MongoDB"); // Log successful DB connection
  app.listen(PORT, () => { // Start the Express server once DB connection succeeds
    console.log(`Server is running on port ${PORT}`); // Log the active port
  });
}).catch((error) => { // Handle connection errors
  console.error("Error connecting to MongoDB:", error); // Log the error details
});

const userSchema = new mongoose.Schema({ // Define a Mongoose schema for User documents
  name:     { type: String, required: true },          // User's display name
  email:    { type: String, required: true, unique: true }, // Unique email for login
  password: { type: String, required: true },          // Hashed password (never plain text)
});
const User = mongoose.model("User", userSchema); // Create a Mongoose model named 'User'

// ─── REGISTER ────────────────────────────────────────────────────────────────
app.post("/register", async (req, res) => { // Create a new account
  try {
    const { name, email, password } = req.body; // Pull fields from request body
    const hashed = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds
    const user = await User.create({ name, email, password: hashed }); // Save to MongoDB
    res.status(201).json({ message: "User registered!", id: user._id }); // Return success
  } catch (error) {
    res.status(400).json({ error: error.message }); // Email already taken or missing fields
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
app.post("/login", async (req, res) => { // Check credentials and return a token
  try {
    const { email, password } = req.body; // Pull email and password from request
    const user = await User.findOne({ email }); // Find user by email in the database
    if (!user) return res.status(404).json({ error: "User not found" }); // No account
    const match = await bcrypt.compare(password, user.password); // Compare with hashed pw
    if (!match) return res.status(401).json({ error: "Wrong password" }); // Bad password
    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" }); // Make JWT
    res.json({ message: "Login successful!", token }); // Return the token
  } catch (error) {
    res.status(500).json({ error: error.message }); // Server error
  }
});

app.get("/users", async (req, res) => { // Define a GET endpoint at /users
  try { // Try to fetch users from the database
    const users = await User.find(); // Retrieve all User documents
    res.json(users); // Respond with users as JSON
  } catch (error) { // If an error occurs
    res.status(500).json({ error: error.message }); // Send 500 with the error message
  }
});

app.get("/users/:id", async (req, res) => { // Get a single user by ID
  try {
    const user = await User.findById(req.params.id); // Find user document by _id
    if (!user) return res.status(404).json({ error: "User not found" }); // 404 if missing
    res.json(user); // Return the found user
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle invalid IDs or DB errors
  }
});

app.post("/users", async (req, res) => { // Create a new user (insert)
  try {
    const newUser = new User(req.body); // Build a User from request body
    const saved = await newUser.save(); // Save to MongoDB
    res.status(201).json(saved); // Return created document with 201 status
  } catch (error) {
    res.status(400).json({ error: error.message }); // Validation or other client errors
  }
});

app.put("/users/:id", async (req, res) => { // Update an existing user by ID
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Update and return new doc
    if (!updated) return res.status(404).json({ error: "User not found" }); // 404 if missing
    res.json(updated); // Return updated document
  } catch (error) {
    res.status(400).json({ error: error.message }); // Validation or other client errors
  }
});

app.delete("/users/:id", async (req, res) => { // Delete a user by ID
  try {
    const deleted = await User.findByIdAndDelete(req.params.id); // Remove the document
    if (!deleted) return res.status(404).json({ error: "User not found" }); // 404 if missing
    res.json({ message: "User deleted", id: deleted._id }); // Confirm deletion
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
});