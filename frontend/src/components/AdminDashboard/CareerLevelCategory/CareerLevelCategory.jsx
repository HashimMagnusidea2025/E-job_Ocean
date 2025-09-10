import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios"; // adjust relative path as needed
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout";

export default function CareerCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [formData, setFormData] = useState({ name: "", status: "active" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/career-level-category");
      setCategories(res.data);
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

  // form input change
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // submit add/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`/career-level-category/${editingId}`, formData);
        // update locally
        setCategories((prev) =>
          prev.map((c) => (c._id === editingId ? res.data : c))
        );
        Swal.fire("Updated!", "Category updated successfully", "success");
      } else {
        const res = await axios.post("/career-level-category", formData);
        setCategories((prev) => [res.data, ...prev]);
        Swal.fire("Added!", "Category created successfully", "success");
      }
      setFormData({ name: "", status: "active" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  // open edit
  const handleEdit = (cat) => {
    setFormData({ name: cat.name, status: cat.status });
    setEditingId(cat._id);
    setShowForm(true);
  };

  // delete
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
          setCategories((prev) => prev.filter((c) => c._id !== id));
          Swal.fire("Deleted!", "Category deleted successfully", "success");
        } catch (err) {
          Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        }
      }
    });
  };

  // toggle status (icon button next to badge)
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const res = await axios.put(`/career-level-category/${id}`, { status: newStatus });
      Swal.fire("Success!", `Status changed to ${newStatus}`, "success");
      setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  // columns for react-data-table-component
  const columns = [
    {
      name: "#",
      selector: (row, idx) => idx + 1,
      width: "70px",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      // show badge and icon toggle next to it
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-white text-xs ${row.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {row.status}
          </span>

          <button
            onClick={() => handleToggleStatus(row._id, row.status)}
            className="p-0.5 rounded hover:bg-gray-100"
            title="Toggle status"
          >
            {row.status === "active" ? (
              <FaToggleOn size={26} className="text-green-500" />
            ) : (
              <FaToggleOff size={26} className="text-red-500" />
            )}
          </button>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => handleEdit(row)}
            className="text-yellow-500 hover:text-yellow-600"
            title="Edit"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-600"
            title="Delete"
          >
            <FaTrash size={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // filter by index(#), name, status
  const filteredItems = categories.filter((item, index) => {
    const q = filterText.trim().toLowerCase();
    if (!q) return true;
    return (
      (index + 1).toString().includes(q) ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q))
    );
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
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          responsive
          progressPending={loading}
          persistTableHead
        />
      </div>

      {/* Modal popup form */}
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
