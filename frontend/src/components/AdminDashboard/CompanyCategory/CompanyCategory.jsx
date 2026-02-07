import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../../utils/axios.js";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function CompanyCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/company-category");
            setCategories(res.data);
            setFilteredCategories(res.data);
        } catch (err) {
            Swal.fire("Error!", err.response?.data?.message || "Failed to fetch", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the category permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/company-category/${id}`);
                    setCategories((prev) => {
                        const updated = prev.filter((c) => c._id !== id);
                        setFilteredCategories(updated);
                        return updated;
                    });
                    Swal.fire("Deleted!", "Category deleted successfully.", "success");
                } catch (err) {
                    Swal.fire("Error!", err.response?.data?.message || "Delete failed", "error");
                }
            }
        });
    };

  
    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, status: category.status });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", status: "active" });
        }
        setIsModalOpen(true);
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {

                const res = await axios.put(`/company-category/${editingCategory._id}`, formData);
                setCategories((prev) => {
                    const updated = prev.map((c) => (c._id === editingCategory._id ? res.data : c));
                    setFilteredCategories(updated);
                    return updated;
                });
                Swal.fire("Updated!", "Category updated successfully.", "success");
            } else {

                const res = await axios.post("/company-category", formData);
                setCategories((prev) => {
                    const updated = [res.data, ...prev];
                    setFilteredCategories(updated);
                    return updated;
                });
                Swal.fire("Created!", "Category created successfully.", "success");
            }
            setIsModalOpen(false);
        } catch (err) {
            Swal.fire("Error!", err.response?.data?.message || "Operation failed", "error");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const res = await axios.put(`/company-category/${id}`, { status: newStatus });

            setCategories((prev) => {
                const updated = prev.map((c) => (c._id === id ? res.data : c));
                setFilteredCategories(updated);
                return updated;
            });
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = categories.filter((category) => {
            return (
                category.name.toLowerCase().includes(value) ||
                category.status.toLowerCase().includes(value)
            );
        });

        setFilteredCategories(filtered);
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-1 rounded text-white text-xs ${row.original.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {row.original.status}
                    </span>

                    <button
                        onClick={() => handleToggleStatus(row.original._id, row.original.status)}
                        className="p-0.5 rounded hover:bg-gray-100"
                        title="Toggle status"
                    >
                        {row.original.status === "active" ? (
                            <FaToggleOn size={26} className="text-green-500" />
                        ) : (
                            <FaToggleOff size={26} className="text-red-500" />
                        )}
                    </button>
                </div>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openModal(row.original)}
                    >
                        <FaEdit size={20}/>
                    </button>
                    <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(row.original._id)}
                    >
                        <FaTrash size={20}/>
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredCategories,
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
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Company Categories</h1>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={() => openModal()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Add Category
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
                                        No categories found
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
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingCategory ? "Edit Category" : "Create Category"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        {editingCategory ? "Update" : "Create"}
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
