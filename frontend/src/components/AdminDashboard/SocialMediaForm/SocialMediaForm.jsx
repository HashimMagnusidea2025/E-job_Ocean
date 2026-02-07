import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios.js"; // axios instance with baseURL
import Layout from '../../seekerDashboard/partials/layout.jsx'
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function SocialMediaForm() {
    const [icons, setIcons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIcon, setEditingIcon] = useState(null);
    const [formData, setFormData] = useState({ name: '', link: '', status: 'active' });
    const [filteredIcons, setFilteredIcons] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        
        fetchIcons();
        
    }, []);

    const fetchIcons = async () => {
        try {
          const res = await axios.get('/social-media-icons');
          setIcons(res.data);
          setFilteredIcons(res.data);
        } catch (err) {
          console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingIcon) {
                await axios.put(`/social-media-icons/${editingIcon._id}`, formData);
                alert('Updated successfully');
            } else {
                await axios.post('/social-media-icons', formData);
                alert('Created successfully');
            }
            setIsModalOpen(false);
            setEditingIcon(null);
            setFormData({ name: '', link: '', status: 'active' });
            fetchIcons();
        } catch (err) {
            console.error(err);
            alert('Error saving icon');
        }
    };

    const openModal = (icon = null) => {
        if (icon) {
            setEditingIcon(icon);
            setFormData({ name: icon.name, link: icon.link, status: icon.status });
        } else {
            setEditingIcon(null);
            setFormData({ name: '', link: '', status: 'active' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIcon(null);
        setFormData({ name: '', link: '', status: 'active' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this icon?')) {
            try {
                await axios.delete(`/social-media-icons/${id}`);
                alert('Deleted successfully');
                fetchIcons();
            } catch (err) {
                console.error(err);
                alert('Error deleting icon');
            }
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = icons.filter((icon) => {
            return (
                icon.name.toLowerCase().includes(value) ||
                icon.link.toLowerCase().includes(value) ||
                icon.status.toLowerCase().includes(value)
            );
        });

        setFilteredIcons(filtered);
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
            accessorKey: "link",
            header: "Link",
            cell: ({ getValue }) => (
                <a href={getValue()} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {getValue()}
                </a>
            ),
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
                        onClick={() => openModal(row.original)}
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
        data: filteredIcons,
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
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6">Social Media Icons</h2>

                <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchText}
                    onChange={handleSearch}
                    className="border p-2 rounded mb-6"
                />

                <button
                    onClick={() => openModal()}
                    className="bg-[#339ca0] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#2b8588] transition-all mb-6"
                >
                    Add New Icon
                </button>

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
                                        No icons found
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

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold mb-4">{editingIcon ? 'Edit Icon' : 'Add New Icon'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Facebook"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Link</label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className="bg-[#339ca0] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#2b8588] transition-all"
                                    >
                                        {editingIcon ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
