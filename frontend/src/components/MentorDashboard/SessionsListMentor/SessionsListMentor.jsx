import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx"; // Mentor dashboard layout
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function MentorSessionsList() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMySessions();
    }, []);

    const fetchMySessions = async () => {
        try {
            const { data } = await axios.get("/one-to-one/my-sessions");
            setSessions(data);
        } catch (err) {
            console.error("Error fetching sessions:", err);
            alert("Error loading sessions");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (sessionId) => {
        if (window.confirm("Are you sure you want to delete this session?")) {
            try {
                await axios.delete(`/one-to-one/${sessionId}`);
                alert("Session deleted successfully");
                fetchMySessions();
            } catch (err) {
                console.error("Error deleting session:", err);
                alert("Error deleting session");
            }
        }
    };

    const handleEdit = (sessionId) => {
        navigate(`/mentor-dashboard/add-mentor-session?editId=${sessionId}`);
    };

    const handleCreateNew = () => {
        navigate("/mentor-dashboard/add-mentor-session");
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <p>Loading your sessions...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-6 font-[Poppins]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Sessions</h1>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <FaPlus /> Create New Session
                    </button>
                </div>

                {sessions.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">No sessions found</p>
                        <button
                            onClick={handleCreateNew}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Create Your First Session
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {sessions.map((session) => (
                            <div key={session._id} className="border rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{session.courseTitle}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{session.courseDescription}</p>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                                            <div>
                                                <span className="font-medium">Days:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {session.selectDays.map(day => (
                                                        <span key={day} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                                            {day}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Date:</span>
                                                <p>{session.selectDate}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Time:</span>
                                                <p>{session.startTime} - {session.endTime}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Type:</span>
                                                <p>{session.courseType} | {session.paymentType}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(session._id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(session._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        session.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {session.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Created: {new Date(session.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}