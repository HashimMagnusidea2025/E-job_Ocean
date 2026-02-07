import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios"; // adjust path as needed
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


const ProfessionalCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", type: "", status: "active" });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterOptions, setFilterOptions] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);



    useEffect(() => {
        fetchCategories();
        fetchFilterOptions();
    }, []);



    const fetchFilterOptions = async () => {
        try {
            const res = await axios.get("/filter-options");
            setFilterOptions(res.data.data);
        } catch (err) {
            console.error("Failed to load filter options", err);
        }
    };

    const fetchCategories = async () => {
        const res = await axios.get("/professional-categories");
        setCategories(res.data.data);
        setFilteredCategories(res.data.data);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = categories.filter((cat) =>
            cat.name.toLowerCase().includes(value) ||
            cat.type.toLowerCase().includes(value) ||
            cat.status.toLowerCase().includes(value)
        );

        setFilteredCategories(filtered);
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toCamelCase = (str) => {
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const formattedData = {
                ...form,
                name: toCamelCase(form.name)
            };
            if (editingId) {
                await axios.put(`/professional-categories/${editingId}`, formattedData);
                Swal.fire("Updated!", "Category updated successfully", "success");
            } else {
                await axios.post("/professional-categories", formattedData);
                Swal.fire("Created!", "Category created successfully", "success");
            }
            setForm({ name: "", type: "", status: "active" });
            setEditingId(null);
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    };


    const handleEdit = (category) => {
        setForm({ name: category.name, type: category.type, status: category.status });

        setEditingId(category._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/professional-categories/${id}`);
                await fetchCategories();
                Swal.fire("Deleted!", "The category has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error", "Something went wrong during deletion.", "error");
            }
        }
    };

    // const toggleStatus = async (id) => {
    //     const result = await Swal.fire({
    //         title: "Change Status?",
    //         text: "Are you sure you want to toggle the status?",
    //         icon: "question",
    //         showCancelButton: true,
    //         confirmButtonText: "Yes, toggle it",
    //     });

    //     if (!result.isConfirmed) return;

    //     try {
    //        const q = await axios.patch(`/professional-categories/toggle-status/${id}`);

    //         fetchCategories();
    //         Swal.fire("Updated!", "Status toggled successfully", "success");
    //     } catch (err) {
    //         console.error("Failed to toggle status", err);
    //         Swal.fire("Error", "Failed to toggle status", "error");
    //     }
    // };

    const handleToggleStatus = async (id, status) => {
        const newStatus = status === "active" ? "inactive" : "active";
        await axios.put(`/professional-categories/${id}`, { status: newStatus });
        fetchCategories();
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
        accessorKey: "type",
        header: "Type",
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-white text-xs ${row.original.status === "active" ? "bg-green-500" : "bg-red-500"}`}
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Professional Categories</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 w-full max-w-sm"
                    />
                </div>
                <button
                    onClick={() => {
                        setForm({ name: "", type: "", });
                        setEditingId(null);
                        setShowModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Create Category
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

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">
                            {editingId ? "Edit" : "Add"} Professional Category
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Category Name"
                                value={form.name}
                                onChange={handleInputChange}
                                className="border p-2 w-full"
                                required
                            />
                            <select
                                name="type"
                                className="border p-2 w-full"
                                value={form.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">--select--</option>
                                {filterOptions.map((option) => (
                                    <option key={option._id} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>


                            <select
                                name="status"
                                value={form.status}
                                onChange={handleInputChange}
                                className="border p-2 w-full"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    {editingId ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
        </Layout>
    );
};

export default ProfessionalCategoryPage;
