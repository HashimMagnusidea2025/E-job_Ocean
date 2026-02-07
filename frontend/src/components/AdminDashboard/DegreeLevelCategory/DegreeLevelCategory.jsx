import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "../../../utils/axios.js"; // Adjust path to your axios instance
import Layout from "../../seekerDashboard/partials/layout.jsx";

export default function DegreeLevelCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", status: "active" });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/degree-Level-Category");
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(value) ||
        category.status.toLowerCase().includes(value)
      );
    });

    setFilteredCategories(filtered);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.id) {
        await axios.put(`/degree-Level-Category/${formData.id}`, {
          name: formData.name,
          status: formData.status
        });
        Swal.fire("Updated!", "Category updated successfully", "success");
      } else {
        await axios.post("/degree-Level-Category", {
          name: formData.name,
          status: formData.status
        });
        Swal.fire("Added!", "Category added successfully", "success");
      }

      fetchCategories();
      setModalOpen(false);
      setFormData({ id: null, name: "", status: "active" });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

   const handleToggleStatus = async (id, currentStatus) => {
     const newStatus = currentStatus === "active" ? "inactive" : "active";
      const category = categories.find(cat => cat._id === id);
    try {
      await axios.put(`/degree-Level-Category/${id}`, {
       name: category.name,
        status: newStatus
      });
     Swal.fire("Updated!", `Status changed to ${newStatus}`, "success");
      fetchCategories();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/degree-Level-Category/${id}`);
      Swal.fire("Deleted!", "Category has been deleted.", "success");
      fetchCategories();
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

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
            className={`px-2 py-1 text-xs rounded text-white ${
              row.original.status === "active" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {row.original.status}
          </span>
          <button onClick={() => handleToggleStatus(row.original._id, row.original.status)}>
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
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFormData({ id: row.original._id, name: row.original.name, status: row.original.status });
              setModalOpen(true);
            }}
            className="text-blue-600"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="text-red-600"
          >
            <FaTrash size={20} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredCategories,
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Degree Level Categories</h2>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchText}
          onChange={handleSearch}
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            setFormData({ id: null, name: "", status: "active" });
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Category
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
          <div className="bg-white p-6 rounded w-96 shadow-lg">
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
