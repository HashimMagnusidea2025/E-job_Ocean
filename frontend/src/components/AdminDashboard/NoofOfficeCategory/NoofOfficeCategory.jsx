import { useEffect, useState } from "react";
import axios from "../../../utils/axios"; // <-- your axios instance
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout";

export default function NoofOfficeCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", status: "active" });

    // Fetch data
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/no-of-office-category");
            setCategories(res.data);
            setFilteredCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Search filter
    useEffect(() => {
        const result = categories.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCategories(result);
    }, [search, categories]);

    // Handle Delete
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This category will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/no-of-office-category/${id}`);
                    Swal.fire("Deleted!", "Category has been deleted.", "success");
                    fetchCategories();
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error!", "Failed to delete category.", "error");
                }
            }
        });
    };

    // Handle Create/Edit Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCategory) {
                await axios.put(`/no-of-office-category/${editCategory._id}`, formData);
                Swal.fire("Updated!", "Category updated successfully", "success");
            } else {
                await axios.post("/no-of-office-category", formData);
                Swal.fire("Created!", "Category created successfully", "success");
            }
            fetchCategories();
            closeModal();
        } catch (err) {
            Swal.fire("Error!", err.response?.data?.message || "Failed", "error");
        }
    };

    const openModal = (category = null) => {
        setEditCategory(category);
        if (category) {
            setFormData({ name: category.name, status: category.status });
        } else {
            setFormData({ name: "", status: "active" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditCategory(null);
        setFormData({ name: "", status: "active" });
    };

     const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const category = categories.find(cat => cat._id === id);
    try {
      await axios.put(`/no-of-office-category/${id}`, {
        name: category.name,
        status: newStatus
      });
      fetchCategories();
      
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

    // Table columns
    const columns = [
        {
    name: "ID",
    selector: (row, index) => index + 1, // auto-increment serial number
    sortable: true,
    width: "80px", // optional: keeps the ID column narrow
  },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
              name: "Status",
              cell: (row) => (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded text-white ${
                      row.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {row.status}
                  </span>
                  <button onClick={() => handleToggleStatus(row._id, row.status)}>
                    {row.status === "active" ? (
                      <FaToggleOn size={22} className="text-green-500" />
                    ) : (
                      <FaToggleOff size={22} className="text-red-500" />
                    )}
                  </button>
                </div>
              )
            },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openModal(row)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEdit size={20}/>
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTrash size={20}/>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="p-6 font-sans bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">No. of Office Categories</h2>
                    <button
                        onClick={() => openModal()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Add Category
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search..."
                    className="border p-2 rounded mb-4 w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <DataTable
                    columns={columns}
                    data={filteredCategories}
                    pagination
                    highlightOnHover
                    striped
                />

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-4">
                                {editCategory ? "Edit Category" : "Add Category"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    className="w-full border rounded p-2"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                                <select
                                    className="w-full border rounded p-2"
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        {editCategory ? "Update" : "Create"}
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
