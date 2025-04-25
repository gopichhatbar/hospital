const { Patient, Visit, Medication, Investigation } = require("../models");
const {specificPatientValidation} = require("../validation/user.validation");

const express = require("express");
const visit = require("../models/visit");

const router = express.Router();


router.post("/:patient_id/visits",specificPatientValidation, async (req, res) => {
  try {
    console.log("🔥 Received req.body:", JSON.stringify(req.body, null, 2));

    const { patient_id } = req.params;
    const {  medicines = [], totalAmountPaid,lastVisit,Investigations = [], chargesStatus, pendingAmount } = req.body;

    // ✅ Check if patient exists
    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // ✅ Create a new Visit
    const newVisit = await Visit.create({
      patient_id,
      lastVisit,
      totalAmountPaid,
      chargesStatus,
      pendingAmount,
    });
    console.log("newvisitdata",newVisit);
    console.log("totalamountpay",totalAmountPaid);
    
    
    console.log("Received medicines data:", medicines);

    const medicineData = medicines.map((med) => ({
      patient_id:newVisit.dataValues.patient_id,
      visit_id:newVisit.dataValues.visit_id,
      medicine:med.medicine,
      dose: med.dose,
    }));
    console.log("Generated medicine data before saving:", medicineData);
    await Medication.bulkCreate(medicineData);
    console.log("🟢 Medications added:", medicineData);

    const investigationData = Investigations.map((inv) => ({
        patient_id:newVisit.dataValues.patient_id,
        visit_id:newVisit.dataValues.visit_id,
        description: inv.description,
    }));
console.log(investigationData);

    if (investigationData.length > 0) {
      await Investigation.bulkCreate(investigationData);
      console.log("🟢 Investigations added:", investigationData);

    }

    res.status(201).json({ message: "Visit added successfully", visit: newVisit });
  } catch (error) {
    console.error("❌ Error adding visit:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


module.exports = router;
