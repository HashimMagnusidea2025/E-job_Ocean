import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout";
export default function SkillsCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [formData, setFormData] = useState({ name: "", status: "active" });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get("/skills-categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
            
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/skills-categories/${editingId}`, formData);
                Swal.fire("Updated!", "Category updated successfully", "success");
            } else {
                await axios.post("/skills-categories", formData);
                Swal.fire("Added!", "Category created successfully", "success");
            }
            setFormData({ name: "", status: "active" });
            setEditingId(null);
            setShowForm(false);
            fetchCategories();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        }
    };

    // Edit category
    const handleEdit = (cat) => {
        setFormData({ name: cat.name, status: cat.status });
        setEditingId(cat._id);
        setShowForm(true);
    };

    // Delete category
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the category!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/skills-categories/${id}`);
                    Swal.fire("Deleted!", "Category deleted successfully", "success");
                    fetchCategories();
                } catch (err) {
                    Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
                }
            }
        });
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            await axios.put(`/skills-categories/${id}`, { status: newStatus });
            Swal.fire("Success!", `Status changed to ${newStatus}`, "success");
            setCategories(prev =>
                prev.map(cat =>
                    cat._id === id ? { ...cat, status: newStatus } : cat
                )
                
            );
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        }
    };


    // DataTable Columns
    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            width: "70px"
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
                        className={`px-2 py-1 rounded text-white text-xs ${row.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {row.status}
                    </span>
                    <button
                        onClick={() => handleToggleStatus(row._id, row.status)}
                        className="p-1 rounded hover:bg-gray-200"
                        title="Toggle Status"
                    >
                        {row.status === "active" ? (
                            <FaToggleOn size={26} className="text-green-500" />
                        ) : (
                            <FaToggleOff size={26} className="text-red-500" />
                        )}
                    </button>
                </div>
            ),
            sortable: true
        },

        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-yellow-500 hover:text-yellow-600"
                    >
                        <FaEdit size={20} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="text-red-500 hover:text-red-600"
                    >
                        <FaTrash size={20} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ];

    // Filtered Data
    const filteredItems = categories.filter((item, index) => {
        const searchLower = filterText.toLowerCase();

        return (
            // Match by #
            (index + 1).toString().includes(searchLower) ||
            // Match by Name
            (item.name && item.name.toLowerCase().includes(searchLower)) ||
            // Match by Status
            (item.status && item.status.toLowerCase().includes(searchLower))
        );
    })

    return (
        <Layout>
        <div className="bg-gray-100 px-2 py-1">
            {/* Top Actions */}
            <div className="p-10 w-full mx-auto">

                <div className="flex justify-between items-center mb-4">
                    <h2 className=" text-xl font-semibold sm:text-[24px]">Manage Skills Category</h2>
                    <input
                        type="text"
                        placeholder="Search..."
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

                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    highlightOnHover
                    responsive
                />

                {/* Popup Form */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">
                                {editingId ? "Edit Category" : "Add Category"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Category Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 rounded border"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        {editingId ? "Update" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </Layout>
    );
}
