// components/admin/WebinarRegistrationList.jsx


import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Papa from "papaparse";
import Swal from "sweetalert2";

export default function WebinarRegistrationList() {
    const [registrations, setRegistrations] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [webinarFilter, setWebinarFilter] = useState("");

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


    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await axios.get("/country");
                setCountries(res.data.country);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCountries();
    }, []);
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
    // useEffect(() => {
    //     const result = registrations.filter((row) => {
    //         return (
    //             row.webinarId?.WebinarTitle?.toLowerCase().includes(search.toLowerCase()) ||
    //             row.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    //             row.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    //             row.email?.toLowerCase().includes(search.toLowerCase()) ||
    //             row.mobile?.toString().includes(search.toLowerCase()) ||
    //             row.type?.toLowerCase().includes(search.toLowerCase())
    //         );
    //     });
    //     setFilteredData(result);
    // }, [search, registrations]);

    useEffect(() => {
        const result = registrations.filter((row) => {
            const matchesSearch =
                row.webinarId?.WebinarTitle?.toLowerCase().includes(search.toLowerCase()) ||
                row.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                row.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                row.email?.toLowerCase().includes(search.toLowerCase()) ||
                row.mobile?.toString().includes(search.toLowerCase()) ||
                row.type?.toLowerCase().includes(search.toLowerCase());

            const matchesWebinar =
                !webinarFilter ||
                row.webinarId?.WebinarTitle === webinarFilter;

            return matchesSearch && matchesWebinar;
        });
        setFilteredData(result);
    }, [search, webinarFilter, registrations]);



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


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        let data = [];

        try {
            data = JSON.parse(text);
        } catch {
            const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
            data = parsed.data;
        }

        if (!Array.isArray(data) || data.length === 0) {
            Swal.fire({ icon: "error", title: "Invalid File", text: "Empty or invalid data file." });
            return;
        }

        try {
            // Fetch country/state/city lists
            const [countriesRes, statesRes, citiesRes] = await Promise.all([
                axios.get("/country"),
                axios.get("/state"),
                axios.get("/city"),
            ]);

            const countryMap = Object.fromEntries(
                (countriesRes.data.country || []).map(c => [c.name.toLowerCase().trim(), c._id])
            );
            const stateMap = Object.fromEntries(
                (statesRes.data.data || []).map(s => [s.name.toLowerCase().trim(), s._id])
            );
            const cityMap = Object.fromEntries(
                (citiesRes.data.data || []).map(c => [c.name.toLowerCase().trim(), c._id])
            );

            const mappedData = data
                .map((row, i) => {
                    const firstName = row.first_name || row.firstName;
                    const email = row.email;
                    const mobile = row.mobile;
                    const rawCountry = row["country"] || row["Country"] || "India";
                    const rawState = row["state"] || row["State"] || "";
                    const rawCity = row["city"] || row["City"] || "";

                    const countryName = rawCountry.toString().toLowerCase().trim();
                    const stateName = rawState.toString().toLowerCase().trim();
                    const cityName = rawCity.toString().split(",")[0].toLowerCase().trim();

                    const country = countryMap[countryName];
                    const state = stateMap[stateName];
                    const city = cityMap[cityName];

                    if (!firstName || !email || !mobile || !country || !state || !city) return null;

                    return {
                        firstName,
                        lastName: row.last_name || "",
                        email,
                        mobile: mobile.toString(),
                        pinCode: row.zip_code || "",
                        type: row.type || "webinar",
                        country,
                        state,
                        city,
                        gstNumber: row.gst_number || "",
                        webinarId: row.webinar_id || "",
                        one_to_oneId: row.assignment_id || "",
                        selectDate: row.date || "",
                        WebinarType: row.payment_status || "Pending",
                        startTime: row.start_time || "",
                    };
                })
                .filter(Boolean);

            console.log(`✅ ${mappedData.length}/${data.length} valid rows`);

            const batchSize = 100;
            for (let i = 0; i < mappedData.length; i += batchSize) {
                const batch = mappedData.slice(i, i + batchSize);
                await axios.post("/registrations/import", batch);
            }

            Swal.fire({ icon: "success", title: "Import Complete", text: "All records uploaded!" });
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Upload Failed", text: err.message });
        }
    };


    // 📤 Export to CSV
    const handleExport = () => {
        if (!filteredData || filteredData.length === 0) {
            Swal.fire("No Data", "There are no records to export.", "info");
            return;
        }

        // Convert registration objects to CSV
        const csvData = filteredData.map((row, index) => ({
            "#": index + 1,
            Webinar: row.webinarId?.WebinarTitle || "N/A",
            FirstName: row.firstName || "",
            LastName: row.lastName || "",
            Email: row.email || "",
            Mobile: row.mobile || "",
            Type: row.type || "",
            Country: row.country?.name || row.country || "",
            State: row.state?.name || row.state || "",
            City: row.city?.name || row.city || "",
            GSTNumber: row.gstNumber || "",
            PinCode: row.pinCode || "",
        }));

        const csv = Papa.unparse(csvData);

        // Download the CSV file
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "webinar_registrations.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };





    return (
        <Layout>
            <div className="p-5">
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Webinar Registrations
                        </h2>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            {/* Webinar Filter */}
                            <select
                                value={webinarFilter}
                                onChange={(e) => setWebinarFilter(e.target.value)}
                                className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">All Webinars</option>
                                {[...new Set(registrations.map(r => r.webinarId?.WebinarTitle))]
                                    .filter(Boolean)
                                    .map((title, i) => (
                                        <option key={i} value={title}>{title}</option>
                                    ))}
                            </select>

                            {/* Search Input */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search name, email, or type..."
                                    className="w-full p-2 pl-10 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                                </svg>
                            </div>

                            {/* Export Button */}
                            <button
                                onClick={handleExport}
                                className="w-full sm:w-auto px-4 py-2 font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 active:scale-95 transition"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
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



// import { useState } from "react";
// import api from "../../../utils/axios.js";
// import Swal from "sweetalert2";
// export default function WebinarRegistrationList() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };
//   const handleImport = async () => {
//     if (!file) {
//       Swal.fire("Error", "Please select a JSON file", "error");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     setLoading(true);
//     try {
//       const res = await api.post("/registrations/import", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       Swal.fire("Success", `${res.data.count} records imported successfully`, "success");
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", err.response?.data?.message || "Import failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div>
//       <h2>Import Webinar Registrations</h2>
//       <input type="file" accept=".json" onChange={handleFileChange} />
//       <button onClick={handleImport} disabled={loading}>
//         {loading ? "Importing..." : "Import JSON"}
//       </button>
//     </div>
//   );
// }