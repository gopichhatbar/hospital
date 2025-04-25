import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
// import SendPrescription from "./SendPrescription";


function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [reload, setReload] = useState(false);
  const [medicinesList, setMedicinesList] = useState([{ medicine: "", dose: "" }]);
  const [investigations, setInvestigations] = useState([]); // Investigation History as tags
  const [chargesStatus, setChargesStatus] = useState("pending");
  const [pendingAmount, setPendingAmount] = useState("");
  const [totalAmountPaid, setTotalAmountPaid] = useState(""); // New state for total paid amount
  const [medicines, setMedicines] = useState([]);
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditable, setIseditable] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [patientId, setpatientId] = useState(null);
  const [lastVisit, setLastvisit] = useState(null);

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
  const openEditModal = (visit, index) => {
    setSelectedVisitId(visit.visit_id);
    setMedicinesList(visit.Medications.map((med) => ({ medicine: med.medicine, dose: med.dose })));
    setInvestigations(visit.Investigations.map((inv) => inv.description));
    console.log(patient.totalAmountPaid);
    console.log(index);

    setTotalAmountPaid(index === 0 && !isEditable ? patient.totalAmountPaid : visit.totalAmountPaid);
    setPendingAmount(visit.pendingAmount);
    setChargesStatus(visit.pendingAmount > 0 ? "pending" : "completed");
    setTimeout(() => setIsOpen(true), 0); // ✅ Ensure state updates before modal opens
  };
  const validateForm = () => {
    let newErrors = { medicines: [] };
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
    console.log("Submitting form...");
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    console.log("Validation passed!");
    // if (!validateForm()) return;
    setIsOpen(false);
    // console.log(1);

    const newVisit = {
      lastVisit: new Date().toISOString().split("T")[0], // ✅ Current date
      medicines: medicinesList.filter((med) => med.medicine !== ""), // ✅ Only non-empty medicines
      Investigations: investigations.map((desc) => ({ description: desc })), // ✅ Convert to objects
      totalAmountPaid,
      pendingAmount: chargesStatus === "pending" ? pendingAmount : 0,
    };
    console.log("patientData", JSON.stringify(newVisit, null, 2));

    try {
      const url = selectedVisitId
        ? `${import.meta.env.VITE_API_URL}/patients/${id}/visits/${selectedVisitId}` // Update existing visit
        : `${import.meta.env.VITE_API_URL}/patients/${id}/visits`; // Add new visit

      const method = selectedVisitId ? "patch" : "post"; // Choose HTTP method dynamically

      const res = await axios[method](url, newVisit, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res.data);

      alert(selectedVisitId ? "Report updated successfully!" : "Report added successfully!");

      setReload(!reload); // ✅ Toggle to trigger re-fetch
      setIsOpen(false); // Close modal
      setSelectedVisitId(null); // Reset for next time

      // ✅ Update the UI immediately
      setPatient((prev) => ({
        ...prev,
        Visits: prev.Visits.map((v) =>
          v.visit_id === selectedVisitId ? { ...v, ...newVisit } : v
        ),
      }));


      // console.log(response.data);

      // ✅ Reset form
      setMedicinesList([{ medicine: "", dose: "" }]);
      setInvestigations([]);
      setChargesStatus("pending");
      setPendingAmount("");
      setTotalAmountPaid("");

    } catch (error) {
      console.error("Error adding report:", error);
      alert("Failed to add report.");
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/patients/${id}`)
      .then((res) => setPatient(res.data))
      .catch((error) => console.error("Error fetching patient details:", error));
  }, [id, reload]);
  console.log("fetched patient", patient)
  if (!patient) return <p>Loading...</p>;

  // ✅ Calculate total pending amount (sum of all visits)
  const totalPendingAmount = patient.Visits.reduce(
    (sum, visit) => sum + (visit.pendingAmount || 0),
    0
  );
  // const handleSendPrescription = (visitId, patientId,medications = [],lastvisit) => {
  //   setSelectedVisitId(visitId)
  //   setpatientId(patientId)
  //   setLastvisit(lastvisit)
  //   // Implement the logic to send the prescription using the visitId
  //   console.log(`Sending prescription for visit ID: ${visitId}`);
  //   console.log(`Sending prescription for patient ID: ${patientId}`);

  //   const medicines = medications.map((med) => ({
  //     medicine: med.medicine,
  //     dose: med.dose,
  // }));
  //   setMedicinesList(medicines);

  // };

  // console.log("patientData", JSON.stringify(newVisit, null, 2));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{patient.name}'s History</h2>
      <p className="text-gray-700">Phone: {patient.number}</p>

      {/* <SendPrescription patientId={patientId} selectedVisitId={selectedVisitId}   medicines={medicinesList} lastVisit={lastVisit}/> */}

      {/* ✅ Show Total Pending Amount only if greater than 0 */}
      {totalPendingAmount > 0 && (
        <p className="text-red-600 font-semibold">
          Total Pending Amount: ₹{totalPendingAmount}
        </p>
      )}

      {/* Modal Popup for Adding Report */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button className="bg-green-500 my-3 text-white px-3 py-1 rounded"
            onClick={() => {
              setSelectedVisitId(null); // Reset visit ID to ensure add form opens
              setMedicinesList([{ medicine: "", dose: "" }]); // Reset medicine list
              setInvestigations([]); // Reset investigations
              setTotalAmountPaid(""); // Reset total amount paid
              setPendingAmount(""); // Reset pending amount
              setChargesStatus("pending"); // Reset charges status
              setErrors({}); // Clear errors
              setIsOpen(true); // Open modal
            }}
          >Add Report</button>
        </Dialog.Trigger>

        {isOpen && ( // ✅ Only render Dialog when open

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[60%]">
              {/* <Dialog.Title className="text-lg font-semibold my-4">Add Patient Report</Dialog.Title> */}
              <Dialog.Title className="text-lg font-semibold my-4">
                {selectedVisitId ? "Edit Patient Report" : "Add Patient Report"}
              </Dialog.Title>

              <form className="space-y-2 h-[70vh] overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
                <h3 className="text-lg font-semibold">Date</h3>
                <input
                  type="text"
                  value={new Date().toISOString().split("T")[0]}
                  className="border p-2 rounded w-full"
                  disabled
                />
                <h3 className="text-lg font-semibold">Medications</h3>
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
                      <button type="button" onClick={() => removeInvestigation(index)} className="ml-2 text-red-500">✖</button>
                    </span>
                  ))}
                  <input type="text" placeholder="Type & press Enter" onKeyDown={addInvestigation} className="outline-none border-none flex-1" />
                </div>
                {errors.investigations && <p className="text-red-500">{errors.investigations}</p>}

                <h3 className="text-lg font-semibold">Charges</h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" value="pending" checked={chargesStatus === "pending"} onChange={(e) => setChargesStatus(e.target.value)} className="form-radio" />
                    <span>Pending</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" value="completed" checked={chargesStatus === "completed"} onChange={(e) => { setChargesStatus(e.target.value); setPendingAmount(""); }} className="form-radio" />
                    <span>Completed</span>
                  </label>
                </div>

                <h3 className="text-lg font-semibold">Total Amount Paid</h3>
                <input type="number" placeholder="Enter Total Amount Paid" value={totalAmountPaid} onChange={(e) => setTotalAmountPaid(e.target.value)} className="border p-2 rounded w-full" required />
                {errors.totalAmountPaid && <p className="text-red-500">{errors.totalAmountPaid}</p>}

                {chargesStatus === "pending" && (
                  <input type="number" placeholder="Enter Pending Amount" value={pendingAmount} onChange={(e) => setPendingAmount(e.target.value)} className="border p-2 rounded w-full" required />
                )}
                {errors.pendingAmount && <p className="text-red-500">{errors.pendingAmount}</p>}

                {/* 
                <div className="flex space-x-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleSubmit}>Add Report</button>
                </div> */}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleSubmit}>
                  {selectedVisitId ? "Update Report" : "Add Report"}

                </button>


              </form>

              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 text-gray-600" onClick={() => setIsOpen(false)}>✖</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </Dialog.Root>

      <h3 className="mt-4 font-semibold">Visit History</h3>
      {patient.Visits.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Visit Date</th>
              <th className="border p-2">Medications</th>
              <th className="border p-2">Investigations</th>
              <th className="border p-2">Total Amount Paid</th>
              <th className="border p-2">Pending Amount</th>
              <th className="border p-2">Edit</th>
              {/* <th className="border p-2">Send Prescription</th> */}
            </tr>
          </thead>
          <tbody>
            {patient.Visits.map((visit, index) => (
              <tr key={visit.visit_id} className="text-center">
                <td className="border p-2">
                  {new Date(visit.lastVisit).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {visit?.Medications?.length > 0 ? (
                    visit?.Medications?.map((med, index) => (
                      <p key={index}>
                        {med.medicine} ({med.dose})
                      </p>
                    ))
                  ) : (
                    <p>No Medications</p>
                  )}
                </td>
                <td className="border p-2">
                  {visit.Investigations.length > 0 ? (
                    visit.Investigations.map((inv, index) => (
                      <p key={index}>{inv.description}</p>
                    ))
                  ) : (
                    <p>No Investigations</p>
                  )}
                </td>
                <td className="border p-2">₹{index === 0 && !isEditable ? patient.totalAmountPaid : visit.totalAmountPaid}</td>
                <td className="border p-2">₹{visit.pendingAmount}</td>
                <td className="border p-2">
                  <button type="button" className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => {
                    setIseditable(true);
                    openEditModal(visit, index);
                  }}
                  >
                    Edit
                  </button>
                </td>
                {/* <td className="border p-2">
                  <button
                    type="button"
                    className="bg-amber-200 text-white px-3 py-1 rounded"
                    onClick={() => handleSendPrescription(visit.visit_id, patient.patient_id,visit.Medications,visit.lastVisit)}
                  >
                    Send Prescription
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No visit history available.</p>
      )}
    </div>
  );
}

export default PatientDetails;
