import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { FaTrash } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const KnowledgeBaseRegisterList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch registrations
  const fetchData = async () => {
    try {
      const res = await axios.get("/knowlege-base-register");
      if (res.data.success) {
        setData(res.data.data);
        setFilteredData(res.data.data);
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch registrations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete registration function
  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        await axios.delete(`/knowlege-base-register/${id}`);
        Swal.fire("Deleted!", "Registration has been deleted.", "success");
        fetchData(); // refresh table
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete registration", "error");
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = data.filter((item) => {
      return (
        item.firstName.toLowerCase().includes(value) ||
        item.lastName.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.mobile.toLowerCase().includes(value) ||
        (item.knowlegeBaseId?.title || "").toLowerCase().includes(value)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      header: "Knowledge Base Title",
      cell: ({ row }) => row.original.knowlegeBaseId?.title || "N/A",
    },
    {
      header: "Download",
      cell: ({ row }) =>
        row.original.knowlegeBaseId?.uploadPDF ? (
          <a
            href={`${baseURL}/${row.original.knowlegeBaseId.uploadPDF}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View PDF
          </a>
        ) : (
          <span className="text-gray-400">No File</span>
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original._id)}
          className="text-red-500 hover:text-red-700 p-2 rounded"
          title="Delete"
        >
          <FaTrash size={18} />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter: searchText,
    },
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Layout>
      <div className="p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Knowledge Base Registrations</h2>
          <input
            type="text"
            placeholder="Search registrations..."
            value={searchText}
            onChange={handleSearch}
            className="border p-2 rounded"
          />
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
                    No registrations found
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
      </div>
    </Layout>
  );
};

export default KnowledgeBaseRegisterList;
