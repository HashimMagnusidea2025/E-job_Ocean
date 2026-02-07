import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout";

const LocationPage = () => {
    const [locations, setLocations] = useState([]);
    const [editingLocation, setEditingLocation] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState("");

    const fetchLocations = async () => {
        try {
            const res = await axios.get("/location");
            setLocations(res.data.location);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const toggleStatus = async (location) => {
        const updatedStatus = location.status === "active" ? "inactive" : "active";
        try {
            await axios.put(`/location/${location._id}`, {
                ...location,
                status: updatedStatus,
            });
            Swal.fire("Success", `Location status changed to ${updatedStatus}.`, "success");
            fetchLocations();
        } catch (error) {
            console.error("Error toggling status:", error);
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };




    const toCamelCase = (str) => {
        return str
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...formData,
                name: toCamelCase(formData.name), //  convert to camelCase
            };

            if (editingLocation) {
                await axios.put(`/location/${editingLocation._id}`, formattedData);
                Swal.fire("Updated!", "Location updated successfully.", "success");
            } else {
                await axios.post("/location", formattedData);
                Swal.fire("Added!", "Location created successfully.", "success");
            }

            setFormData({ name: "", status: "active" });
            setEditingLocation(null);
            setShowModal(false);
            fetchLocations();
        } catch (error) {
            console.error("Error submitting location:", error);
            Swal.fire("Error!", "Something went wrong.", "error");
        }
    };


    const handleEdit = (location) => {
        setFormData({ name: location.name, status: location.status });
        setEditingLocation(location);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This location will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/location/${id}`);
                Swal.fire("Deleted!", "Location has been deleted.", "success");
                fetchLocations();
            } catch (error) {
                console.error("Error deleting location:", error);
                Swal.fire("Error!", "Something went wrong.", "error");
            }
        }
    };

    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            header: "Status",
            cell: ({ row }) =>
                row.original.status === "active" ? (
                    <span className="text-green-600 font-semibold">Active</span>
                ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="text-green-600"
                    >
                        <FaEdit size={20} />
                    </button>
                    <button
                        onClick={() => toggleStatus(row.original)}
                        className="text-blue-600"
                    >
                        {row.original.status === "active" ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
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
        data: locations,
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
        <div className="p-4 sm:p-6 md:p-8 w-full mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Location Category</h1>
                <div className="">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => {
                        setShowModal(true);
                        setEditingLocation(null);
                        setFormData({ name: "", status: "active" });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    + Create Location
                </button>
            </div>

            {/* Filter Input */}


            {/* Table */}
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
                                    No locations found
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

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                            {editingLocation ? "Edit" : "Add"} Location
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Location Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter location name"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                {editingLocation ? "Update" : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </Layout>
    );
};

export default LocationPage;
