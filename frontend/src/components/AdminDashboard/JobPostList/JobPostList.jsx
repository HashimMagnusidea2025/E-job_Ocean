import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
export default function JobPostList() {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredJobPosts, setFilteredJobPosts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = async () => {
        try {
            const { data } = await axios.get("/job-post"); // your API endpoint
            setJobPosts(data);
            setFilteredJobPosts(data);
            console.log(data);

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

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = jobPosts.filter((job) => {
            return (
                job.jobTitle.toLowerCase().includes(value) ||
                (job.postedBy?.name || '').toLowerCase().includes(value) ||
                (job.mode || '').toLowerCase().includes(value) ||
                (job.experience || '').toLowerCase().includes(value) ||
                (job.expiryDate || '').toLowerCase().includes(value) ||
                job.skills.some(skill => (skill.name || skill).toLowerCase().includes(value))
            );
        });

        setFilteredJobPosts(filtered);
    };

    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "jobTitle",
            header: "Job Title",
        },
        {
            accessorKey: "postedBy.name",
            header: "Posted By",
        },
        {
            accessorKey: "mode",
            header: "Mode",
        },
        {
            accessorKey: "experience",
            header: "Experience",
        },
        {
            accessorKey: "expiryDate",
            header: "Expiry Date",
        },
        {
            header: "Skills",
            cell: ({ row }) => row.original.skills.map(skill => skill.name || skill).join(", "),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => handleView(row.original)}
                        className="text-blue-600"
                    >
                        <FaEye size={20} />
                    </button>
                    <button
                        onClick={() => navigate(`/admin-dashboard/post-job/${row.original._id}`)}
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
        data: filteredJobPosts,
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
                    <h2 className="text-3xl font-bold text-gray-800">Job Posts</h2>
                    <input
                        type="text"
                        placeholder="Search job posts..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 rounded"
                    />
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
                                        No job posts found
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
        </div>
        </Layout>
    );
}

