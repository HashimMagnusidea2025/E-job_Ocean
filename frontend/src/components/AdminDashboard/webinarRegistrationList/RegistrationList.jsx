// components/admin/WebinarRegistrationList.jsx
import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
export default function WebinarRegistrationList() {
    const [registrations, setRegistrations] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        webinarId: "",
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


    axios.get("/country").then((res) => setCountries(res.data.country));
    // dependent dropdowns
    useEffect(() => {
        if (formData.country) {
            axios.get(`/state/country/${formData.country}`).then((res) => setStates(res.data.data));
        } else setStates([]);
    }, [formData.country]);

    useEffect(() => {
        if (formData.state) {
            axios.get(`/city/state/${formData.state}`).then((res) => setCities(res.data.data));
        } else setCities([]);
    }, [formData.state]);


    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const { data } = await axios.get("/registrations/webinar");
                setRegistrations(data);
                setFilteredData(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRegistrations();
    }, []);


    // Search filter effect
    useEffect(() => {
        const result = registrations.filter((row) => {
            return (
                row.webinarId?.WebinarTitle?.toLowerCase().includes(search.toLowerCase()) ||
                row.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                row.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                row.email?.toLowerCase().includes(search.toLowerCase()) ||
                row.mobile?.toString().includes(search.toLowerCase()) ||
                row.type?.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredData(result);
    }, [search, registrations]);


    // 📌 Handle View
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
            webinarId: row.webinarId?._id || "",
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
        const { name, value } = e.target;

        // Reset dependent dropdowns
        if (name === "country") {
            setFormData({ ...formData, country: value, state: "", city: "" });
        } else if (name === "state") {
            setFormData({ ...formData, state: value, city: "" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleUpdate = async () => {
        try {
            const { data } = await axios.put(`/registrations/webinar/update/${selectedRow._id}`, formData);
            const updatedRegs = registrations.map(r => r._id === selectedRow._id ? data : r);
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
                await axios.delete(`/registrations/webinar/delete/${id}`);
                const updatedRegs = registrations.filter(r => r._id !== id);
                setRegistrations(updatedRegs);
                setFilteredData(updatedRegs);
            } catch (err) {
                console.error(err);
            }
        }
    };
    const columns = [
        { name: "#", cell: (row, index) => index + 1, width: "60px" },
        {
            name: "Webinar",
            selector: (row) => row.webinarId?.WebinarTitle || "N/A",
            sortable: true
        },

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
                    <h2 className="text-xl font-bold">Webinar Registrations</h2>
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

                {/* 📌 View Modal */}
                {isViewOpen && selectedRow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                            <button
                                onClick={handleCloseView}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                            <h3 className="text-xl font-semibold mb-4">Registration Details</h3>
                            <div className="space-y-2 text-gray-700">
                                <p><b>Webinar:</b> {selectedRow.webinarId?.WebinarTitle || "N/A"}</p>
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

                {isEditOpen && selectedRow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={handleCloseEdit}
                                className="absolute top-3 right-3 text-gray-500"
                            >
                                ✕
                            </button>
                            <h3 className="text-xl font-semibold mb-4">Edit Registration</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block mb-1 font-medium">First Name</label>
                                    <input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Last Name</label>
                                    <input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Email</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Mobile</label>
                                    <input
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Type</label>
                                    <input
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        placeholder="Type"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* State Dropdown */}
                                <div>
                                    <label className="block mb-1 font-medium">State</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        disabled={!formData.country}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((s) => (
                                            <option key={s._id} value={s._id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Dropdown */}
                                <div>
                                    <label className="block mb-1 font-medium">City</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        disabled={!formData.state}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city._id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">GST Number</label>
                                    <input
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        placeholder="GST Number"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Pin Code</label>
                                    <input
                                        name="pinCode"
                                        value={formData.pinCode}
                                        onChange={handleChange}
                                        placeholder="Pin Code"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </Layout>
    );
}
