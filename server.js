const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

require("./config/database")
const medicineRoutes = require("./api/medicine")
const patientRoutes = require("./api/patientroute"); // ✅ Import Routes
const specificRoute = require("./api/specificPatient")
const authenticate = require("./api/authentication")
const sendprescription = require("./api/sendPrescriptionEmail")

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Node.js Backend is Running!");
});
app.use("/patients",patientRoutes);
app.use("/medicine",medicineRoutes);
app.use("/patients",specificRoute);
app.use("/auth",authenticate);
app.use("/",sendprescription);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
