import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from './models/index.js'; // Correct

dotenv.config();

import "./config/database";
import medicineRoutes from "./api/medicine";
import patientRoutes from "./api/patientroute"; // ✅ Import Routes
import specificRoute from "./api/specificPatient";
import authenticate from "./api/authentication";
// import sendprescription from "./api/sendPrescriptionEmail";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false }) // ⛔️ Only temporarily! This drops and recreates tables
  .then(() => {
    console.log("✅ Database synced with { force: true }");
    // Start the server after syncing
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
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

