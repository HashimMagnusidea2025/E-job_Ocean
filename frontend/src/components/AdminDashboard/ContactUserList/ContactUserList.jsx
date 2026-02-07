import React from "react";
import { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
export default function ContactUserList() {
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchText, setSearchText] = useState("");

   
    const fetchContacts = async () => {
        try {
            const res = await axios.get("/contact");
            setContactList(res.data);
            setFilteredContacts(res.data);
        } catch (err) {
            console.error("Error fetching contact data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);


    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the contact.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/contact/${id}`);
                setContactList((prev) => prev.filter((item) => item._id !== id));
                Swal.fire("Deleted!", "Contact has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "Failed to delete contact.", "error");
            }
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = contactList.filter((contact) => {
            return (
                (contact.fullName || "").toLowerCase().includes(value) ||
                (contact.email || "").toLowerCase().includes(value) ||
                (contact.contactNumber || "").toLowerCase().includes(value) ||
                (contact.message || "").toLowerCase().includes(value)
            );
        });

        setFilteredContacts(filtered);
    };

    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "fullName",
            header: "Full Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "contactNumber",
            header: "Contact Number",
        },
        {
            accessorKey: "message",
            header: "Message",
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <button
                    onClick={() => handleDelete(row.original._id)}
                    className="text-red-500 cursor-pointer"
                >
                    <FaTrash size={22} />
                </button>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredContacts,
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
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#008080]">Contact User List</h2>
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 rounded"
                    />
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-6 text-gray-500">Loading...</div>
                    ) : (
                        <>
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
                                        No contacts found
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
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
