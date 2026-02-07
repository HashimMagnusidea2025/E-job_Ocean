import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
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
const OurFounders = () => {
    const [founders, setFounders] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        desgination: "",
        image: null,
    });

    const [filteredFounders, setFilteredFounders] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchFounders();
    }, []);

    const fetchFounders = async () => {
        try {
            const res = await axios.get("/our-founders");
            setFounders(res.data);
            setFilteredFounders(res.data);
        } catch (error) {
            console.error("Error fetching founders:", error);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = founders.filter((founder) => {
            return (
                founder.name.toLowerCase().includes(value) ||
                founder.desgination.toLowerCase().includes(value) ||
                founder.description.toLowerCase().includes(value)
            );
        });

        setFilteredFounders(filtered);
    };

    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => (
                <img
                    src={`${baseURL}${row.original.image}`}
                    alt={row.original.name}
                    className="w-16 h-16 object-cover rounded"
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "desgination",
            header: "Designation",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <p className="line-clamp-3 text-sm text-gray-700 max-w-xs">
                    {row.original.description}
                </p>
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
        data: filteredFounders,
        columns,
        state: {
            globalFilter: searchText,
        },
        onGlobalFilterChange: setSearchText,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this founder?")) return;

        try {
            await axios.delete(`/our-founders/${id}`);
            alert("Founder deleted successfully");
            fetchFounders();
        } catch (err) {
            console.error(err);
            alert("Error deleting founder");
        }
    };

   
    const handleEdit = (founder) => {
        setEditId(founder._id);
        setFormData({
            name: founder.name || "",
            description: founder.description || "",
            desgination: founder.desgination || "",
            image: null,
        });
        setPreviewImage(founder.image ? `${baseURL}${founder.image}` : null);
        setOpen(true);
    };

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

 
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("desgination", formData.desgination);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            if (editId) {
                await axios.put(`/our-founders/${editId}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Founder updated successfully");
            } else {
                await axios.post("/our-founders", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Founder created successfully");
            }
            setOpen(false);
            setEditId(null);
            setFormData({ name: "", description: "", desgination: "", image: null });
            setPreviewImage(null);
            fetchFounders();
        } catch (err) {
            console.error(err);
            alert("Error saving founder");
        }
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Our Founders</h2>
                    <input
                        type="text"
                        placeholder="Search founders..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        + Add Founder
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
                                        No founders found
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

                
                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
                            <div className="flex justify-between items-center border-b pb-3 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {editId ? "Update Founder" : "Add Founder"}
                                </h3>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter Name"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Designation</label>
                                    <input
                                        type="text"
                                        name="desgination"
                                        placeholder="Enter Designation"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        value={formData.desgination}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter Description"
                                        className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={handleFileChange}
                                        required={!editId}
                                    />
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="mt-2 w-32 h-32 rounded-full object-cover border"
                                        />
                                    )}
                                </div>

                                <div className="flex justify-end gap-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default OurFounders;