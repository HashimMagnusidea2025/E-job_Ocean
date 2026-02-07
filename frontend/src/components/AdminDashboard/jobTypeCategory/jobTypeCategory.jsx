import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";

export default function JobTypeCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", status: "active" });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/job-Type-category");
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = categories.filter((cat) => {
      return (
        cat.name.toLowerCase().includes(value) ||
        cat.status.toLowerCase().includes(value)
      );
    });

    setFilteredCategories(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`/job-Type-category/${formData.id}`, {
          name: formData.name,
          status: formData.status
        });
        Swal.fire("Updated!", "Category has been updated.", "success");
      } else {
        await axios.post("/job-Type-category", {
          name: formData.name,
          status: formData.status
        });
        Swal.fire("Added!", "New category has been added.", "success");
      }
      fetchCategories();
      setFormData({ id: null, name: "", status: "active" });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

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

    if (result.isConfirmed) {
      try {
        await axios.delete(`/job-Type-category/${id}`);
        fetchCategories();
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete category", "error");
      }
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
      cell: ({ row }) =>
        row.original.status === "active" ? (
          <span className="text-green-600 font-semibold">Active</span>
        ) : (
          <span className="text-red-600 font-semibold">Inactive</span>
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


  return (
    <Layout>
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Job Type Categories</h1>
        <div className="flex gap-2">
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
            className="flex items-center bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
          >
            <FaPlus className="mr-2" /> Add Category
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
