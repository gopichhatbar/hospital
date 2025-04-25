import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [pageSize, setPageSize] = useState(5); // Default: 5 rows per page
  const [srNoOrder, setSrNoOrder] = useState("asc"); // Default: Ascending order

  // Fetch all patients from the API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/patients`)
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  // const handleEditClick = useCallback(
  //   (id) => {
  //     console.log("Edit clicked for ID:", id); // Debugging
  //     console.log("Current Patients List:", patients); // Debugging

  //     const patient = patients.find((p) => p.patient_id === id);
  //     console.log(patient);
      
  //     if (patient) {
  //       setEditPatientId(id);
  //       setEditName(patient.name);
  //       setEditNumber(patient.number);
  //       setErrors({});
  //       console.log("Before setting modalOpen:", modalOpen); // Should still be false

  //       setModalOpen(true);
  //       console.log("After setting modalOpen (immediate):", modalOpen); // Will still log false due to async behavior

  //     }
  //   },
  //   [patients]
  // );
  const handleEditClick = (id) => {
    console.log("Edit clicked for ID:", id);
  
    // Ensure we're using the latest patients state
    setPatients((prevPatients) => {
      console.log("Latest Patients List:", prevPatients);
  
      const patient = prevPatients.find((p) => p.patient_id === id);
      console.log("Found Patient:", patient);
  
      if (patient) {
        setEditPatientId(id);
        setEditName(patient.name);
        setEditNumber(patient.number);
        setErrors({});
        setModalOpen(true);
      }
  
      return prevPatients; // Don't modify state, just log
    });
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/patients/${id}`);
      setPatients((prevPatients) =>
        prevPatients.filter((p) => p.patient_id !== id)
      );
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.number.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  // Define table columns
  const handleColumnReorder = () => {
    setSrNoOrder((prevOrder) => {
      const newOrder = prevOrder === "asc" ? "desc" : "asc";
  
      setColumns((prevColumns) => {
        // Sort all columns dynamically
        const reorderedColumns = newOrder === "asc"
          ? [...prevColumns.sort((a, b) => a.header.localeCompare(b.header))] // Sort A-Z
          : [...prevColumns.sort((a, b) => b.header.localeCompare(a.header))]; // Sort Z-A
  
        return reorderedColumns;
      });
  
      return newOrder;
    });
  };
  


  const [columns, setColumns] = useState([
    {
      header: "Sr No",
      accessorFn: (_, index) => index + 1,
      cell: ({ getValue }) => getValue(),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "number",
      header: "Number",
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "patient_id",
      header: "Actions",
      enableSorting: false,
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <div className="space-x-2">
            <Link to={`/patients/${value}`}>
              <button className="bg-blue-500 text-white px-3 py-1 rounded">Show</button>
            </Link>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEditClick(value)}>
              Edit
            </button>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(value)}>
              Delete
            </button>
          </div>
        );
      },
    },
  ]);

  useEffect(() => {
    console.log("Modal open state updated:", modalOpen);
  }, [modalOpen]);
  

  // React Table setup
  const table = useReactTable({
    data: filteredPatients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } }, // Set default page size
    autoResetPageIndex: false, // Prevent page index reset on data change

  });

  const validateForm = () => {
    let newErrors = {};

    if (!editName.trim()) newErrors.name = "Name is required";
    if (!editNumber.trim()) {
      newErrors.number = "Number is required";
    } else if (!/^\d{10}$/.test(editNumber)) {
      newErrors.number = "Number must be exactly 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    console.log("Updating patient:", editPatientId, editName, editNumber);

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/patients/${editPatientId}`, {
        name: editName,
        number: editNumber,
      });

      axios
        .get(`${import.meta.env.VITE_API_URL}/patients`)
        .then((response) => setPatients(response.data))
        .catch((error) => console.error("Error fetching updated patients:", error));

      setModalOpen(false);
    } catch (error) {
      console.error("Error updating patient:", error.message);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Patients</h2>

      <div className="mb-4 flex items-center space-x-4">
        <label className="font-semibold text-gray-700">Show entries:</label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            table.setPageSize(Number(e.target.value));
          }}
          className="border px-2 py-1 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search by name or number..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 rounded mb-4 w-full"
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className="border p-2 cursor-pointer"
                  draggable={header.column.columnDef.header !== "Sr No"} // Prevent dragging "Sr No"
                  onClick={() => {
                    if (header.column.columnDef.header === "Sr No") {
                      handleColumnReorder();
                    }
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.columnDef.header === "Sr No" && (srNoOrder === "asc" ? " " : " ")}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="text-center">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-800 text-md font-semibold">
          Showing{" "}
          {table.getRowModel().rows.length > 0
            ? table.getState().pagination.pageIndex * pageSize + 1
            : 0}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * pageSize,
            patients.length
          )}{" "}
          of {patients.length} entries
        </span>

        {/* Page number buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: table.getPageCount() }, (_, index) => index + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === table.getPageCount() ||
                (page >= table.getState().pagination.pageIndex - 1 &&
                  page <= table.getState().pagination.pageIndex + 1)
            )
            .map((page, idx, pages) => (
              <React.Fragment key={page}>
                {idx > 0 && page !== pages[idx - 1] + 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => table.setPageIndex(page - 1)}
                  className={`px-3 py-2 rounded ${table.getState().pagination.pageIndex === page - 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                    }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>


      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
            <h3 className="text-lg font-semibold mb-4">Edit Patient</h3>

            <label>Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-2 rounded w-full mb-1"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <label>Number</label>
            <input
              type="text"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              className="border p-2 rounded w-full mb-1"
            />
            {errors.number && <p className="text-red-500">{errors.number}</p>}

            <div className="flex justify-end gap-6">
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                Save
              </button>
              <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllPatients;
