import React, { useEffect, useState } from "react";
import axios from '../../../utils/axios.js';
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function FunctionalAreaCategory() {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", status: "active" });

  // Fetch data
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/functionalArea-Category');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Open modal for Add/Edit
  const openModal = (category = { id: null, name: "", status: "active" }) => {
    setFormData(category);
    setModalOpen(true);
  };

  // Save category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`/functionalArea-Category/${formData.id}`, {
          name: formData.name,
          status: formData.status
        });
        Swal.fire("Updated!", "Category updated successfully", "success");
      } else {
        await axios.post('/functionalArea-Category', {
          name: formData.name,
          status: formData.status
        });
        Swal.fire("Added!", "Category created successfully", "success");
      }
      fetchCategories();
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // Delete category with SweetAlert confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/functionalArea-Category/${id}`);
        fetchCategories();
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  // Toggle status
  const handleToggleStatus = async (id, status) => {
    const newStatus = status === "active" ? "inactive" : "active";
    try {
      await axios.put(`/functionalArea-Category/${id}`, { status: newStatus });
      fetchCategories();
      Swal.fire("Success!", `Status changed to ${newStatus}`, "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // Table columns
  const columns = [
    {
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-white text-xs ${row.original.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {row.original.status}
          </span>
          <button
            onClick={() => handleToggleStatus(row.original._id, row.original.status)}
            className="p-1 rounded hover:bg-gray-200"
            title="Toggle Status"
          >
            {row.original.status === "active" ? (
              <FaToggleOn size={26} className="text-green-500" />
            ) : (
              <FaToggleOff size={26} className="text-red-500" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <FaEdit
            size={20}
            className="text-blue-500 cursor-pointer"
            onClick={() => openModal({ id: row.original._id, name: row.original.name, status: row.original.status })}
          />
          <FaTrash
            size={20}
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(row.original._id)}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: categories,
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
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Functional Area Categories</h1>
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 mb-4 rounded"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          onClick={() => openModal()}
          className="flex items-center bg-green-500 text-white px-3 rounded hover:bg-green-600"
        >
          <FaPlus /> Add Category
        </button>
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
                  No categories found
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {formData.id ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                className="border px-3 py-2 w-full rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <select
                className="border px-3 py-2 w-full rounded"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}
