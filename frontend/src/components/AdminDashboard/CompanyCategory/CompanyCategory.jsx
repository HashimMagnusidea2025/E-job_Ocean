import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import Swal from "sweetalert2";
import axios from "../../../utils/axios.js"; // your axios instance
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

import Layout from "../../seekerDashboard/partials/layout.jsx";

export default function CompanyCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });

    // fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/company-category");
            setCategories(res.data);
        } catch (err) {
            Swal.fire("Error!", err.response?.data?.message || "Failed to fetch", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // handle delete
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the category permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/company-category/${id}`);
                    setCategories(categories.filter((c) => c._id !== id));
                    Swal.fire("Deleted!", "Category deleted successfully.", "success");
                } catch (err) {
                    Swal.fire("Error!", err.response?.data?.message || "Delete failed", "error");
                }
            }
        });
    };

    // open modal for create or edit
    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, status: category.status });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", status: "active" });
        }
        setIsModalOpen(true);
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                // update
                const res = await axios.put(`/company-category/${editingCategory._id}`, formData);
                setCategories(categories.map((c) => (c._id === editingCategory._id ? res.data : c)));
                Swal.fire("Updated!", "Category updated successfully.", "success");
            } else {
                // create
                const res = await axios.post("/company-category", formData);
                setCategories([res.data, ...categories]);
                Swal.fire("Created!", "Category created successfully.", "success");
            }
            setIsModalOpen(false);
        } catch (err) {
            Swal.fire("Error!", err.response?.data?.message || "Operation failed", "error");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const res = await axios.put(`/company-category/${id}`, { status: newStatus });
          
            setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        }
    };

    // table columns
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
                <div className="flex gap-3">
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openModal(row)}
                    >
                        <FaEdit size={20}/>
                    </button>
                    <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(row._id)}
                    >
                        <FaTrash size={20}/>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Company Categories</h1>
                    <button
                        onClick={() => openModal()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Add Category
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={categories}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                />

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingCategory ? "Edit Category" : "Create Category"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        {editingCategory ? "Update" : "Create"}
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
