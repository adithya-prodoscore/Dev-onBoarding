import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

//Module Imports
import auth from "./modules/auth/auth.routes.js";

dotenv.config();
const app = express();

mongoose
  .connect("mongodb://localhost:27017/dev-onboarding-proj")
  .then(() => console.log("Connected to mongodb"))
  .catch(() => console.log("Cannot connect to mongodb"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", auth);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
