import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";

export default function JobTypeCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", status: "active" });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/job-Type-category");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const category = categories.find(cat => cat._id === id);
    try {
      await axios.put(`/job-Type-category/${id}`, {
        name: category.name,
        status: newStatus
      });
      fetchCategories();
      Swal.fire("Updated!", `Status changed to ${newStatus}`, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const columns = [
     {
      name: "ID",
      selector: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded text-white ${
              row.status === "active" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {row.status}
          </span>
          <button onClick={() => handleToggleStatus(row._id, row.status)}>
            {row.status === "active" ? (
              <FaToggleOn size={22} className="text-green-500" />
            ) : (
              <FaToggleOff size={22} className="text-red-500" />
            )}
          </button>
        </div>
      )
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData({ id: row._id, name: row.name, status: row.status });
              setModalOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash size={20} />
          </button>
        </div>
      )
    }
  ];

  const filteredData = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Job Type Categories</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        customStyles={{
          headCells: {
            style: {
              fontWeight: "bold",
              backgroundColor: "#f3f4f6"
            }
          }
        }}
      />

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
