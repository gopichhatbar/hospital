import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from './models/index.js'; // Correct import for models

dotenv.config();

import "./config/database.js"; // Ensure to include .js extension
import medicineRoutes from "./api/medicine.js"; // Ensure to include .js extension
import patientRoutes from "./api/patientroute.js"; // Ensure to include .js extension
import specificRoute from "./api/specificPatient.js"; // Ensure to include .js extension
import authenticate from "./api/authentication.js"; // Correct import for default export
// import sendprescription from "./api/sendPrescriptionEmail.js"; // Uncomment if needed

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false }) // ⛔️ Only temporarily! This drops and recreates tables
  .then(() => {
    console.log("✅ Database synced with { force: true }");
    // Start the server after syncing
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(" Error syncing database:", err);
  });

app.get("/", (req, res) => {
  res.send("Node.js Backend is Running!");
});
app.use("/patients", patientRoutes);
app.use("/medicine", medicineRoutes);
app.use("/patients", specificRoute);
app.use("/auth", authenticate);
// app.use("/", sendprescription);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
