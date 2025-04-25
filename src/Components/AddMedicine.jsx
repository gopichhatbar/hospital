import React, { useState } from "react";
import axios from "axios";

function AddMedicine() {
  const [medicineName, setMedicineName] = useState("");

  const handleAddMedicine = async () => {
    if (!medicineName.trim()) {
      alert("Please enter a medicine name.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/medicine/add`, {
        name_medicine: medicineName,
      });

      alert(response.data.message);
      setMedicineName("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add medicine.");
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="space-y-2 w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Add New Medicine</h2>
        <input
          type="text"
          placeholder="Enter Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddMedicine}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Add Medicine
        </button>
      </div>
    </div>
  );
}

export default AddMedicine;
