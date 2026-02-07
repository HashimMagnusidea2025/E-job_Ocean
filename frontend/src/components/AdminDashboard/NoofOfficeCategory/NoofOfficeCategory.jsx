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

import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";

const NoofOfficeCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });

    // Fetch data
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/no-of-office-category");
            setCategories(res.data);
            setFilteredCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = categories.filter((c) => {
            return c.name.toLowerCase().includes(value);
        });

        setFilteredCategories(filtered);
    };

    // Handle Delete
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This category will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/no-of-office-category/${id}`);
                    Swal.fire("Deleted!", "Category has been deleted.", "success");
                    fetchCategories();
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error!", "Failed to delete category.", "error");
                }
            }
        });
    };

    // Handle Create/Edit Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCategory) {
                await axios.put(`/no-of-office-category/${editCategory._id}`, formData);
                Swal.fire("Updated!", "Category updated successfully", "success");
            } else {
                await axios.post("/no-of-office-category", formData);
                Swal.fire("Created!", "Category created successfully", "success");
            }
            fetchCategories();
            closeModal();
        } catch (err) {
            Swal.fire("Error!", err.response?.data?.message || "Failed", "error");
        }
    };

    const openModal = (category = null) => {
        setEditCategory(category);
        if (category) {
            setFormData({ name: category.name, status: category.status });
        } else {
            setFormData({ name: "", status: "active" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditCategory(null);
        setFormData({ name: "", status: "active" });
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        const category = categories.find(cat => cat._id === id);
        try {
            await axios.put(`/no-of-office-category/${id}`, {
                name: category.name,
                status: newStatus
            });
            fetchCategories();

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to update status", "error");
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
                        className={`px-2 py-1 text-xs rounded text-white ${row.original.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {row.original.status}
                    </span>
                    <button onClick={() => handleToggleStatus(row.original._id, row.original.status)}>
                        {row.original.status === "active" ? (
                            <FaToggleOn size={22} className="text-green-500" />
                        ) : (
                            <FaToggleOff size={22} className="text-red-500" />
                        )}
                    </button>
                </div>
            )
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => openModal(row.original)}
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
            <div className="p-2">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">No. of Office Categories</h2>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={() => openModal()}
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
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-4">
                                {editCategory ? "Edit Category" : "Add Category"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    className="w-full border rounded p-2"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                                <select
                                    className="w-full border rounded p-2"
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        {editCategory ? "Update" : "Create"}
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

export default NoofOfficeCategoryPage;
