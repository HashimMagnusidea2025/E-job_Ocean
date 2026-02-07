import { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function MeetOurTeam() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        name: "",
        text: "",
        image: null,
        status: "active",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get("/meet-our-team");
        setData(res.data);
        console.log(res.data);

    };

    const columns = [
        {
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Image",
            cell: ({ row }) => (
                <img
                    src={`${baseURL}/${row.original.image}`}
                    className="w-16 h-16 rounded object-cover"
                />
            ),
        },
        { accessorKey: "name", header: "Name" },
        {
            accessorKey: "text",
            header: "Text",
            cell: ({ row }) => (
                <p className="line-clamp-2 max-w-xs text-sm">
                    {row.original.text}
                </p>
            ),
        },

        { accessorKey: "status", header: "status" },
        {
            header: "Action",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <FaEdit
                        className="text-green-600 cursor-pointer"
                        onClick={() => handleEdit(row.original)}
                    />
                    <FaTrash
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(row.original._id)}
                    />
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleEdit = (item) => {
        setEditId(item._id);
        setForm({ name: item.name, text: item.text, image: null, status: item.status });
        setPreview(`${baseURL}${item.image}`);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete?")) return;
        await axios.delete(`/meet-our-team/${id}`);
        fetchData();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("text", form.text);
        fd.append("status", form.status);
        if (form.image) fd.append("image", form.image);

        if (editId) {
            await axios.put(`/meet-our-team/${editId}`, fd);
        } else {
            await axios.post("/meet-our-team", fd);
        }

        setOpen(false);
        setEditId(null);
        setForm({ name: "", text: "", image: null, status: "active" });
        setPreview(null);
        fetchData();
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Meet Our Team
                    </h2>

                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200"
                    >
                        <span className="text-lg font-semibold">+</span>
                        Add Team
                    </button>
                </div>



                <table className="w-full border">
                    <thead>
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>
                                {hg.headers.map(h => (
                                    <th key={h.id} className="border p-2">
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
                                    <td key={cell.id} className="border p-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {open && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-6 rounded w-[400px]"
                        >
                            <input
                                className="border w-full p-2 mb-2"
                                placeholder="Name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />

                            <textarea
                                className="border w-full p-2 mb-2"
                                placeholder="Text"
                                value={form.text}
                                onChange={e => setForm({ ...form, text: e.target.value })}
                            />
                            <div className=" w-full p-2 mb-2">
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <input
                                type="file"
                                onChange={e =>
                                    setForm({ ...form, image: e.target.files[0] })
                                }
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    className="w-24 h-24 mt-2 rounded"
                                />
                            )}

                            <button className="bg-green-600 text-white px-4 py-2 mt-4 rounded">
                                Save
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
}
