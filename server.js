import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from './models/index.js'; // Correct, with ES Module import
import "./config/database.js"; // Correct import with file extension

import medicineRoutes from "./api/medicine.js";  // Correct import with file extension
import patientRoutes from "./api/patientroute.js"; // ✅ Import Routes with file extension
import specificRoute from "./api/specificPatient.js"; // Correct import with file extension
import authenticate from "./api/authentication.js"; // Correct import with file extension
// import sendprescription from "./api/sendPrescriptionEmail.js"; // Uncomment if needed

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false }) // ⛔️ Only temporarily! This drops and recreates tables
  .then(() => {
    console.log("✅ Database synced with { force: false }");
    // Start the server after syncing
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error syncing database:", err);
  });

app.get("/", (req, res) => {
  res.send("Node.js Backend is Running!");
});

app.use("/patients", patientRoutes);
app.use("/medicine", medicineRoutes);
app.use("/patients", specificRoute);
app.use("/auth", authenticate);
// app.use("/", sendprescription); // Uncomment if needed
