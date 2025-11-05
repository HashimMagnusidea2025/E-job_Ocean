import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../../utils/axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaEye } from "react-icons/fa";
import Layout from '../../seekerDashboard/partials/layout'
const baseURL = import.meta.env.VITE_BACKEND_URL;
const CAFresherListPage = () => {
  const [caFreshers, setCaFreshers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchCAFreshers = async () => {
    try {
      const res = await axios.get("/CA-Fresher");

      // ✅ Persistent Index Number
      const dataWithIndex = res.data.data.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      }));

      setCaFreshers(dataWithIndex);
      setFilteredData(dataWithIndex);
    } catch (error) {
      console.error("Error fetching CA Freshers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCAFreshers();
  }, []);

  useEffect(() => {
    const filtered = caFreshers.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, caFreshers]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("CA Freshers");

    worksheet.columns = [
      { header: "Index", key: "serialNumber", width: 8 },
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Qualification", key: "qualification", width: 15 },
      { header: "Experience", key: "experience", width: 12 },
      { header: "Profile", key: "jobProfile", width: 15 },
      { header: "Location", key: "jobLocation", width: 15 },
      { header: "Passing Month", key: "passingMonth", width: 15 },
      { header: "Passing Year", key: "passingYear", width: 12 },
      { header: "Resume", key: "ResumeUpload", width: 30 },
    ];

    filteredData.forEach((item) => {
      worksheet.addRow({
        ...item,
        ResumeUpload: item.ResumeUpload
          ? `${baseURL}/uploads/resume/${item.ResumeUpload}`
          : "N/A",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "CA_Freshers.xlsx");
  };

  const columns = [
    {
      name: "Index",
      selector: (row) => row.serialNumber,
      width: "90px",
      sortable: true,
    },

    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div
          className="w-[300px] truncate"
          title={row.name} // Hover par full name
        >
          <div className=" w-[300px]">
            {row.name}
          </div>
        </div>
      ),
    },

    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone },
    { name: "Qualification", selector: (row) => row.qualification },
    { name: "Experience", selector: (row) => row.experience },
    { name: "Profile", selector: (row) => row.jobProfile },
    { name: "Location", selector: (row) => row.jobLocation },
    { name: "Passing Month", selector: (row) => row.passingMonth },
    { name: "Passing Year", selector: (row) => row.passingYear },
    {
      name: "Resume",
      cell: (row) =>
        row.ResumeUpload ? (
          <a
            href={`${baseURL}/uploads/resume/${row.ResumeUpload}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRow(row)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEye size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">CA Fresher Submissions</h2>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none w-full md:w-64"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Export to Excel
              </button>
            </div>
          </div>

          {/* DataTable */}
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredData}
              progressPending={loading}
              pagination
              highlightOnHover
              striped
              responsive
              noDataComponent="No CA Freshers found"
              onRowClicked={(row) => setSelectedRow(row)}
              pointerOnHover
            />
          </div>

          {/* Modal */}
          {selectedRow && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-80 max-w-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Candidate Details</h3>
                <div className="space-y-2 ">
                  <p><strong>Name:</strong> {selectedRow.name}</p>
                  <p><strong>Email:</strong> {selectedRow.email}</p>
                  <p><strong>Phone:</strong> {selectedRow.phone}</p>
                  <p><strong>Qualification:</strong> {selectedRow.qualification}</p>
                  <p><strong>Experience:</strong> {selectedRow.experience}</p>
                  <p><strong>Profile:</strong> {selectedRow.jobProfile}</p>
                  <p><strong>Location:</strong> {selectedRow.jobLocation}</p>
                  <p><strong>Passing Month:</strong> {selectedRow.passingMonth}</p>
                  <p><strong>Passing Year:</strong> {selectedRow.passingYear}</p>
                  <p>
                    <strong>Resume:</strong>{" "}
                    {selectedRow.ResumeUpload ? (
                      <a
                        href={`${baseURL}/uploads/resume/${selectedRow.ResumeUpload}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedRow(null)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default CAFresherListPage;




// components/CAImport.jsx
// import { useState } from "react";
// import api from "../../../utils/axios.js";
// import Swal from "sweetalert2";
// export default function CAFresherListPage() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };
//   const handleImport = async () => {
//     if (!file) {
//       Swal.fire("Error", "Please select a JSON file", "error");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     setLoading(true);
//     try {
//       const res = await api.post("/CA-Fresher/ca/import", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       Swal.fire(
//         "Success",
//         `${res.data.count} records imported successfully`,
//         "success"
//       );
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", err.response?.data?.message || "Import failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Import CA Fresher Registrations</h2>
//       <input type="file" accept=".json" onChange={handleFileChange} />
//       <button onClick={handleImport} disabled={loading}>
//         {loading ? "Importing..." : "Import JSON"}
//       </button>
//     </div>
//   );
// }