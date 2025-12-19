import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useMemo } from "react";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import KnowledgeBaseForm from "../KnowledgeBaseForm/KnowledgeBaseForm.jsx";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
const baseURL = import.meta.env.VITE_BACKEND_URL;
export default function KnowledgeBaseList() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null); // For edit mode
    const [showForm, setShowForm] = useState(false);
      const [globalFilter, setGlobalFilter] = useState("");

    // Fetch Data
    const fetchData = async () => {
        try {
            const res = await axios.get("/knowlege-base");
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load data", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Delete Function
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/knowlege-base/${id}`);
                    Swal.fire("Deleted!", "Record has been deleted.", "success");
                    fetchData();
                } catch (err) {
                    Swal.fire("Error", "Failed to delete record", "error");
                }
            }
        });
    };

    // Enhanced View Function with detailed information
    const handleView = (row) => {
        Swal.fire({
            title: `<h2>${row.title}</h2>`,
            html: `
                <div style="text-align: left; max-height: 60vh; overflow-y: auto;">
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Description</h3>
                        <p style="margin: 0; line-height: 1.5;">${row.description || "No description available"}</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Keywords</h3>
                            <p style="margin: 0;">${row.keywords || "-"}</p>
                        </div>
                        
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Tags</h3>
                            <p style="margin: 0;">${row.tags || "-"}</p>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Status</h3>
                            <p style="margin: 0;">
                                <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; 
                                    background-color: ${row.fromStatus === 'Enabled' ? '#d1fae5' : '#fee2e2'}; 
                                    color: ${row.fromStatus === 'Enabled' ? '#065f46' : '#991b1b'};">
                                    ${row.fromStatus || 'Enabled'}
                                </span>
                            </p>
                        </div>
                        
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">PDF Document</h3>
                            <p style="margin: 0;">
                                ${row.uploadPDF ?
                    `<a href="${baseURL}/${row.uploadPDF}" target="_blank" style="color: #339ca0; text-decoration: none; font-weight: bold;">
                                        📄 View PDF
                                    </a>`
                    : "No PDF uploaded"
                }
                            </p>
                        </div>
                    </div>
                    
                    ${row.createdAt ? `
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Created Date</h3>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            ${new Date(row.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                        </p>
                    </div>
                    ` : ''}
                    
                    ${row.updatedAt && row.updatedAt !== row.createdAt ? `
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Last Updated</h3>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            ${new Date(row.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                        </p>
                    </div>
                    ` : ''}
                </div>
            `,
            icon: "info",
            confirmButtonText: "Close",
            confirmButtonColor: "#339ca0",
            width: "700px",
            customClass: {
                popup: 'knowledge-base-popup'
            }
        });
    };
   // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        header: "ID",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Keywords",
        accessorKey: "keywords",
      },
      {
        header: "PDF",
        cell: ({ row }) =>
          row.original.uploadPDF ? (
            <a
              href={`${baseURL}/${row.original.uploadPDF}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
          ) : (
            "-"
          ),
      },
      {
        header: "From Status",
        accessorKey: "fromStatus",
      },
      {
        header: "Status",
        accessorKey: "status",
      },
      {
        header: "Count",
        accessorKey: "count",
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-3">
            <FaEye size={20}
              className="text-blue-500 cursor-pointer"
              onClick={() => handleView(row.original)}
            />
            <FaEdit size={20}
              className="text-green-500 cursor-pointer"
              onClick={() => {
                setSelectedData(row.original);
                setShowForm(true);
              }}
            />
            <FaTrash size={20}
              className="text-red-500 cursor-pointer"
              onClick={() => handleDelete(row.original._id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  // ================= TABLE INSTANCE =================
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });



    const handleEdit = (row) => {
        // navigate or open modal
        Swal.fire("Edit Mode", `Edit record: ${row.title}`, "info");
    };

    if (showForm)
        return <KnowledgeBaseForm selectedData={selectedData} onSuccess={() => { fetchData(); setShowForm(false); }} />;
    return (
        <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4"> Knowledge Base List</h2>

        {/* Search + Add */}
        <div className="flex justify-between mb-4">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border px-3 py-2 rounded w-64"
          />
          <button
            onClick={() => {
              setSelectedData(null);
              setShowForm(true);
            }}
            className="bg-[#339ca0] text-white px-4 py-2 rounded"
          >
            + Add Knowledge Base
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="p-3 text-left border">
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded"
          >
            Previous
          </button>

          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
    );
}
