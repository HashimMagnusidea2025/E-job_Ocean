import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "../../../utils/axios.js"; // adjust your path
import Layout from "../../seekerDashboard/partials/layout.jsx";
export default function CMSPage() {
    const [cmsPages, setCmsPages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formMode, setFormMode] = useState("add"); // add | edit | view
    const [selectedPage, setSelectedPage] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });

    // Fetch CMS Pages
    const fetchCMSPages = async () => {
        try {
            const { data } = await axios.get("/cms-page");
            setCmsPages(data);
        } catch (err) {
            console.error("Error fetching CMS Pages:", err);
        }
    };

    useEffect(() => {
        fetchCMSPages();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Submit (Add/Edit)
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (formMode === "add") {
            await axios.post("/cms-page", formData);
        } else if (formMode === "edit") {
            await axios.put(`/cms-page/${selectedPage._id}`, formData);
        }
        fetchCMSPages();
        setModalOpen(false);
    } catch (err) {
        console.error("Error saving CMS Page:", err);
    }
};

    // Delete CMS Page
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this CMS Page?")) return;
        try {
            await axios.delete(`/cms-page/${id}`);
            fetchCMSPages();
        } catch (err) {
            console.error("Error deleting CMS Page:", err);
        }
    };

    // Open Modal
    const openModal = (mode, page = null) => {
        setFormMode(mode);
        setSelectedPage(page);
        if (mode === "edit" || mode === "view") {
            setFormData({ name: page.name, status: page.status });
        } else {
            setFormData({ name: "", status: "active" });
        }
        setModalOpen(true);
    };

    // Table Columns
    const columns = [
        {
            name: "ID",
            selector: (row, index) => index + 1,
            width: "70px",
        },
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Status", selector: (row) => row.status, sortable: true },
        {
            name: "Actions",
            cell: (row) => ( 
                <div className="flex gap-2">
                    <button
                        onClick={() => openModal("view", row)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEye size={22} />
                    </button>
                    <button
                        onClick={() => openModal("edit", row)}
                        className="text-green-500 hover:text-green-700"
                    >
                        <FaEdit size={22} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTrash size={22} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">CMS Pages Category</h2>
                    <button
                        onClick={() => openModal("add")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FaPlus /> Add Page
                    </button>
                </div>

                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={cmsPages}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                />

                {/* Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 capitalize">
                                {formMode} CMS Page
                            </h3>
                            {formMode === "view" ? (
                                <div className="space-y-3">
                                    <p>
                                        <span className="font-semibold">Name:</span> {selectedPage.name}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Status:</span>{" "}
                                        {selectedPage.status}
                                    </p>
                                    <div className="mt-4 text-right">
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 mt-1"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(false)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
