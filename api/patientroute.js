const express = require("express");
const {Patient,Visit,Medication,Investigation} = require("../models");
const {addPatientValidation} = require("../validation/user.validation");
// const {Visit} = require("../models")
// const {Medication} = require("../models")

const router = express.Router();

// ✅ Get All Patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get a Single Patient by ID
router.get("/:patient_id", async (req, res) => {
  try {
    const { patient_id } = req.params;

    const patient = await Patient.findOne({
      where: { patient_id },
      attributes: ["patient_id", "name", "number", "totalAmountPaid"], // Include total amount paid
      include: [
        {
          model: Visit,
          as:"Visits",
          attributes: ["visit_id", "lastVisit", "pendingAmount", "totalAmountPaid"], // Include pending amount for each visit
          include: [
            {
              model: Medication,
              attributes: ["medicine", "dose"],
            },
            {
              model: Investigation,
              attributes: ["description"],
            },
          ],
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/",addPatientValidation, async (req, res) => {
  try {
    console.log("🟢 Request Body:", req.body);

    const { name, number, medicines = [], totalAmountPaid,lastVisit,investigations = [], chargesStatus, pendingAmount } = req.body;
    // 1️⃣ Create a new patient
    const newPatient = await Patient.create({ name, number, totalAmountPaid: totalAmountPaid || 0 ,chargesStatus , pendingAmount});
    console.log("✅ Patient Created:", newPatient);
    const newVisit = await Visit.create({ patient_id:newPatient.dataValues.patient_id, lastVisit , pendingAmount});
    const investigationData = investigations.map(inv=>({patient_id:newPatient.dataValues.patient_id,visit_id:newVisit.dataValues.visit_id,description:inv.description}))

    const medicineData = medicines.map(inv=>({patient_id:newPatient.dataValues.patient_id,visit_id:newVisit.dataValues.visit_id,medicine:inv.medicine,dose:inv.dose}))
    
    const newMedicine = await Medication.bulkCreate(medicineData)
    const newInvestigation = await Investigation.bulkCreate(investigationData)

    res.status(201).json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    console.error("❌ Error adding patient:", error.name, error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

router.patch("/:patient_id", async (req, res) => {
  try {
    const { name, number } = req.body;
    const patient = await Patient.findByPk(req.params.patient_id);

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await patient.update({ name, number });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:patient_id/visits/:visit_id", async (req, res) => {
  const { patient_id, visit_id } = req.params;
  const { lastVisit, totalAmountPaid, pendingAmount, medicines, Investigations } = req.body;
  const Medications = medicines || []; // ✅ Correct key used, ensures Medications is always an array

  console.log("🚀 Incoming Request Body:", req.body); // Debugging request body

  try {
    console.log("🛠 Inside Try Block - Request Body:", req.body);

    // ✅ 1. Update Visit Details
    const visit = await Visit.findByPk(visit_id);
    if (!visit) return res.status(404).json({ message: "Visit not found" });

    visit.lastVisit = lastVisit;
    visit.totalAmountPaid = totalAmountPaid;
    visit.pendingAmount = pendingAmount;
    await visit.save();

    // ✅ 2. Update Medications
    const existingMedications = await Medication.findAll({ where: { visit_id } });
    const existingMedsSet = new Set(existingMedications.map(med => med.medicine));
    const newMedsSet = new Set(Medications.map(med => med.medicine)); // ✅ Now using correct Medications

    const medsToDelete = existingMedications.filter(med => !newMedsSet.has(med.medicine));

    console.log("existingMedsSet", existingMedsSet);
    console.log("newMedsSet", newMedsSet);

    if (medsToDelete.length > 0) {
      await Medication.destroy({
        where: { visit_id, medicine: medsToDelete.map(med => med.medicine) }
      });
    }

    // ✅ Insert new medications
    const newMeds = Medications.filter(med => !existingMedsSet.has(med.medicine))
      .map(med => ({
        patient_id,
        visit_id,
        medicine: med.medicine,
        dose: med.dose,
      }));

    console.log("Is Medications an array?", Array.isArray(Medications));
    console.log("Medications Content:", Medications?.map(med => med.medicine));
    console.log("medii", newMeds);

    if (newMeds.length > 0) {
      await Medication.bulkCreate(newMeds);
    }

    // ✅ 3. Update Investigations
    await Investigation.destroy({ where: { visit_id } });

    if (Investigations && Investigations.length > 0) {
      const newInvestigations = Investigations.map(inv => ({
        patient_id,
        visit_id,
        description: inv.description,
      }));
      await Investigation.bulkCreate(newInvestigations);
    }

    // ✅ 4. Fetch and Return Updated Data
    const updatedVisit = await Visit.findOne({
      where: { visit_id },
      include: [
        {
          model: Medication,
          as: "Medications",
          attributes: ["medicine_id", "visit_id", "patient_id", "medicine", "dose"],
        },
        {
          model: Investigation,
          as: "Investigations",
          attributes: ["investigation_id", "visit_id", "patient_id", "description"],
        },
      ],
    });

    console.log("updatedVisit",updatedVisit);
    res.json({ message: "Visit updated successfully", visit: updatedVisit });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: "Error updating visit", error: error.message });
  }
});


// ✅ Delete a Patient
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await patient.destroy();
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
