import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout";
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function KnowledgeBaseForm({ selectedData, onSuccess }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
        keywords: "",
         fromStatus: "Enabled", // ✅ default
    status: "active",      // ✅ default
    });
    const [uploadPDF, setUploadPDF] = useState(null);


    useEffect(() => {
        if (selectedData) {
            setFormData({
                title: selectedData.title || "",
                description: selectedData.description || "",
                tags: selectedData.tags || "",
                keywords: selectedData.keywords || "",
                fromStatus: selectedData.fromStatus || "Enabled",
                 status: selectedData.status || "active",
            });
            setUploadPDF(null);
        }
    }, [selectedData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setUploadPDF(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();

            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (uploadPDF) data.append("uploadPDF", uploadPDF);


            let res;

            if (selectedData) {
                // Edit Mode
                res = await axios.put(`/knowlege-base/${selectedData._id}`, data);
                Swal.fire("Updated!", "Knowledge Base updated successfully!", "success");
            } else {
                // Create Mode
                res = await axios.post("/knowlege-base", data);
                Swal.fire("Success!", "Knowledge Base added successfully!", "success");
            }

            // Callback to refresh list
            if (onSuccess) onSuccess();

            if (!selectedData) {
                setFormData({
                    title: "",
                    description: "",
                    tags: "",
                    keywords: "",
                    fromStatus: "Enabled",
                    status:""
                });
                setUploadPDF(null);
                e.target.reset();
            }
            console.log(res.data);
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Something went wrong!",
                icon: "error",
                confirmButtonColor: "#339ca0",
            });
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-10">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    {selectedData ? "Edit Knowledge Base" : "Add Knowledge Base"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#339ca0] focus:border-[#339ca0]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#339ca0] focus:border-[#339ca0]"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#339ca0] focus:border-[#339ca0]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Keywords
                            </label>
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#339ca0] focus:border-[#339ca0]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                           From Status 
                        </label>
                        <select
                            name="fromStatus"
                            value={formData.fromStatus}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#339ca0] focus:border-[#339ca0]"
                        >
                            <option value="Enabled">Enabled</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#339ca0] focus:border-[#339ca0]"
                        >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Upload PDF
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#339ca0] focus:border-[#339ca0]"
                        />
                        {selectedData?.uploadPDF && !uploadPDF && (
                            <p className="text-sm text-gray-500 mt-1">
                                Current PDF:{" "}
                                <a
                                    href={`${baseURL}/${selectedData.uploadPDF}`}
                                    target="_blank"
                                    className="text-blue-500 underline"
                                >
                                    View
                                </a>
                            </p>
                        )}

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#339ca0] text-white py-2.5 rounded-lg font-medium hover:bg-[#2a8285] transition-all duration-200"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </Layout>
    );
}
