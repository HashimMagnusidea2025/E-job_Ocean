import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
const Speakerpage = () => {
    const [speakers, setSpeakers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");

    const [loading, setLoading] = useState({
        countries: false,
        states: false,
        cities: false
    });
    const [formData, setFormData] = useState({
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        introduction: "",
        description: "",
        qualification: "",
        profilePic: null, // file object
    });
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [viewData, setViewData] = useState(null);




    //  useEffect(() => {

    //     axios.get("/country").then((res) => setCountries(res.data.country));
    // }, []);


    // // dependent dropdowns
    // useEffect(() => {
    //     if (formData.country) {
    //         axios.get(`/state/country/${formData.country}`).then((res) => setStates(res.data.data));
    //     } else setStates([]);
    // }, [formData.country]);

    // useEffect(() => {
    //     if (formData.state) {
    //         axios.get(`/city/state/${formData.state}`).then((res) => setCities(res.data.data));
    //     } else setCities([]);
    // }, [formData.state]);



    // ✅ Load Countries
    useEffect(() => {
        const loadCountries = async () => {
            setLoading(prev => ({ ...prev, countries: true }));
            try {
                const response = await axios.get("/country");
                setCountries(response.data.country || []);
            } catch (error) {
                console.error("Failed to fetch countries:", error);
                alert("Failed to load countries");
            } finally {
                setLoading(prev => ({ ...prev, countries: false }));
            }
        };
        loadCountries();
    }, []);

    // ✅ Load States when country changes
    useEffect(() => {
        const loadStates = async () => {
            if (!formData.country) {
                setStates([]);
                setFormData(prev => ({ ...prev, state: "", city: "" }));
                return;
            }

            setLoading(prev => ({ ...prev, states: true }));
            try {
                const response = await axios.get(`/state/country/${formData.country}`);
                setStates(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch states:", error);
                setStates([]);
            } finally {
                setLoading(prev => ({ ...prev, states: false }));
            }
        };

        loadStates();
    }, [formData.country]);

    // ✅ Load Cities when state changes
    useEffect(() => {
        const loadCities = async () => {
            if (!formData.state) {
                setCities([]);
                setFormData(prev => ({ ...prev, city: "" }));
                return;
            }

            setLoading(prev => ({ ...prev, cities: true }));
            try {
                const response = await axios.get(`/city/state/${formData.state}`);
                setCities(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
                setCities([]);
            } finally {
                setLoading(prev => ({ ...prev, cities: false }));
            }
        };

        loadCities();
    }, [formData.state]);

    // ✅ Delete Speaker
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this speaker?")) return;

        try {
            await axios.delete(`/speakers/${id}`);
            alert("Speaker deleted successfully");
            fetchSpeakers(); // refresh list
        } catch (err) {
            console.error(err);
            alert("Error deleting speaker");
        }
    };
    // ✅ Open Update Modal
    const handleEdit = async (speaker) => {
        setEditId(speaker._id);
        setFormData({
            salutation: speaker.salutation || "",
            firstName: speaker.firstName || "",
            lastName: speaker.lastName || "",
            email: speaker.email || "",
            phone: speaker.phone || "",
            country: speaker.country || "",
            state: speaker.state || "",
            city: speaker.city || "",
            introduction: speaker.introduction || "",
            description: speaker.description || "",
            qualification: speaker.qualification || "",
            status: speaker.status || "active",
            profilePic: null,
        });
        // Set preview image to existing profile pic
        setPreviewImage(getProfilePic(speaker.profilePic));
        // Load states and cities for the speaker's location
        if (speaker.country) {
            try {
                const statesRes = await axios.get(`/state/country/${speaker.country}`);
                setStates(statesRes.data.data || []);

                if (speaker.state) {
                    const citiesRes = await axios.get(`/city/state/${speaker.state}`);
                    setCities(citiesRes.data.data || []);
                }
            } catch (error) {
                console.error("Error loading location data:", error);
            }
        }

        setOpen(true);
    };





    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePic: e.target.files[0] });
    };


    // ✅ Fix location change handler
    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            // Reset dependent fields when parent changes
            ...(field === 'country' && { state: "", city: "" }),
            ...(field === 'state' && { city: "" })
        }));
    };

    const handleView = async (speaker) => {
        setViewData(speaker);

        // Load location data for view modal
        try {
            if (speaker.country) {
                const statesRes = await axios.get(`/state/country/${speaker.country}`);
                setStates(statesRes.data.data || []);

                if (speaker.state) {
                    const citiesRes = await axios.get(`/city/state/${speaker.state}`);
                    setCities(citiesRes.data.data || []);
                }
            }
        } catch (error) {
            console.error("Error loading location data for view:", error);
        }
    };

    // Fetch Speakers
    useEffect(() => {
        fetchSpeakers();
    }, []);

    const fetchSpeakers = async () => {
        const res = await axios.get("/speakers");
        setSpeakers(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) data.append(key, formData[key]);
        });

        try {
            if (editId) {
                await axios.put(`/speakers/${editId}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Speaker updated successfully");
            } else {
                await axios.post("/speakers", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Speaker created successfully");
            }
            setOpen(false);
            setEditId(null);
            fetchSpeakers();
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Error creating/updating speaker");
        }
    };


    const handleToggleStatus = async (id) => {
        try {
            const speaker = speakers.find((s) => s._id === id);
            const newStatus = speaker.status === "active" ? "inactive" : "active";

            await axios.put(`/speakers/${id}`, { status: newStatus });

            setSpeakers((prev) =>
                prev.map((s) =>
                    s._id === id ? { ...s, status: newStatus } : s
                )
            );
        } catch (err) {
            console.error(err);
            alert("Error updating status");
        }
    };
    // const columns = [
    //     {
    //   name: "ID",
    //   cell: (row, index) => index + 1,
    //   width: "80px",
    // },
    //     {
    //         name: "Full Name",
    //         selector: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
    //         sortable: true,
    //     },
    //     ,
    //     { name: "Email", selector: (row) => row.email },
    //     { name: "Introduction", selector: (row) => row.introduction?.name || row.introduction },
    //     { name: "Qualification", selector: (row) => row.qualification?.name || row.qualification },
    //     {
    //         name: "Status",
    //         cell: (row) => (
    //             <div className="flex items-center gap-2">
    //                 <span
    //                     className={`px-2 py-1 text-xs rounded text-white ${row.status === "active" ? "bg-green-500" : "bg-red-500"
    //                         }`}
    //                 >
    //                     {row.status}
    //                 </span>
    //                 <button onClick={() => handleToggleStatus(row._id)}>
    //                     {row.status === "active" ? (
    //                         <FaToggleOn size={22} className="text-green-500" />
    //                     ) : (
    //                         <FaToggleOff size={22} className="text-red-500" />
    //                     )}
    //                 </button>
    //             </div>
    //         ),
    //     },
    //     {
    //         name: "Actions",
    //         cell: (row) => (
    //             <div className="flex gap-3">
    //                 {/* View */}
    //                 <button
    //                     className="text-blue-500 hover:text-blue-700"
    //                     onClick={() => handleView(row)}
    //                 >
    //                     <FaEye size={20} />
    //                 </button>

    //                 {/* Edit */}
    //                 <button
    //                     className="text-green-500 hover:text-green-700"
    //                     onClick={() => handleEdit(row)}
    //                 >
    //                     <FaEdit size={20} />
    //                 </button>

    //                 {/* Delete */}
    //                 <button
    //                     className="text-red-500 hover:text-red-700"
    //                     onClick={() => handleDelete(row._id)}
    //                 >
    //                     <FaTrash size={20} />
    //                 </button>
    //             </div>
    //         ),
    //     },
    // ];

    const columns = [
        {
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Full Name",
            accessorFn: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Introduction",
            accessorKey: "introduction",
        },
        {
            header: "Qualification",
            accessorKey: "qualification",
        },
        {
            header: "Status",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-1 text-xs rounded text-white ${row.original.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                    >
                        {row.original.status}
                    </span>

                    <button onClick={() => handleToggleStatus(row.original._id)}>
                        {row.original.status === "active" ? (
                            <FaToggleOn size={22} className="text-green-500" />
                        ) : (
                            <FaToggleOff size={22} className="text-red-500" />
                        )}
                    </button>
                </div>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <FaEye
                        size={20}
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleView(row.original)}
                    />
                    <FaEdit
                        size={20}
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleEdit(row.original)}
                    />
                    <FaTrash
                        size={20}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(row.original._id)}
                    />
                </div>
            ),
        },
    ];
    const table = useReactTable({
        data: speakers,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    const getLocationString = () => {
        if (!viewData) return "Location not specified";

        const countryName = countries.find(c => String(c.id) === String(viewData.country))?.name || '';
        const stateName = states.find(s => String(s.id) === String(viewData.state))?.name || '';
        const cityName = cities.find(c => String(c.id) === String(viewData.city))?.name || '';

        const locationParts = [cityName, stateName, countryName];
        return locationParts.filter(Boolean).join(', ') || "Location not specified";
    };

    const getProfilePic = (pic) => {
        if (!pic || pic === "null") return "/default-profile.png";

        // Ensure uploads folder is included in the path
        return `${baseURL}/${pic.startsWith("uploads/") ? pic : "uploads" + pic}`;
    };



    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Speakers</h2>
                    <button
                        onClick={() => setOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        + Add Speaker
                    </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search speakers..."
                        className="border px-3 py-2 rounded w-64"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow rounded">
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="p-3 border text-left">
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
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3 border">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded"
                    >
                        Previous
                    </button>

                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded"
                    >
                        Next
                    </button>
                </div>


                {/* ✅ View Modal */}

                {viewData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6">

                            {/* Profile Picture */}
                            <div className="flex-shrink-0 flex justify-center md:justify-start">
                                <img
                                    src={getProfilePic(viewData.profilePic)}
                                    alt="Profile"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                {/* Header */}
                                <div className="flex justify-between items-center border-b pb-3 mb-4">
                                    <h3 className="text-2xl font-semibold text-gray-800">Speaker Details</h3>
                                    <button
                                        onClick={() => setViewData(null)}
                                        className="text-gray-400 hover:text-gray-700 text-xl font-bold transition-transform duration-200 hover:scale-125"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                    <p><span className="font-semibold">Name:</span> {viewData.firstName} {viewData.lastName}</p>
                                    <p><span className="font-semibold">Email:</span> {viewData.email}</p>
                                    <p><span className="font-semibold">Phone:</span> {viewData.phone}</p>
                                    <p className="md:col-span-2">
                                        <span className="font-semibold">Location:</span> {getLocationString()}
                                    </p>
                                    <p><span className="font-semibold">Qualification:</span> {viewData.qualification}</p>
                                    <p><span className="font-semibold">Status:</span> {viewData.status}</p>
                                    <p className="md:col-span-2"><span className="font-semibold">Introduction:</span> {viewData.introduction}</p>
                                    <p className="md:col-span-2"><span className="font-semibold">Description:</span> {viewData.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Modal Form */}
                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">

                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-3 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">{editId ? "Update Speaker" : "Add Speaker"}</h3>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Salutation + Names */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Salutation</label>
                                        <select
                                            value={formData.salutation}
                                            onChange={(e) =>
                                                setFormData({ ...formData, salutation: e.target.value })
                                            }
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        >
                                            <option value="">-- Select --</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Ms.">Ms.</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter First Name"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            value={formData.firstName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, firstName: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Last Name"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            value={formData.lastName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, lastName: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Email + Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter Email"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter Phone Number"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Country / State / City */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Country {loading.countries && "(Loading...)"}
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={(e) => handleLocationChange('country', e.target.value)}
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            disabled={loading.countries}
                                        >
                                            <option value="">-- Select Country --</option>
                                            {countries.map((country) => (
                                                <option key={country._id} value={country.id}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            State {loading.states && "(Loading...)"}
                                        </label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={(e) => handleLocationChange('state', e.target.value)}
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            disabled={!formData.country || loading.states}
                                        >
                                            <option value="">-- Select State --</option>
                                            {states.map((state) => (
                                                <option key={state._id} value={state.id}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            City {loading.cities && "(Loading...)"}
                                        </label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={(e) => handleLocationChange('city', e.target.value)}
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            disabled={!formData.state || loading.cities}
                                        >
                                            <option value="">-- Select City --</option>
                                            {cities.map((city) => (
                                                <option key={city._id} value={city.id}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Introduction + Description */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Introduction</label>
                                        <textarea
                                            placeholder="Write a short introduction..."
                                            className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            value={formData.introduction}
                                            onChange={(e) =>
                                                setFormData({ ...formData, introduction: e.target.value })
                                            }
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            placeholder="Write detailed description..."
                                            className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Profile Pic + Qualification */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Profile Picture</label>
                                        <input
                                            type="file"
                                            className="w-full border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 
                                            file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) => {
                                                setFormData({ ...formData, profilePic: e.target.files[0] });
                                                if (e.target.files[0]) {
                                                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                                                }
                                            }}
                                        />

                                        {/* Preview */}
                                        {previewImage && (
                                            <img
                                                src={previewImage}
                                                alt="Profile Preview"
                                                className="mt-2 w-32 h-32 rounded-full object-cover border"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Qualification</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Qualification"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            value={formData.qualification}
                                            onChange={(e) =>
                                                setFormData({ ...formData, qualification: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
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

export default Speakerpage;
