import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { FaEye } from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function UploadCvList() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

    const fetchUploadCv = async () => {
        try {
            const res = await axios.get("/CA-Fresher/upload-cv");

            const dataWithIndex = res.data.data.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            setList(dataWithIndex);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploadCv();
    }, []);

    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Phone" },
        {
            header: "Resume",
            cell: ({ row }) =>
                row.original.ResumeUpload ? (
                    <a
                        href={`${baseURL}/uploads/resume/${row.original.ResumeUpload}`}
                        target="_blank"
                        className="text-blue-600 underline"
                    >
                        View
                    </a>
                ) : (
                    "N/A"
                ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedRow(row.original)}
                    className="text-blue-600"
                >
                    <FaEye size={18} />
                </button>
            ),
        },
    ];

    const table = useReactTable({
        data: list,
        columns,
        state: { globalFilter: searchText },
        onGlobalFilterChange: setSearchText,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (loading) {
        return (
            <Layout>
                <div className="p-6 text-center">Loading...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Upload CV Registrations
                </h2>

                <input
                    type="text"
                    placeholder="Search..."
                    className="px-3 py-2 border rounded mb-4 w-64"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map(hg => (
                                <tr key={hg.id}>
                                    {hg.headers.map(h => (
                                        <th key={h.id} className="border px-4 py-2">
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="border px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
        </Layout>
    );
}
