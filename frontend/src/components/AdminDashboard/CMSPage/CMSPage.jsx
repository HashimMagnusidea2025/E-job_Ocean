import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "../../../utils/axios.js"; // adjust your path
import Swal from "sweetalert2"; // make sure you have this import

import Layout from "../../seekerDashboard/partials/layout.jsx";
export default function CMSPage() {
    const [cmsPages, setCmsPages] = useState([]);
    const [cmsContent, setContent] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modelCms, setModelCms] = useState(false)
    const [formMode, setFormMode] = useState("add"); // add | edit | view
    const [selectedPage, setSelectedPage] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });
    const [cmsContentData, setCmsContentData] = useState({
        line_1: "",
        line_2: "",
        line_3: "",
        line_4: "",
        line_5: "",
        page: "",
        status: "active",
    });


    const handleViewContent = async (row) => {
        try {
            const { data } = await axios.get(`/cms-content/${row._id}`);
            Swal.fire({
                title: `View CMS Content`,
                html: `
        <div style="text-align:left">
          <p><b>Page:</b> ${data.page?.name || "—"}</p>
          <p><b>Line 1:</b> ${data.line_1 || "—"}</p>
          <p><b>Line 2:</b> ${data.line_2 || "—"}</p>
          <p><b>Line 3:</b> ${data.line_3 || "—"}</p>
          <p><b>Line 4:</b> ${data.line_4 || "—"}</p>
          <p><b>Line 5:</b> ${data.line_5 || "—"}</p>
          <p><b>Status:</b> ${data.status}</p>
        </div>
      `,
                confirmButtonText: "Close",
            });
        } catch (err) {
            console.error("Error viewing content:", err);
        }
    };
    // 🧩 DELETE CMS CONTENT
    const handleDeleteContent = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the CMS content.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`/cms-content/${id}`);
            Swal.fire("Deleted!", "CMS content has been deleted.", "success");
            fetchCMSContent(); // Refresh table
        } catch (err) {
            Swal.fire("Error!", "Failed to delete CMS content.", "error");
        }
    };
    // 🧩 EDIT CMS CONTENT
    const handleEditContent = (row) => {
        setFormMode("edit");
        setCmsContentData({
            line_1: row.line_1 || "",
            line_2: row.line_2 || "",
            line_3: row.line_3 || "",
            line_4: row.line_4 || "",
            line_5: row.line_5 || "",
            page: row.page?._id || "",
            status: row.status || "active",
        });
        setSelectedPage(row);
        setModelCms(true);
    };

    const handleCMSContentChange = (e) => {
        setCmsContentData({ ...cmsContentData, [e.target.name]: e.target.value });
    };
    //     const handleCMSContentSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await axios.post("/cms-content", cmsContentData);

    //         // ✅ SweetAlert success message
    //         Swal.fire({
    //             icon: "success",
    //             title: "Success!",
    //             text: "CMS content added successfully.",
    //             showConfirmButton: false,
    //             timer: 1500,
    //         });

    //         // ✅ Close modal
    //         setModelCms(false);

    //         // ✅ Clear form data
    //         setCmsContentData({
    //             line_1: "",
    //             line_2: "",
    //             line_3: "",
    //             line_4: "",
    //             line_5: "",
    //             page: "",
    //             status: "active",
    //         });

    //         // ✅ Refresh data immediately (no need to reload page)
    //         fetchCMSContent();

    //     } catch (err) {
    //         console.error("Error adding CMS content:", err);

    //         Swal.fire({
    //             icon: "error",
    //             title: "Error!",
    //             text: "Failed to add CMS content. Please try again.",
    //         });
    //     }
    // };


    // Fetch CMS Pages


    //  Then update your handleCMSContentSubmit:
    const handleCMSContentSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formMode === "edit") {
                await axios.put(`/cms-content/${selectedPage._id}`, cmsContentData);
                Swal.fire("Updated!", "CMS content updated successfully.", "success");
            } else {
                await axios.post("/cms-content", cmsContentData);
                Swal.fire("Success!", "CMS content added successfully.", "success");
            }

            setModelCms(false);
            fetchCMSContent();
        } catch (err) {
            Swal.fire("Error!", "Failed to save CMS content.", "error");
        }
    };

    const fetchCMSPages = async () => {
        try {
            const { data } = await axios.get("/cms-page");
            setCmsPages(data);
        } catch (err) {
            console.err("Error fetching CMS Pages:", err);
        }
    };

    const fetchCMSContent = async () => {

        try {
            const { data } = await axios.get('/cms-content');
            setContent(data)
        } catch (err) {
            console.err("Error fetching CMS Content:", err);
        }
    }

    useEffect(() => {
        fetchCMSPages();
        fetchCMSContent();
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
                        <FaPlus /> Add Page Category
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



                <div className="flex items-center justify-between mb-6 mt-16">
                    <h2 className="text-2xl font-semibold text-gray-800">CMS Page</h2>
                    <button
                        onClick={() => setModelCms(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Add CMS
                    </button>

                </div>


                <div className="mt-16">

                    <DataTable
                        columns={[
                            {
                                name: "ID",
                                selector: (row, index) => index + 1,
                                width: "70px",
                            },
                            {
                                name: "Page",
                                selector: (row) => row.page?.name || "—",
                                sortable: true,
                            },
                            {
                                name: "Line 1",
                                selector: (row) => row.line_1 || "—",
                                wrap: true,
                            },
                            {
                                name: "Line 2",
                                selector: (row) => row.line_2 || "—",
                                wrap: true,
                            },
                            {
                                name: "Line 3",
                                selector: (row) => row.line_3 || "—",
                                wrap: true,
                            },
                            {
                                name: "Line 4",
                                selector: (row) => row.line_4 || "—",
                                wrap: true,
                            },
                            {
                                name: "Line 5",
                                selector: (row) => row.line_5 || "—",
                                wrap: true,
                            },
                            {
                                name: "Status",
                                selector: (row) => row.status,
                                sortable: true,
                            },
                            {
                                name: "Actions",
                                cell: (row) => (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewContent(row)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEye size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleEditContent(row)}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteContent(row._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        data={cmsContent}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </div>



                {modelCms && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        onClick={() => setModelCms(false)} // ✅ close when clicking outside
                    >
                        <div
                            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6"
                            onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside modal
                        >
                            <h3 className="text-xl font-semibold mb-4 capitalize">Add CMS Page</h3>

                            <form onSubmit={handleCMSContentSubmit} className="space-y-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div key={num}>
                                        <label className="block text-gray-700">Line {num}</label>
                                        <input
                                            type="text"
                                            name={`line_${num}`}
                                            value={cmsContentData[`line_${num}`]}
                                            onChange={handleCMSContentChange}
                                            className="w-full border rounded px-3 py-2 mt-1"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-gray-700">Page Category</label>
                                    <select
                                        name="page"
                                        value={cmsContentData.page}
                                        onChange={handleCMSContentChange}
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        required
                                    >
                                        <option value="">Select Page Category</option>
                                        {cmsPages.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={cmsContentData.status}
                                        onChange={handleCMSContentChange}
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setModelCms(false)}
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

                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
}
