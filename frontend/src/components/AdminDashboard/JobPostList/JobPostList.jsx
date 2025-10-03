import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { useNavigate } from "react-router-dom";
export default function JobPostList() {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = async () => {
        try {
            const { data } = await axios.get("/job-post"); // your API endpoint
            setJobPosts(data);
        } catch (err) {
            console.error("Failed to fetch job posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/job-post/${id}`);
                Swal.fire("Deleted!", "Job post has been deleted.", "success");
                fetchJobPosts(); // refresh table
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete job post.", "error");
            }
        }
    };

    const columns = [
        { name: "Job Title", selector: row => row.jobTitle, sortable: true },
        { name: "Description", selector: row => row.description, wrap: true },
        { name: "Positions", selector: row => row.positions },
        { name: "Country", selector: row => row.country },
        { name: "State", selector: row => row.state },
        { name: "City", selector: row => row.city },
        {
            name: "Skills",
            selector: row => row.skills.map(skill => skill.name || skill).join(", "),
            wrap: true
        },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-2">
                     <button
                        onClick={() => navigate(`/admin-dashboard/post-job/${row._id}`)} // redirect to edit page
                        className="text-blue-600 hover:text-blue-800">
                        <FaEdit size={22} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <FaTrash size={22} />
                    </button>
                </div>
            ),

        }

    ];

    return (
        <Layout>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Job Posts</h2>
                <DataTable
                    columns={columns}
                    data={jobPosts}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    responsive
                />
            </div>
        </Layout>
    );
}
