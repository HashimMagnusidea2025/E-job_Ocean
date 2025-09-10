import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "../../../utils/axios"; // your axios setup
import Layout from "../../seekerDashboard/partials/layout";

export default function OwnershipCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/ownership-category");
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // CREATE Category
  const handleCreate = () => {
    Swal.fire({
      title: "Add New Category",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "Enter category name",
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: async (name) => {
        if (!name) {
          Swal.showValidationMessage("Category name is required");
          return false;
        }
        try {
          await axios.post("/ownership-category", { name, status: "active" });
          fetchCategories();
        } catch (err) {
          Swal.showValidationMessage(
            err.response?.data?.message || "Failed to create category"
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Success!", "Category created successfully.", "success");
      }
    });
  };

  // EDIT Category
  // EDIT Category with Status
const handleEdit = (category) => {
  Swal.fire({
    title: "Edit Category",
    html: `
      <div class="flex flex-col gap-3">
        <input id="swal-name" class="swal2-input" placeholder="Category Name" value="${category.name}" />
        <select id="swal-status" class="swal2-select">
          <option value="active" ${category.status === "active" ? "selected" : ""}>Active</option>
          <option value="inactive" ${category.status === "inactive" ? "selected" : ""}>Inactive</option>
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Update",
    preConfirm: async () => {
      const name = document.getElementById("swal-name").value.trim();
      const status = document.getElementById("swal-status").value;

      if (!name) {
        Swal.showValidationMessage("Category name is required");
        return false;
      }

      try {
        await axios.put(`/ownership-category/${category._id}`, { name, status });
        fetchCategories();
      } catch (err) {
        Swal.showValidationMessage(
          err.response?.data?.message || "Failed to update category"
        );
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Updated!", "Category updated successfully.", "success");
    }
  });
};


  // DELETE Category
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/ownership-category/${id}`);
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          fetchCategories();
        } catch (err) {
          Swal.fire("Error!", err.response?.data?.message || "Something went wrong", "error");
        }
      }
    });
  };

  // TOGGLE Status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.put(`/ownership-category/${id}`, { status: updatedStatus });
      fetchCategories();
    } catch (err) {
      Swal.fire("Error!", "Failed to update status", "error");
    }
  };

  // Search filter
  useEffect(() => {
    const result = categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCategories(result);
  }, [search, categories]);

  // Table Columns
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
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
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
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
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ownership Categories</h2>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus /> Add New
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name..."
            className="mb-3 p-2 border rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredCategories}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </Layout>
  );
}
