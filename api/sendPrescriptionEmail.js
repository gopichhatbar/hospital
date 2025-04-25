const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
const transporter = require('./emailTransporter');
const router = express.Router();
const { Patient, Visit, Medication, Investigation } = require("../models");


// Static doctor and clinic details
const doctorDetails = {
  doctorName: "Dr. John Doe",
  clinicName: "Healthy Life Clinic",
  clinicAddress: "123 Health Street, Wellness City",
};

// router.get('/patients/:patient_id/visits', async (req, res) => {
//   const { patient_id,visit_id } = req.params;
//   try {
//     // Make a GET request to the external API
//     const response = await axios.get(`http://localhost:5000/patients/${patient_id}/visits/${visit_id}`);
//     // Send the retrieved data as the response
//     res.status(200).json(response.data);
//   } catch (error) {
//     // Handle errors appropriately
//     console.error('Error retrieving visits:', error.message);
//     res.status(500).json({ message: 'Error retrieving visits', error: error.message });
//   }
// });
// API to send prescription email
router.post("/patients/:patient_id/visits/:visit_id", async (req, res,next) => {
  try{
    const {patient_id , visit_id, medicines = []} = req.body;
    const medicineData = medicines.map((med) => ({
      patient_id:patient_id,
      visit_id:visit_id,
      medicine:med.medicine,
      dose: med.dose,
    }));
    console.log("Generated medicine data before saving:", medicineData);
    await Medication.bulkCreate(medicineData);
  }catch{
    console.error("Error details:", error.response ? error.response.data : error.message);
    next(error)
    res.status(500).json({ message: "Failed to send email",error:error.message}); 
  }
   
})
router.post("/send-prescription", async (req, res,next) => {
  console.log("incoming data",req.body);
  
  try {
    const { patientEmail, patient_id, visit_id,medications ,last_visit } = req.body;

    if (!medications || medications.length === 0) {
      return res.status(400).json({ message: "No prescribed medicines found for this visit." });
    }

    // Fetch patient details
    const patientResponse = await axios.get(`http://localhost:5000/patients/${patient_id}`);
    const patientName = patientResponse.data.name;
    console.log(patientName);
    console.log(patientResponse);
    
    // Format the prescription details
    let prescriptionHTML = `
      <h2>${doctorDetails.clinicName}</h2>
      <p><strong>Doctor:</strong> ${doctorDetails.doctorName}</p>
      <p><strong>Clinic Address:</strong> ${doctorDetails.clinicAddress}</p>
      <hr/>
      <p><strong>Patient Name:</strong> ${patientName}</p>
      <p><strong>Visit Date:</strong> ${last_visit}</p>
      <h3>Prescribed Medicines:</h3>
      <ul>
        ${medications.map((med) => `<li>${med.medicine} - ${med.dose}</li>`).join("")}
      </ul>
    `;

    // Email options
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: "Your Prescription Details",
      html: prescriptionHTML,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Prescription email sent successfully!" });

  } catch (error) {
    console.error("Error details:", error.response ? error.response.data : error.message);
    next(error)
    res.status(500).json({ message: "Failed to send email",error:error.message});
  }
});

module.exports = router;

// Start the server
