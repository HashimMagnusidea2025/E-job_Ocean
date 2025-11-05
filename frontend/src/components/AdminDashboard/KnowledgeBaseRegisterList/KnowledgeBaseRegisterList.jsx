import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { FaTrash } from "react-icons/fa";
const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function KnowledgeBaseRegisterList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch registrations
    const fetchData = async () => {
        try {
            const res = await axios.get("/knowlege-base-register");
            if (res.data.success) {
                setData(res.data.data);
            } else {
                Swal.fire("Error", res.data.message, "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch registrations", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    // Delete registration function
    const handleDelete = async (id) => {
        if (!id) return;
        if (window.confirm("Are you sure you want to delete this registration?")) {
            try {

                await axios.delete(`/knowlege-base-register/${id}`);
                Swal.fire("Deleted!", "Registration has been deleted.", "success");
                fetchData(); // refresh table
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete registration", "error");
            }
        }
    };

    // Define columns
    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            width: "80px",
            sortable: true,
        },
        {
            name: "First Name",
            selector: (row) => row.firstName,
            sortable: true,
        },
        {
            name: "Last Name",
            selector: (row) => row.lastName,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Mobile",
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: "Knowledge Base Title",
            selector: (row) => row.knowlegeBaseId?.title || "N/A",
            sortable: true,
            wrap: true,
        },
        {
            name: "Download",
            cell: (row) =>
                row.knowlegeBaseId?.uploadPDF ? (
                    <a
                        href={`${baseURL}/${row.knowlegeBaseId.uploadPDF}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        View PDF
                    </a>
                ) : (
                    <span className="text-gray-400">No File</span>
                ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded"
                    title="Delete"
                >
                    <FaTrash size={18} />
                </button>
            ),
            ignoreRowClick: true,

        },

    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Knowledge Base Registrations
                </h2>

                <div className="bg-white rounded-lg shadow border">
                    <DataTable
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        responsive
                        striped
                        persistTableHead

                    />
                </div>
            </div>
        </Layout>
    );
}
