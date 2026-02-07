import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaEye } from "react-icons/fa";
import Layout from '../../seekerDashboard/partials/layout'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
const baseURL = import.meta.env.VITE_BACKEND_URL;
const CAFresherListPage = () => {
  const [caFreshers, setCaFreshers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchCAFreshers = async () => {
    try {
      const res = await axios.get("/CA-Fresher");


      const dataWithIndex = res.data.data.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      }));

      setCaFreshers(dataWithIndex);
    } catch (error) {
      console.error("Error fetching CA Freshers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCAFreshers();
  }, []);

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

    caFreshers.forEach((item) => {
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
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div
          className="w-[300px] truncate"
          title={row.original.name}
        >
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      header: "Resume",
      cell: ({ row }) =>
        row.original.ResumeUpload ? (
          <a
            href={`${baseURL}/uploads/resume/${row.original.ResumeUpload}`}
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
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedRow(row.original)}
            className="text-blue-600"
          >
            <FaEye size={20} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: caFreshers,
    columns,
    state: {
      globalFilter: searchText,
    },
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-6">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="p-6">

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


          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold border"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-2 border text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                      No CA Freshers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        
          {selectedRow && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-120 max-w-lg shadow-lg">
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