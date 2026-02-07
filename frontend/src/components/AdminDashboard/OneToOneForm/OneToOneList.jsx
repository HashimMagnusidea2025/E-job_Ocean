import { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";

export default function OneToOneList() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewData, setViewData] = useState(null);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [searchText, setSearchText] = useState("");

    // Fetch sessions
    const fetchSessions = async () => {
        try {
            const { data } = await axios.get("/one-to-one");
            setSessions(data);
            setFilteredSessions(data);
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

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = sessions.filter((session) => {
            const speakerName = (session.Speaker?.firstName || session.Speaker || '').toLowerCase();
            return (
                speakerName.includes(value) ||
                session.courseTitle.toLowerCase().includes(value) ||
                session.courseType.toLowerCase().includes(value) ||
                session.fees.toString().toLowerCase().includes(value) ||
                session.startTime.toLowerCase().includes(value) ||
                session.endTime.toLowerCase().includes(value) ||
                session.status.toLowerCase().includes(value)
            );
        });

        setFilteredSessions(filtered);
    };
    const formatTimeToAMPM = (timeStr) => {
        if (!timeStr) return "";

        const [hours, minutes] = timeStr.split(":");
        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Table columns
    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "Speaker",
            header: "Speaker",
            cell: ({ row }) => row.original.Speaker?.firstName || row.original.Speaker,
        },
        {
            accessorKey: "courseTitle",
            header: "Course Title",
        },
        {
            accessorKey: "courseType",
            header: "Course Type",
        },
        {
            accessorKey: "fees",
            header: "Fees",
        },
        {
            accessorKey: "startTime",
            header: "Start Time",
            cell: ({ row }) => formatTimeToAMPM(row.original.startTime),
        },
        {
            accessorKey: "endTime",
            header: "End Time",
            cell: ({ row }) => formatTimeToAMPM(row.original.endTime),
        },

        {
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded text-white ${row.original.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => handleView(row.original)} className="text-blue-500 hover:text-blue-700">
                        <FaEye size={22} />
                    </button>
                    <button
                        onClick={() => window.location.href = `/admin-dashboard/add-one-to-one?editId=${row.original._id}`}
                        className="text-yellow-500 hover:text-yellow-700"
                    >
                        <FaEdit size={22} />
                    </button>
                    <button onClick={() => handleDelete(row.original._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash size={22} />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredSessions,
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
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg font-[Poppins] mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">One-to-One Sessions</h2>
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={() => window.location.href = '/admin-dashboard/add-one-to-one'}
                        className="bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold">
                        Create Session
                    </button>
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
                                        No sessions found
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


