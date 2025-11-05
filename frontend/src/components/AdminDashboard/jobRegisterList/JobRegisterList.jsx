import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "../../../utils/axios";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout";

export default function JobRegisterList() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selected, setSelected] = useState(null);

    // Form and dropdowns
    const [formData, setFormData] = useState({});
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDropdown, setLoadingDropdown] = useState({
        countries: false,
        states: false,
        cities: false,
    });

    // Fetch all registrations
    const fetchRegistrations = async () => {
        try {
            const { data } = await axios.get("/job-register");
            setRegistrations(data.registrations || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // Load dropdowns
    useEffect(() => {
        const loadCountries = async () => {
            setLoadingDropdown(p => ({ ...p, countries: true }));
            try {
                const res = await axios.get("/country");
                setCountries(res.data.country || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDropdown(p => ({ ...p, countries: false }));
            }
        };
        loadCountries();
    }, []);

    useEffect(() => {
        const loadStates = async () => {
            if (!formData.country) {
                setStates([]);
                return;
            }
            setLoadingDropdown(p => ({ ...p, states: true }));
            try {
                const res = await axios.get(`/state/country/${formData.country}`);
                setStates(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDropdown(p => ({ ...p, states: false }));
            }
        };
        loadStates();
    }, [formData.country]);

    useEffect(() => {
        const loadCities = async () => {
            if (!formData.state) {
                setCities([]);
                return;
            }
            setLoadingDropdown(p => ({ ...p, cities: true }));
            try {
                const res = await axios.get(`/city/state/${formData.state}`);
                setCities(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDropdown(p => ({ ...p, cities: false }));
            }
        };
        loadCities();
    }, [formData.state]);

    // Change handlers
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "resume") {
            setFormData(prev => ({ ...prev, resume: files[0] }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                ...(name === "country" ? { state: "", city: "" } : {}),
                ...(name === "state" ? { city: "" } : {}),
            }));
        }
    };

    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            ...(field === "country" && { state: "", city: "" }),
            ...(field === "state" && { city: "" }),
        }));
    };

    // Delete
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This registration will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/job-register/${id}`);
                Swal.fire("Deleted!", "Registration has been deleted.", "success");
                fetchRegistrations();
            } catch (err) {
                Swal.fire("Error!", "Failed to delete registration.", "error");
            }
        }
    };

    // View and Edit
    const handleView = (row) => {
        setSelected(row);
        setViewModal(true);
    };

    const handleEdit = (row) => {
        setSelected(row);
        setFormData(row);
        setEditModal(true);
    };

    const closeModal = () => {
        setEditModal(false);
        setViewModal(false);
        setSelected(null);
    };

    // Save Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value);
            });

            await axios.put(`/job-register/${selected._id}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire("Updated!", "Registration updated successfully.", "success");
            setEditModal(false);
            fetchRegistrations();
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to update registration.", "error");
        }
    };

    // Table columns
    const columns = [
        { name: "Job Title", selector: row => row.jobId?.jobTitle || "-", sortable: true },
        { name: "Name", selector: row => `${row.firstName} ${row.lastName}`, sortable: true },
        { name: "Email", selector: row => row.email, sortable: true },
        { name: "Mobile", selector: row => row.mobile, sortable: true },
        { name: "Location", selector: row => `${row.city}, ${row.state}, ${row.country}`, sortable: true },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-3">
                    <FaEye size={22} className="text-blue-500 cursor-pointer" onClick={() => handleView(row)} />
                    <FaEdit size={22} className="text-green-500 cursor-pointer" onClick={() => handleEdit(row)} />
                    <FaTrash size={22} className="text-red-500 cursor-pointer" onClick={() => handleDelete(row._id)} />
                </div>
            )
        }
    ];

    return (
        <Layout>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Job Registrations</h2>
                <DataTable
                    columns={columns}
                    data={registrations}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                />
            </div>

            {/* ✅ VIEW MODAL */}
            {viewModal && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-700">View Registration</h3>
                        <div className="space-y-2">
                            <p><b>Job:</b> {selected.jobId?.jobTitle}</p>
                            <p><b>Name:</b> {selected.firstName} {selected.lastName}</p>
                            <p><b>Email:</b> {selected.email}</p>
                            <p><b>Mobile:</b> {selected.mobile}</p>
                            <p><b>Country:</b> {selected.country}</p>
                            <p><b>State:</b> {selected.state}</p>
                            <p><b>City:</b> {selected.city}</p>
                            <p><b>Resume:</b> <a href={`/${selected.resume}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">View Resume</a></p>
                        </div>
                        <div className="text-right mt-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ EDIT MODAL */}
            {editModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-lg">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
                        >
                            &times;
                        </button>

                        <h3 className="text-xl font-bold mb-4 text-gray-700">Edit Registration</h3>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="border border-gray-300 rounded px-3 py-2 w-1/2"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="border border-gray-300 rounded px-3 py-2 w-1/2"
                                />
                            </div>

                            {/* Email / Mobile */}
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                placeholder="Email"
                                className="border border-gray-300 rounded px-3 py-2"
                            />
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile || ""}
                                onChange={handleChange}
                                placeholder="Mobile"
                                className="border border-gray-300 rounded px-3 py-2"
                            />

                            {/* Location */}
                            <div className="grid grid-cols-3 gap-3">
                                <select
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={(e) => handleLocationChange("country", e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="">-- Country --</option>
                                    {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>

                                <select
                                    name="state"
                                    value={formData.state || ""}
                                    onChange={(e) => handleLocationChange("state", e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="">-- State --</option>
                                    {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>

                                <select
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={(e) => handleLocationChange("city", e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="">-- City --</option>
                                    {cities.map(ci => <option key={ci._id} value={ci._id}>{ci.name}</option>)}
                                </select>
                            </div>

                            {/* Resume */}
                            <input
                                type="file"
                                name="resume"
                                onChange={handleChange}
                            />

                            <button
                                type="submit"
                                className="bg-[#339ca0] text-white py-2 rounded hover:opacity-90 mt-2"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
