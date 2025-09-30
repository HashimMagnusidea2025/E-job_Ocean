import { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import DataTable from "react-data-table-component";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function OneToOneList() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewData, setViewData] = useState(null);

    // Fetch sessions
    const fetchSessions = async () => {
        try {
            const { data } = await axios.get("/one-to-one");
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    // Handlers
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this session?")) return;
        try {
            await axios.delete(`/one-to-one/${id}`);
            alert("Session deleted successfully!");
            fetchSessions();
        } catch (err) {
            console.error(err);
            alert("Error deleting session");
        }
    };

    const handleView = (session) => setViewData(session);

    // Table columns
    const columns = [
        { name: "ID", cell: (row, index) => index + 1, width: "80px" },
        { name: "Speaker", selector: row => row.Speaker?.firstName || row.Speaker, sortable: true },
        { name: "Course Title", selector: row => row.courseTitle, sortable: true },
        { name: "Course Type", selector: row => row.courseType, sortable: true },
        { name: "Fees", selector: row => row.fees, sortable: true },
        { name: "Start Time", selector: row => row.startTime, sortable: true },
        { name: "End Time", selector: row => row.endTime, sortable: true },
        {
            name: "Status",
            cell: row => (
                <span className={`px-2 py-1 rounded text-white ${row.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                    {row.status}
                </span>
            ),
            sortable: true
        },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-2">
                    <button onClick={() => handleView(row)} className="text-blue-500 hover:text-blue-700">
                        <FaEye size={22} /></button>
                    <button
                        onClick={() => window.location.href = `/admin-dashboard/add-one-to-one?editId=${row._id}`}
                        className="text-yellow-500 hover:text-yellow-700"
                    >
                        <FaEdit size={22} />
                    </button>
                    <button onClick={() => handleDelete(row._id)} className="text-red-500 hover:text-red-700"><FaTrash size={22} /></button>
                </div>
            )
        }
    ];

    return (
        <Layout>
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg font-[Poppins] mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">One-to-One Sessions</h2>
                    <button
                        onClick={() => window.location.href = '/admin-dashboard/add-one-to-one'}
                        className="bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold">
                        Create Session
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={sessions}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                />

                {/* Modal for View */}
                {viewData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={() => setViewData(null)}
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Session Details</h2>
                            <div className="space-y-2">
                                {Object.entries(viewData).map(([key, value]) => (
                                    <p key={key}><span className="font-semibold">{key}:</span> {value?.firstName || value}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}


