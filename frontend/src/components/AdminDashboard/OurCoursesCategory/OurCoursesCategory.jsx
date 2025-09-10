import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../../utils/axios";
import Swal from "sweetalert2";
import {  FaEdit, FaTrash, FaToggleOn, FaToggleOff} from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout";

const CourseCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [statusInput, setStatusInput] = useState("active");
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/course-category");
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryInput.trim()) {
      Swal.fire("Validation Error", "Category name is required", "warning");
      return;
    }

    try {
      setLoading(true);

      if (editCategoryId) {
        await axios.put(`/course-category/${editCategoryId}`, {
          CourseCategory: categoryInput.trim(),
          status: statusInput,
        });

        Swal.fire("Updated!", "Category updated successfully", "success");
      } else {
        await axios.post("/course-category", {
          CourseCategory: categoryInput.trim(),
          status: statusInput,
        });

        Swal.fire("Created!", "Category added successfully", "success");
      }

      setCategoryInput("");
      setStatusInput("active");
      setEditCategoryId(null);
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      Swal.fire("Error", "Failed to save category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditCategoryId(category._id);
    setCategoryInput(category.CourseCategory);
    setStatusInput(category.status || "active");
    setShowModal(true);
  };

  const toggleStatus = async (category) => {
  const updatedStatus = category.status === "active" ? "inactive" : "active";

  try {
    await axios.put(`/course-category/${category._id}`, {
      CourseCategory: category.CourseCategory,
      status: updatedStatus,
    });

    Swal.fire("Success!", `Status changed to ${updatedStatus}`, "success");
    fetchCategories();
  } catch (err) {
    console.error("Failed to toggle status:", err);
    Swal.fire("Error", "Failed to update status", "error");
  }
};


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/course-category/${id}`);
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories();
      } catch (err) {
        console.error("Failed to delete category:", err);
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  const columns = [
     {
      name: "ID",
      selector: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Category Name",
      selector: (row) => row.CourseCategory,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="flex gap-1">
          <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
        <button
        onClick={() => toggleStatus(row)}
        className={`transition duration-200 ${
          row.status === "active"
            ? "text-green-500 hover:text-green-700"
            : "text-red-500 hover:text-red-700"
        }`}
        title="Toggle Status"
      >
        {row.status === "active" ? (
          <FaToggleOn size={26} />
        ) : (
          <FaToggleOff size={26} />
        )}
      </button>
        </div>
      ),
    },
    {
  name: "Actions",
  cell: (row) => (
    <div className="flex gap-3 items-center">
      <button
        onClick={() => handleEdit(row)}
        className="text-blue-600 hover:text-blue-800"
        title="Edit"
      >
        <FaEdit size={20} />
      </button>
      <button
        onClick={() => handleDelete(row._id)}
        className="text-red-600 hover:text-red-800"
        title="Delete"
      >
        <FaTrash size={20} />
      </button>
      
    </div>
  ),
}

  ];

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.CourseCategory.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [filterText, categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
    <div className="min-h-screen   py-10 px-4">
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Manage Course Categories
          </h2>
          <button
            onClick={() => {
              setCategoryInput("");
              setStatusInput("active");
              setEditCategoryId(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search category..."
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredCategories}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent="No categories found"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editCategoryId ? "Edit Category" : "Add New Category"}
            </h3>
            <input
              type="text"
              placeholder="Category name"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditCategoryId(null);
                  setCategoryInput("");
                  setStatusInput("active");
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editCategoryId
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default CourseCategoryPage;
