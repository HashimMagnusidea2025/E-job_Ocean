import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import Layout from "../../seekerDashboard/partials/layout.jsx";
export default function CMSPage() {
    const [cmsPages, setCmsPages] = useState([]);
    const [cmsContent, setContent] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modelCms, setModelCms] = useState(false)
    const [formMode, setFormMode] = useState("add"); 
    const [selectedPage, setSelectedPage] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });
    const [cmsContentData, setCmsContentData] = useState({
        line_1: "",
        line_2: "",
        line_3: "",
        line_4: "",
        line_5: "",
        page: "",
        status: "active",
    });
    const [filteredCmsContent, setFilteredCmsContent] = useState([]);
    const [searchText, setSearchText] = useState("");


    const handleViewContent = async (row) => {
        try {
            const { data } = await axios.get(`/cms-content/${row._id}`);
            Swal.fire({
                title: `View CMS Content`,
                html: `
        <div style="text-align:left">
          <p><b>Page:</b> ${data.page?.name || "—"}</p>
          <p><b>Line 1:</b> ${data.line_1 || "—"}</p>
          <p><b>Line 2:</b> ${data.line_2 || "—"}</p>
          <p><b>Line 3:</b> ${data.line_3 || "—"}</p>
          <p><b>Line 4:</b> ${data.line_4 || "—"}</p>
          <p><b>Line 5:</b> ${data.line_5 || "—"}</p>
          <p><b>Status:</b> ${data.status}</p>
        </div>
      `,
                confirmButtonText: "Close",
            });
        } catch (err) {
            console.error("Error viewing content:", err);
        }
    };
 
    const handleDeleteContent = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the CMS content.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`/cms-content/${id}`);
            Swal.fire("Deleted!", "CMS content has been deleted.", "success");
            fetchCMSContent(); 
        } catch (err) {
            Swal.fire("Error!", "Failed to delete CMS content.", "error");
        }
    };
    
    const handleEditContent = (row) => {
        setFormMode("edit");
        setCmsContentData({
            line_1: row.line_1 || "",
            line_2: row.line_2 || "",
            line_3: row.line_3 || "",
            line_4: row.line_4 || "",
            line_5: row.line_5 || "",
            page: row.page?._id || "",
            status: row.status || "active",
        });
        setSelectedPage(row);
        setModelCms(true);
    };

    const handleCMSContentChange = (e) => {
        setCmsContentData({ ...cmsContentData, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = cmsContent.filter((content) => {
            const pageName = content.page?.name?.toLowerCase() || '';
            const status = content.status?.toLowerCase() || '';

            return (
                pageName.includes(value) ||
                status.includes(value)
            );
        });

        setFilteredCmsContent(filtered);
    };
    
    
    const handleCMSContentSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formMode === "edit") {
                await axios.put(`/cms-content/${selectedPage._id}`, cmsContentData);
                Swal.fire("Updated!", "CMS content updated successfully.", "success");
            } else {
                await axios.post("/cms-content", cmsContentData);
                Swal.fire("Success!", "CMS content added successfully.", "success");
            }

            setModelCms(false);
            fetchCMSContent();
        } catch (err) {
            Swal.fire("Error!", "Failed to save CMS content.", "error");
        }
    };

    const fetchCMSPages = async () => {
        try {
            const { data } = await axios.get("/cms-page");
            setCmsPages(data);
        } catch (err) {
            console.err("Error fetching CMS Pages:", err);
        }
    };

    const fetchCMSContent = async () => {

        try {
            const { data } = await axios.get('/cms-content');
            setContent(data);
            setFilteredCmsContent(data);
        } catch (err) {
            console.err("Error fetching CMS Content:", err);
        }
    }

    useEffect(() => {
        fetchCMSPages();
        fetchCMSContent();
    }, []);

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formMode === "add") {
                await axios.post("/cms-page", formData);
            } else if (formMode === "edit") {
                await axios.put(`/cms-page/${selectedPage._id}`, formData);
            }
            fetchCMSPages();
            setModalOpen(false);
        } catch (err) {
            console.error("Error saving CMS Page:", err);
        }
    };

    
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this CMS Page?")) return;
        try {
            await axios.delete(`/cms-page/${id}`);
            fetchCMSPages();
        } catch (err) {
            console.error("Error deleting CMS Page:", err);
        }
    };

    
    const openModal = (mode, page = null) => {
        setFormMode(mode);
        setSelectedPage(page);
        if (mode === "edit" || mode === "view") {
            setFormData({ name: page.name, status: page.status });
        } else {
            setFormData({ name: "", status: "active" });
        }
        setModalOpen(true);
    };

   

    const cmsColumns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "page.name",
            header: "Page",
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
                        onClick={() => handleViewContent(row.original)}
                        className="text-blue-600"
                    >
                        <FaEye size={20} />
                    </button>
                    <button
                        onClick={() => handleEditContent(row.original)}
                        className="text-green-600"
                    >
                        <FaEdit size={20} />
                    </button>
                    <button
                        onClick={() => handleDeleteContent(row.original._id)}
                        className="text-red-600"
                    >
                        <FaTrash size={20} />
                    </button>
                </div>
            ),
        },
    ];
    const cmsTable = useReactTable({
        data: filteredCmsContent,
        columns: cmsColumns,
        state: {
            globalFilter: searchText,
        },
        onGlobalFilterChange: setSearchText,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const cmsPagesColumns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openModal("view", row.original)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEye size={22} />
                    </button>
                    <button
                        onClick={() => openModal("edit", row.original)}
                        className="text-green-500 hover:text-green-700"
                    >
                        <FaEdit size={22} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTrash size={22} />
                    </button>
                </div>
            ),
        },
    ];

    const cmsPagesTable = useReactTable({
        data: cmsPages,
        columns: cmsPagesColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });





    return (
        <Layout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">CMS Pages Category</h2>
                    <button
                        onClick={() => openModal("add")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FaPlus /> Add Page Category
                    </button>
                </div>

                
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            {cmsPagesTable.getHeaderGroups().map(headerGroup => (
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
                            {cmsPagesTable.getRowModel().rows.map(row => (
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

                            {cmsPagesTable.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={cmsPagesColumns.length} className="text-center py-6 text-gray-500">
                                        No CMS pages found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4">
                        <button
                            onClick={() => cmsPagesTable.previousPage()}
                            disabled={!cmsPagesTable.getCanPreviousPage()}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm">
                            Page {cmsPagesTable.getState().pagination.pageIndex + 1} of{" "}
                            {cmsPagesTable.getPageCount()}
                        </span>

                        <button
                            onClick={() => cmsPagesTable.nextPage()}
                            disabled={!cmsPagesTable.getCanNextPage()}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>


                
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 capitalize">
                                {formMode} CMS Page
                            </h3>
                            {formMode === "view" ? (
                                <div className="space-y-3">
                                    <p>
                                        <span className="font-semibold">Name:</span> {selectedPage.name}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Status:</span>{" "}
                                        {selectedPage.status}
                                    </p>
                                    <div className="mt-4 text-right">
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full border rounded px-3 py-2 mt-1"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(false)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}



                <div className="flex justify-between items-center mb-6 mt-16">
                    <h2 className="text-2xl font-semibold text-gray-800">CMS Page</h2>
                    <input
                        type="text"
                        placeholder="Search CMS pages..."
                        value={searchText}
                        onChange={handleSearch}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={() => setModelCms(true)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        + Add CMS
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            {cmsTable.getHeaderGroups().map(headerGroup => (
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
                            {cmsTable.getRowModel().rows.map(row => (
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

                            {cmsTable.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={cmsColumns.length} className="text-center py-6 text-gray-500">
                                        No CMS pages found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4">
                        <button
                            onClick={() => cmsTable.previousPage()}
                            disabled={!cmsTable.getCanPreviousPage()}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm">
                            Page {cmsTable.getState().pagination.pageIndex + 1} of{" "}
                            {cmsTable.getPageCount()}
                        </span>

                        <button
                            onClick={() => cmsTable.nextPage()}
                            disabled={!cmsTable.getCanNextPage()}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>


                {modelCms && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        onClick={() => setModelCms(false)} 
                    >
                        <div
                            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <h3 className="text-xl font-semibold mb-4 capitalize">Add CMS Page</h3>

                            <form onSubmit={handleCMSContentSubmit} className="space-y-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div key={num}>
                                        <label className="block text-gray-700 mb-1">Line {num}</label>
                                        <ReactQuill
                                            theme="snow"
                                            value={cmsContentData[`line_${num}`]}
                                            onChange={(val) =>
                                                setCmsContentData({ ...cmsContentData, [`line_${num}`]: val })
                                            }
                                            className="bg-white border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-gray-700">Page Category</label>
                                    <select
                                        name="page"
                                        value={cmsContentData.page}
                                        onChange={handleCMSContentChange}
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        required
                                    >
                                        <option value="">Select Page Category</option>
                                        {cmsPages.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={cmsContentData.status}
                                        onChange={handleCMSContentChange}
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-white pt-2 pb-1">
                                    <button
                                        type="button"
                                        onClick={() => setModelCms(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
}
