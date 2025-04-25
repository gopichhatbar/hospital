import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./models/index.js"; // Sequelize models

dotenv.config();

// Database connection
import "./config/database.js";

// Routes
import medicineRoutes from "./api/medicine.js";
import patientRoutes from "./api/patientroute.js";
import specificRoute from "./api/specificPatient.js";
import authenticate from "./api/authentication.js";
// import sendprescription from "./api/sendPrescriptionEmail.js"; // Uncomment when needed

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Default route
app.get("/", (req, res) => {
  res.send("Node.js Backend is Running!");
});

// API routes
app.use("/auth", authenticate);
app.use("/patients", patientRoutes);       // e.g., /patients, /patients/:id
app.use("/patients", specificRoute);       // e.g., /patients/:id/visits
app.use("/medicine", medicineRoutes);      // e.g., /medicine
// app.use("/", sendprescription);         // Enable when needed

// Start the server after syncing DB
db.sequelize.sync({ force: false }) // Don't reset tables
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Error syncing database:", err);
  });

// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import db from './models/index.js'; // Correct import for models

// dotenv.config();

// import "./config/database.js"; // Ensure to include .js extension
// import medicineRoutes from "./api/medicine.js"; // Ensure to include .js extension
// import patientRoutes from "./api/patientroute.js"; // Ensure to include .js extension
// import specificRoute from "./api/specificPatient.js"; // Ensure to include .js extension
// import authenticate from "./api/authentication.js"; // Correct import for default export
// // import sendprescription from "./api/sendPrescriptionEmail.js"; // Uncomment if needed

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 5000;

// db.sequelize.sync({ force: false }) // ⛔️ Only temporarily! This drops and recreates tables
//   .then(() => {
//     console.log("✅ Database synced with { force: true }");
//     // Start the server after syncing
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error(" Error syncing database:", err);
//   });

// app.get("/", (req, res) => {
//   res.send("Node.js Backend is Running!");
// });
// app.use("/patients", patientRoutes);
// app.use("/medicine", medicineRoutes);
// app.use("/patients", specificRoute);
// app.use("/auth", authenticate);
// // app.use("/", sendprescription);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
