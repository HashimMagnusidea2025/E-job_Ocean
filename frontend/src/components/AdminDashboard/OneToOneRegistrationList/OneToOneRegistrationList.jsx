// components/admin/OneToOneRegistrationList.jsx
import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
export default function OneToOneRegistrationList() {

    const [registrations, setRegistrations] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        type: "",
        country: "",
        state: "",
        city: "",
        gstNumber: "",
        pinCode: "",
    });
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const { data } = await axios.get("/registrations/one-to-one");
                setRegistrations(data);
                setFilteredData(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRegistrations();
    }, []);

    // 🔍 Filter logic
    useEffect(() => {
        const result = registrations.filter((row) => {
            return (
                row.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                row.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                row.email?.toLowerCase().includes(search.toLowerCase()) ||
                row.mobile?.toString().includes(search.toLowerCase()) ||
                row.type?.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredData(result);
    }, [search, registrations]);
    // View modal
    const handleView = (row) => {
        setSelectedRow(row);
        setIsViewOpen(true);
    };
    const handleCloseView = () => {
        setSelectedRow(null);
        setIsViewOpen(false);
    };
    // Edit modal
    const handleEdit = (row) => {
        setSelectedRow(row);
        setFormData({
            firstName: row.firstName || "",
            lastName: row.lastName || "",
            email: row.email || "",
            mobile: row.mobile || "",
            type: row.type || "",
            country: row.country || "",
            state: row.state || "",
            city: row.city || "",
            gstNumber: row.gstNumber || "",
            pinCode: row.pinCode || "",
        });
        setIsEditOpen(true);
    };
    const handleCloseEdit = () => {
        setSelectedRow(null);
        setIsEditOpen(false);
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleUpdate = async () => {
        try {
            const { data } = await axios.put(`/registrations/one-to-one/update/${selectedRow._id}`, formData);
            const updatedRegs = registrations.map(r =>
                r._id === selectedRow._id ? data.registration : r
            );
            setRegistrations(updatedRegs);
            setFilteredData(updatedRegs);
            setIsEditOpen(false);
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await axios.delete(`/registrations/one-to-one/delete/${id}`);
                const updatedRegs = registrations.filter(r => r._id !== id);
                setRegistrations(updatedRegs);
                setFilteredData(updatedRegs);
            } catch (err) { console.error(err); }
        }
    };

    const columns = [
        { name: "#", cell: (row, index) => index + 1, width: "60px" },

        { name: "First Name", selector: (row) => row.firstName, sortable: true },
        { name: "Last Name", selector: (row) => row.lastName, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Mobile", selector: (row) => row.mobile, sortable: true },
        { name: "Type", selector: (row) => row.type, sortable: true },
        {
            name: "Actions", cell: (row) => (
                <div className="flex gap-3">
                    <button onClick={() => handleView(row)} title="View"><FaEye className="text-blue-500" size={22} /></button>
                    <button onClick={() => handleEdit(row)} title="Edit"><FaEdit className="text-green-500" size={22} /></button>
                    <button onClick={() => handleDelete(row._id)} title="Delete"><FaTrash className="text-red-500" size={22} /></button>
                </div>
            ), ignoreRowClick: true
        }


    ];

    return (
        <Layout>
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">One-to-One Registrations</h2>
                    <input
                        type="text"
                        placeholder="Search Type..."
                        className="w-full md:w-1/3 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    responsive
                    striped
                    dense
                />

                {isViewOpen && selectedRow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                            <button onClick={handleCloseView} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✕</button>
                            <h3 className="text-xl font-semibold mb-4">Registration Details</h3>
                            <div className="space-y-2 text-gray-700">
                                <p><b>First Name:</b> {selectedRow.firstName}</p>
                                <p><b>Last Name:</b> {selectedRow.lastName}</p>
                                <p><b>Email:</b> {selectedRow.email}</p>
                                <p><b>Mobile:</b> {selectedRow.mobile}</p>
                                <p><b>Type:</b> {selectedRow.type}</p>
                                <p><b>Country:</b> {selectedRow.country || "N/A"}</p>
                                <p><b>State:</b> {selectedRow.state || "N/A"}</p>
                                <p><b>City:</b> {selectedRow.city || "N/A"}</p>
                                <p><b>GST Number:</b> {selectedRow.gstNumber || "N/A"}</p>
                                <p><b>Pin Code:</b> {selectedRow.pinCode || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Edit Modal */}
                {/* Edit Modal */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
                            <button
                                onClick={handleCloseEdit}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-bold mb-4">Edit Registration</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate();
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Mobile</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                               
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseEdit}
                                        className="px-4 py-2 bg-gray-300 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
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
