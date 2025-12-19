import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { useNavigate } from "react-router-dom";
export default function JobPostList() {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    // 👇 Modal open handler
    const handleView = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    // 👇 Modal close handler
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
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
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleView(row)}
                    >
                        <FaEye size={20} />
                    </button>
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
                <h2 className="text-2xl font-semibold mb-4">Job Posts List</h2>
                <DataTable
                    columns={columns}
                    data={jobPosts}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    responsive
                />
            </div>

            {isModalOpen && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                        <h3 className="text-xl font-semibold mb-4">Job Details</h3>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Job Title:</strong> {selectedJob.jobTitle}</p>
                            <p><strong>benefits:</strong> {selectedJob.benefits}</p>
                            <p><strong>Positions:</strong> {selectedJob.positions}</p>
                            <p><strong>salaryFrom:</strong> {selectedJob.salaryFrom}</p>
                            <p><strong>salaryTo:</strong> {selectedJob.salaryTo}</p>
                            <p><strong>salaryCurrency:</strong> {selectedJob.salaryCurrency}</p>
                            <p><strong>salaryPeriod:</strong> {selectedJob.salaryPeriod}</p>
                            <p><strong>hideSalary:</strong> {selectedJob.hideSalary}</p>
                            <p><strong>Career Level:</strong> {selectedJob.careerLevel?.name || "N/A"}</p>
                            <p><strong>Functional Area:</strong> {selectedJob.functionalArea?.name || "N/A"}</p>
                            <p><strong>Job Type:</strong> {selectedJob.jobType?.name || "N/A"}</p>
                            <p><strong>Job Shift:</strong> {selectedJob.jobShift?.name || "N/A"}</p>
                            <p><strong>expiryDate:</strong> {selectedJob.expiryDate}</p>
                            <p><strong>degreeLevel:</strong> {selectedJob.degreeLevel?.name || "N/A"}</p>
                            <p><strong>experience:</strong> {selectedJob.experience}</p>
                            <p><strong>externalJob:</strong> {selectedJob.externalJob}</p>
                            <p><strong>isFreelance:</strong> {selectedJob.isFreelance}</p>
                            <p><strong>isActive:</strong> {selectedJob.isActive}</p>
                            <p><strong>Country:</strong> {selectedJob.country}</p>
                            <p><strong>State:</strong> {selectedJob.state}</p>
                            <p><strong>City:</strong> {selectedJob.city}</p>
                            <p className="col-span-2"><strong>Description:</strong> {selectedJob.description}</p>
                            <p className="col-span-2"><strong>Skills:</strong> {selectedJob.skills.map(s => s.name || s).join(", ")}</p>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
