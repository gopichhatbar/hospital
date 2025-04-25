import React, { useState, useEffect } from "react";
import axios from "axios";

function AddNewPatient() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [medicinesList, setMedicinesList] = useState([{ medicine: "", dose: "" }]);
  const [investigations, setInvestigations] = useState([]); // Investigation History as tags
  const [chargesStatus, setChargesStatus] = useState("pending");
  const [pendingAmount, setPendingAmount] = useState("");
  const [totalAmountPaid, setTotalAmountPaid] = useState(""); // New state for total paid amount
  const [medicines, setMedicines] = useState([]);
  const [errors, setErrors] = useState({});
  const [pending , setPending] = useState(false)

  // const medicines = ["Paracetamol", "Ibuprofen", "Amoxicillin", "Cetirizine"];
  const doses = ["1/2 TDS", "1 TDS", "2 TDS", "3 TDS", "1/5 BD", "1 BD", "2 BD"];
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicine/list`);
        setMedicines(response.data); // ✅ Save fetched medicines in state
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  const handleMedicineChange = (index, field, value) => {
    const updatedList = [...medicinesList];
    updatedList[index][field] = value;
    setMedicinesList(updatedList);
  };

  const addMedicineField = () => {
    setMedicinesList([...medicinesList, { medicine: "", dose: "" }]);
  };
  const removeMedicineField = (index) => {
    if (medicinesList.length > 1) {
      setMedicinesList(medicinesList.filter((_, i) => i !== index));
    }
  };
  const addInvestigation = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setInvestigations([...investigations, e.target.value.trim()]);
      e.target.value = ""; // Clear input after adding
    }
  };

  // Remove Investigation
  const removeInvestigation = (index) => {
    setInvestigations(investigations.filter((_, i) => i !== index));
  };
  const validateForm = () => {
    let newErrors = { medicines: [] };
    if (!name) newErrors.name = "name is required";
    // if (!number) newErrors.number = "number is required";
    if (!number) {
      newErrors.number = "Number is required";
    } else if (!/^\d{10}$/.test(number)) {
      newErrors.number = "Number must be exactly 10 digits";
    }
    
    if (!totalAmountPaid) newErrors.totalAmountPaid = "Total amount paid is required";
    if (chargesStatus === "pending" && !pendingAmount) newErrors.pendingAmount = "Pending amount is required";
    medicinesList.forEach((med, index) => {
      let medError = {};
      if (!med.medicine) medError.medicine = "Medicine selection is required";
      if (!med.dose) medError.dose = "Dose selection is required";

      // Only push an error if any field is invalid
      if (Object.keys(medError).length > 0) {
        newErrors.medicines[index] = { ...medError };
      }
    });
    if (investigations.length === 0) {
      newErrors.investigations = "At least one investigation is required";
    }
    const hasErrors = Object.keys(newErrors).some(
      key => key !== "medicines" || newErrors.medicines.some(err => Object.keys(err).length > 0)
    );
    setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
    return !hasErrors; // Return false if there are errors

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }
    // Prepare data
    const patientData = {
      name,
      number,
      medicines: medicinesList.filter((med) => med.medicine !== ""), // Remove empty entries
      investigations: investigations.map(inv => 
        typeof inv === "string" ? { description: inv } : inv
    ),
      chargesStatus,
      totalAmountPaid,  // Send total amount paid

      pendingAmount: chargesStatus === "pending" ? pendingAmount : 0,
    };
    console.log("patientData", JSON.stringify(patientData, null, 2));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/patients`, patientData);
      alert("Patient added successfully!");
      console.log(response.data);

      // Reset form
      setName("");
      setNumber("");
      setMedicinesList([{ medicine: "", dose: "" }]);
      setInvestigations([]);
      setChargesStatus("pending");
      setPendingAmount("");

    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient.");
    }
    console.log("patientData", JSON.stringify(patientData, null, 2));

  };

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <form className="space-y-2 min-w-[60%] bg-amber-50 rounded-2xl p-10" onSubmit={(e) => e.preventDefault()}>

        <h3 className="text-lg font-semibold">Patient Name</h3>
        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <h3 className="text-lg font-semibold">Patient Number</h3>
        <input
          type="text"
          placeholder="Patient Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        {errors.number && <p className="text-red-500">{errors.number}</p>}


        <h3 className="text-lg font-semibold">Medications</h3>
        {/* {medicinesList.map((item, index) => (
          <div key={index} className="flex gap-6">
            {/* Medicine Selection }
            <select
              value={item.medicine}
              onChange={(e) => handleMedicineChange(index, "medicine", e.target.value)}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Medicine</option>
              {medicines.map((medicine) => (
                <option key={medicine.id_medicine} value={medicine.name_medicine}>
                  {medicine.name_medicine}
                </option>
              ))}
            </select>

            {/* Dose Selection }
            <select
              value={item.dose}
              onChange={(e) => handleMedicineChange(index, "dose", e.target.value)}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Dose</option>
              {doses.map((dose, i) => (
                <option key={i} value={dose}>
                  {dose}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={addMedicineField}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              +
            </button>

            {medicinesList.length > 1 && (
              <button
                type="button"
                onClick={() => removeMedicineField(index)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                -
              </button>
            )}
          </div>
        ))} */}
        {medicinesList.map((item, index) => (
          <div key={index} className="flex gap-6">
            {/* Medicine Selection */}
            <div className="flex-column w-100">
              <select
                value={item.medicine}
                onChange={(e) => handleMedicineChange(index, "medicine", e.target.value)}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id_medicine} value={medicine.name_medicine}>
                    {medicine.name_medicine}
                  </option>
                ))}
              </select>
              {errors.medicines?.[index]?.medicine && (
                <p className="text-red-500">{errors.medicines[index].medicine}</p>
              )}

            </div>

            {/* Dose Selection */}
            <div className="w-100">
              <select
                value={item.dose}
                onChange={(e) => handleMedicineChange(index, "dose", e.target.value)}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Dose</option>
                {doses.map((dose, i) => (
                  <option key={i} value={dose}>
                    {dose}
                  </option>
                ))}
              </select>
              {errors.medicines?.[index]?.dose && (
                <p className="text-red-500">{errors.medicines[index].dose}</p>
              )}

            </div>

            <button
              type="button"
              onClick={addMedicineField}
              className="bg-green-500 text-white px-4 py-2 rounded h-fit"
            >
              +
            </button>

            {medicinesList.length > 1 && (
              <button
                type="button"
                onClick={() => removeMedicineField(index)}
                className="bg-red-500 text-white px-4 py-2 rounded h-fit"
              >
                -
              </button>
            )}
          </div>
        ))}

        <h3 className="text-lg font-semibold">Investigation History</h3>
        <div className="border p-2 rounded w-full flex flex-wrap gap-2 min-h-[40px]">
          {investigations.map((investigation, index) => (
            <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded flex items-center">
              {investigation}
              <button type="button" onClick={() => removeInvestigation(index)} className="ml-2 text-red-500">
                ✖
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Type & press Enter"
            onKeyDown={addInvestigation}
            className="outline-none border-none flex-1"
          />
        </div>
        {errors.investigations && <p className="text-red-500">{errors.investigations}</p>}

        <h3 className="text-lg font-semibold">Charges</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="pending"
              checked={chargesStatus === "pending"}
              onChange={(e) => setChargesStatus(e.target.value)}
              className="form-radio" 
            />
            <span>Pending</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="completed"
              checked={chargesStatus === "completed"}
              onChange={(e) => {
                setChargesStatus(e.target.value);
                setPendingAmount(""); // Reset amount when completed is selected
              }}
              className="form-radio"
            />
            <span>Completed</span>
          </label>
        </div>
        <h3 className="text-lg font-semibold">Total Amount Paid</h3>
        <input
          type="number"
          placeholder="Enter Total Amount Paid"
          value={totalAmountPaid}
          onChange={(e) => setTotalAmountPaid(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        {errors.totalAmountPaid && <p className="text-red-500">{errors.totalAmountPaid}</p>}

        {/* Pending Amount Field (Only Visible if Pending is Selected) */}
        {chargesStatus === "pending" && (
          <input
            type="number"
            placeholder="Enter Pending Amount"
            value={pendingAmount}
            onChange={(e) => setPendingAmount(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        )}
        {errors.pendingAmount   && <p className="text-red-500">{errors.pendingAmount}</p>}

        {/* Add Medicine Button */}



        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleSubmit}
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewPatient;
