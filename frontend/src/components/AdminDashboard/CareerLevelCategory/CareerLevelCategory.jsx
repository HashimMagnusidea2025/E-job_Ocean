import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios"; // adjust relative path as needed
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout";

export default function CareerCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState({ name: "", status: "active" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/career-level-category");
      setCategories(res.data);
      setFilteredCategories(filterCategories(res.data, searchText));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`/career-level-category/${editingId}`, formData);
        const updated = categories.map((c) => (c._id === editingId ? res.data : c));
        setCategories(updated);
        setFilteredCategories(filterCategories(updated, searchText));
        Swal.fire("Updated!", "Category updated successfully", "success");
      } else {
        const res = await axios.post("/career-level-category", formData);
        const updated = [res.data, ...categories];
        setCategories(updated);
        setFilteredCategories(filterCategories(updated, searchText));
        Swal.fire("Added!", "Category created successfully", "success");
      }
      setFormData({ name: "", status: "active" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  
  const handleEdit = (cat) => {
    setFormData({ name: cat.name, status: cat.status });
    setEditingId(cat._id);
    setShowForm(true);
  };


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/career-level-category/${id}`);
          const updated = categories.filter((c) => c._id !== id);
          setCategories(updated);
          setFilteredCategories(filterCategories(updated, searchText));
          Swal.fire("Deleted!", "Category deleted successfully", "success");
        } catch (err) {
          Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        }
      }
    });
  };

  
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const res = await axios.put(`/career-level-category/${id}`, { status: newStatus });
      Swal.fire("Success!", `Status changed to ${newStatus}`, "success");
      const updated = categories.map((c) => (c._id === id ? res.data : c));
      setCategories(updated);
      setFilteredCategories(filterCategories(updated, searchText));
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const filterCategories = (cats, query) => {
    if (!query) return cats;
    return cats.filter(cat =>
      cat.name.toLowerCase().includes(query) ||
      cat.status.toLowerCase().includes(query)
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setFilteredCategories(filterCategories(categories, value.toLowerCase()));
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
            onClick={() => handleEdit(row.original)}
            className="text-green-600"
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
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Career Categories</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by #, name or status..."
            value={searchText}
            onChange={handleSearch}
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={() => {
              setFormData({ name: "", status: "active" });
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaPlus /> Add Category
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

      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: "", status: "active" });
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  {editingId ? "Update" : "Add"}
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
