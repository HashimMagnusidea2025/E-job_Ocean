import React from "react";
import { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function OwnershipCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");

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
            onClick={() => handleToggleStatus(row.original._id, row.original.status)}
            className="text-blue-600"
          >
            {row.original.status === "active" ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ownership Categories</h2>
            <input
            type="text"
            placeholder="Search categories..."
            value={searchText}
            onChange={handleSearch}
            className="border p-2 rounded"
          />
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus /> Add New
            </button>
          </div>

          {/* Search */}
          

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
        </div>
      </div>
    </Layout>
  );
}
