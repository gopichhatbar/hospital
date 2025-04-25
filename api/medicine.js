import express from "express";
import { Medicine } from "../models/index.js";
import { medicinevalidation } from "../validation/user.validation.js";

const router = express.Router();

// ✅ Add New Medicine (Ensuring Uniqueness)
router.post("/add", medicinevalidation, async (req, res) => {
  try {
    const { name_medicine } = req.body;

    if (!name_medicine) {
      return res.status(400).json({ message: "Medicine name is required." });
    }

    const existingMedicine = await Medicine.findOne({ where: { name_medicine } });
    if (existingMedicine) {
      return res.status(400).json({ message: "Medicine already exists." });
    }

    const newMedicine = await Medicine.create({ name_medicine });
    res.status(201).json({ message: "Medicine added successfully", medicine: newMedicine });

  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get All Medicines
router.get("/list", async (req, res) => {
  try {
    const medicines = await Medicine.findAll({ attributes: ["id_medicine", "name_medicine"] });
    res.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Delete a Medicine
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByPk(id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    await medicine.destroy();
    res.json({ message: "Medicine deleted successfully." });

  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

// const express = require("express");
// const router = express.Router();
// const { Medicine } = require("../models");
// const {medicinevalidation} = require("../validation/user.validation");

// // ✅ Add New Medicine (Ensuring Uniqueness)
// router.post("/add",medicinevalidation, async (req, res) => {
//   try {
//     const { name_medicine } = req.body;

//     if (!name_medicine) {
//       return res.status(400).json({ message: "Medicine name is required." });
//     }

//     // Check if medicine already exists
//     const existingMedicine = await Medicine.findOne({ where: { name_medicine } });
//     if (existingMedicine) {
//       return res.status(400).json({ message: "Medicine already exists." });
//     }

//     const newMedicine = await Medicine.create({ name_medicine });
//     res.status(201).json({ message: "Medicine added successfully", medicine: newMedicine });

//   } catch (error) {
//     console.error("Error adding medicine:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // ✅ Get All Medicines
// router.get("/list", async (req, res) => {
//   try {
//     const medicines = await Medicine.findAll({ attributes: ["id_medicine", "name_medicine"] });
//     res.json(medicines);
//   } catch (error) {
//     console.error("Error fetching medicines:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // ✅ Delete a Medicine
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const medicine = await Medicine.findByPk(id);

//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found." });
//     }

//     await medicine.destroy();
//     res.json({ message: "Medicine deleted successfully." });

//   } catch (error) {
//     console.error("Error deleting medicine:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = router;
