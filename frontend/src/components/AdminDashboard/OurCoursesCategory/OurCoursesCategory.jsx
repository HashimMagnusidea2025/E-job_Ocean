import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const CourseCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [statusInput, setStatusInput] = useState("active");
  const [searchText, setSearchText] = useState("");
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
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "CourseCategory",
      header: "Category Name",
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className={`px-2 py-1 rounded text-sm font-medium ${row.original.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {row.original.status}
          </span>
          <button onClick={() => toggleStatus(row.original)} className={`transition duration-200 ${row.original.status === "active" ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}`} title="Toggle Status">
            {row.original.status === "active" ? <FaToggleOn size={26} /> : <FaToggleOff size={26} />}
          </button>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-3 items-center">
          <button onClick={() => handleEdit(row.original)} className="text-blue-600 hover:text-blue-800" title="Edit">
            <FaEdit size={20} />
          </button>
          <button onClick={() => handleDelete(row.original._id)} className="text-red-600 hover:text-red-800" title="Delete">
            <FaTrash size={20} />
          </button>
        </div>
      ),
    },
  ];
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = categories.filter((category) => {
      return (
        category.CourseCategory.toLowerCase().includes(value) ||
        (category.status || '').toLowerCase().includes(value)
      );
    });

    setFilteredCategories(filtered);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const table = useReactTable({
    data: filteredCategories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Layout>
    <div className="min-h-screen   py-10 px-4">
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Course Categories</h2>
          <input
            type="text"
            placeholder="Search category..."
            value={searchText}
            onChange={handleSearch}
            className="border p-2 rounded"
          />
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

        <div className="rounded-lg shadow overflow-x-auto">
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
