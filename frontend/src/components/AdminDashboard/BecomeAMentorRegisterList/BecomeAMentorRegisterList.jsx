import React, { useEffect, useState } from "react";
import Layout from "../../seekerDashboard/partials/layout";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function BecomeAMentorRegisterList() {
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [searchText, setSearchText] = useState("");

    const fetchMentors = async () => {
        try {
            const res = await axios.get("/auth/mentors");
            if (res.data.success) {
                setMentors(res.data.data);
                setFilteredMentors(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const handleView = (mentor) => {
        Swal.fire({
            title: `${mentor.firstName} ${mentor.lastName}`,
            html: `
      <p>Email: ${mentor.email}</p>
      <p>Phone: ${mentor.phone || "N/A"}</p>
      <p>Status: ${mentor.Approved}</p>
    `,
        });
    };

    const handleEdit = (mentor) => {
        console.log("Edit mentor:", mentor);
    };

    const handleDelete = async (mentor) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/auth/mentor/${mentor._id}`);
                Swal.fire("Deleted!", "Mentor has been deleted.", "success");
                fetchMentors();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete mentor.", "error");
            }
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = mentors.filter((mentor) => {
            return (
                mentor.firstName.toLowerCase().includes(value) ||
                mentor.lastName.toLowerCase().includes(value) ||
                mentor.email.toLowerCase().includes(value)
            );
        });

        setFilteredMentors(filtered);
    };

    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "firstName",
            header: "First Name",
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            header: "Approved",
            cell: ({ row }) => (
                <select
                    value={row.original.Approved}
                    onChange={async (e) => {
                        const action = e.target.value;

                        if (action === "Approved") {
                            const { value: password } = await Swal.fire({
                                title: `Approve ${row.original.firstName}?`,
                                input: "text",
                                inputLabel: "Set a password for mentor login",
                                inputPlaceholder: "Enter password",
                                showCancelButton: true,
                            });

                            if (!password) return;

                            await axios.post("/auth/approve-mentor", {
                                userId: row.original._id,
                                password,
                                action: "approve",
                            });

                            Swal.fire(
                                "Approved!",
                                "Mentor account activated successfully.",
                                "success"
                            );
                        } else if (action === "Rejected") {
                            await axios.post("/auth/approve-mentor", {
                                userId: row.original._id,
                                action: "reject",
                            });

                            Swal.fire("Rejected!", "Mentor account rejected.", "error");
                        }

                        fetchMentors();
                    }}
                    className={`px-2 py-1 rounded ${row.original.Approved === "Approved"
                            ? "bg-green-500 text-white"
                            : row.original.Approved === "Rejected"
                                ? "bg-red-500 text-white"
                                : "bg-yellow-500 text-black"
                        }`}
                >
                    <option value="pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            ),
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
                        onClick={() => handleEdit(row.original)}
                        className="text-green-600"
                    >
                        <FaEdit size={20} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original)}
                        className="text-red-600"
                    >
                        <FaTrash size={20} />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredMentors,
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
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Mentor Registration List</h1>
                    <input
                        type="text"
                        placeholder="Search mentors..."
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
                                        No mentors found
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
            </div>
        </Layout>
    );
}
