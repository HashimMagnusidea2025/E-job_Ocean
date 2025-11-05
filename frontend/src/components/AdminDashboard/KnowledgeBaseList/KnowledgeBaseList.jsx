import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import KnowledgeBaseForm from "../KnowledgeBaseForm/KnowledgeBaseForm.jsx";
const baseURL = import.meta.env.VITE_BACKEND_URL;
export default function KnowledgeBaseList() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null); // For edit mode
    const [showForm, setShowForm] = useState(false);
    // Fetch Data
    const fetchData = async () => {
        try {
            const res = await axios.get("/knowlege-base");
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load data", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Delete Function
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/knowlege-base/${id}`);
                    Swal.fire("Deleted!", "Record has been deleted.", "success");
                    fetchData();
                } catch (err) {
                    Swal.fire("Error", "Failed to delete record", "error");
                }
            }
        });
    };

    // Enhanced View Function with detailed information
    const handleView = (row) => {
        Swal.fire({
            title: `<h2>${row.title}</h2>`,
            html: `
                <div style="text-align: left; max-height: 60vh; overflow-y: auto;">
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Description</h3>
                        <p style="margin: 0; line-height: 1.5;">${row.description || "No description available"}</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Keywords</h3>
                            <p style="margin: 0;">${row.keywords || "-"}</p>
                        </div>
                        
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Tags</h3>
                            <p style="margin: 0;">${row.tags || "-"}</p>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Status</h3>
                            <p style="margin: 0;">
                                <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; 
                                    background-color: ${row.fromStatus === 'Enabled' ? '#d1fae5' : '#fee2e2'}; 
                                    color: ${row.fromStatus === 'Enabled' ? '#065f46' : '#991b1b'};">
                                    ${row.fromStatus || 'Enabled'}
                                </span>
                            </p>
                        </div>
                        
                        <div>
                            <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">PDF Document</h3>
                            <p style="margin: 0;">
                                ${row.uploadPDF ?
                    `<a href="${baseURL}/${row.uploadPDF}" target="_blank" style="color: #339ca0; text-decoration: none; font-weight: bold;">
                                        📄 View PDF
                                    </a>`
                    : "No PDF uploaded"
                }
                            </p>
                        </div>
                    </div>
                    
                    ${row.createdAt ? `
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Created Date</h3>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            ${new Date(row.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                        </p>
                    </div>
                    ` : ''}
                    
                    ${row.updatedAt && row.updatedAt !== row.createdAt ? `
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #339ca0; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Last Updated</h3>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            ${new Date(row.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                        </p>
                    </div>
                    ` : ''}
                </div>
            `,
            icon: "info",
            confirmButtonText: "Close",
            confirmButtonColor: "#339ca0",
            width: "700px",
            customClass: {
                popup: 'knowledge-base-popup'
            }
        });
    };
    // Columns
    const columns = [
        {
      name: "ID",
      selector: (row, index) => index + 1,
      width: "70px",
    },
        {
            name: "Title",
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: "description",
            selector: (row) => row.description || "-",
            sortable: true,
        },
        {
            name: "keywords",
            selector: (row) => (row.keywords),
            sortable: true,
        },
        {
            name: "PDF",
            cell: (row) =>
                row.uploadPDF ? (
                    <button
                        onClick={() => window.open(`${baseURL}/${row.uploadPDF}`, "_blank")}
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        View PDF
                    </button>
                ) : (
                    "-"
                ),
            ignoreRowClick: true,

            button: true,
        },
        {
            name: "from status",
            selector: (row) => (row.fromStatus),
            sortable: true,
        },
        {
            name: "status",
            selector: (row) => (row.status),
            sortable: true,
        },
        {
            name: "Count",
            selector: (row) => (row.count),
            sortable: true,
        },

        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-3 text-lg">
                    <FaEye size={22}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        title="View"
                        onClick={() => handleView(row)}
                    />
                    <FaEdit size={22}
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                        title="Edit"
                        onClick={() => {
                            setSelectedData(row);
                            setShowForm(true);
                        }}
                    />
                    <FaTrash size={22}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Delete"
                        onClick={() => handleDelete(row._id)}
                    />
                </div>
            ),
        },
    ];



    const handleEdit = (row) => {
        // navigate or open modal
        Swal.fire("Edit Mode", `Edit record: ${row.title}`, "info");
    };

    if (showForm)
        return <KnowledgeBaseForm selectedData={selectedData} onSuccess={() => { fetchData(); setShowForm(false); }} />;
    return (
        <Layout>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-5 text-gray-800">📚 Knowledge Base List</h2>
                <button
                    onClick={() => { setSelectedData(null); setShowForm(true); }}
                    className="mb-5 px-4 py-2 bg-[#339ca0] text-white rounded-lg"
                >
                    + Add Knowledge Base
                </button>

                <DataTable columns={columns} data={data} pagination highlightOnHover striped responsive />
            </div>
        </Layout>
    );
}
