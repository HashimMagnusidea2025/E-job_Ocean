import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import noImage from '../../media/png/no-image.png';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../seekerDashboard/partials/layout';

export default function EditAccountDetails() {
    const [previewLogo, setPreviewLogo] = useState(null);
    const [users, setUsers] = useState(null);
    const [mapUrl, setMapUrl] = useState('');
    const [mapEmbedCode, setMapEmbedCode] = useState('');

    const [isCompanyCreated, setIsCompanyCreated] = useState(false);

    const [companyId, setCompanyId] = useState(null);
    const [companyCategories, setCompanyCategories] = useState([]);
    const [ownershipCategories, setOwnershipCategories] = useState([]);
    const [noofofficeCategories, setNoofofficeCategories] = useState([]);
    const [employeesCategories, setEmployeesCategories] = useState([]);
    const [establishedinCategory, setEstablishedinCategory] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [logoFile, setLogoFile] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        name: "",
        industry: "",
        ownershipType: "",
        description: "",
        officesCount: "",
        employeesCount: "",
        foundedYear: "",
        website: "",
        phone: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        pinterest: "",
        address: { country: "", state: "", city: "", companyAddress: "", companyLocation: "" },
        hrName: "",
        hrEmail: "",
        designation: "",
        registrationNumber: "",
        logo: "",
    });

    // Function to get full image URL
    const getFullImageUrl = (path) => {
        if (!path) return noImage;
        if (path.startsWith('http')) return path;
        // Replace with your actual backend base URL
        return `http://localhost:5000${path}`;
    };

    useEffect(() => {

        axios.get("/company-category/active/:id").then((res) => setCompanyCategories(res.data));
        axios.get("/ownership-category/active/:id").then((res) => setOwnershipCategories(res.data));
        axios.get("/no-of-office-category/active/:id").then((res) => setNoofofficeCategories(res.data));
        axios.get("/no-of-employees-category/active/:id").then((res) => setEmployeesCategories(res.data));
        axios.get("/established-in-category/active/:id").then((res) => setEstablishedinCategory(res.data));
        axios.get("/country").then((res) => setCountries(res.data.country));
    }, []);

    useEffect(() => {

        if (formData.address.country) {
            axios
                .get(`/state/country/${formData.address.country}`)
                .then((res) => setStates(res.data.data))
                .catch((err) => console.error("❌ Error fetching states:", err));
        } else {
            setStates([]);
        }
    }, [formData.address.country]);

    useEffect(() => {

        if (formData.address.state) {
            axios
                .get(`/city/state/${formData.address.state}`)
                .then((res) => setCities(res.data.data))
                .catch((err) => console.error("❌ Error fetching cities:", err));
        } else {
            setCities([]);
        }
    }, [formData.address.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                // First try to fetch company data (for admin-created companies)
                try {
                    const companyRes = await axios.get("/Company-Information/my-company", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log(companyRes.data.data);


                    if (companyRes.data && companyRes.data.data) {
                        const companyData = companyRes.data.data;
                        setCompanyId(companyData._id);
                        setUsers(companyData.user);
                        setIsCompanyCreated(true);

                        setFormData({
                            firstName: companyData.user?.firstName || "",
                            lastName: companyData.user?.lastName || "",
                            email: companyData.user?.email || "",
                            name: companyData.company?.name || "",
                            industry: companyData.company?.industry || "",
                            ownershipType: companyData.company?.ownershipType || "",
                            description: companyData.company?.description || "",
                            officesCount: companyData.company?.officesCount || "",
                            employeesCount: companyData.company?.employeesCount || "",
                            foundedYear: companyData.company?.foundedYear || "",
                            website: companyData.company?.website || "",
                            phone: companyData.company?.phone || "",
                            facebook: companyData.company?.socialLinks?.facebook || "",
                            twitter: companyData.company?.socialLinks?.twitter || "",
                            linkedin: companyData.company?.socialLinks?.linkedin || "",
                            pinterest: companyData.company?.socialLinks?.pinterest || "",
                            address: {
                                country: companyData.company?.address?.country?.toString() || "",
                                state: companyData.company?.address?.state?.toString() || "",
                                city: companyData.company?.address?.city?.toString() || "",
                                companyAddress: companyData.company?.address?.companyAddress || "",
                                companyLocation: companyData.company?.address?.companyLocation || "",
                            },
                            hrName: companyData.hrContact?.name || "",
                            hrEmail: companyData.hrContact?.email || "",
                            designation: companyData.hrContact?.designation || "",
                            registrationNumber: companyData.hrContact?.companyRegistrationNumber || "",
                            logo: companyData.company?.employerLogo || "",

                        });
                        // Generate map embed code if company location exists
                        if (companyData.company?.address?.companyLocation) {
                            generateMapEmbedCode(companyData.company.address.companyLocation);
                        }
                        return; // Exit if company data found
                    }
                } catch (companyErr) {
                    console.log("No company found, fetching user data instead");
                }

                // If no company found, fetch user data (for self-registered users)
                const userRes = await axios.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setFormData(prev => ({
                    ...prev,
                    firstName: userRes.data.firstName || "",
                    lastName: userRes.data.lastName || "",
                    email: userRes.data.email || "",
                    // Don't set company data for self-registered users as it doesn't exist yet
                    name: prev.name || "",
                    industry: prev.industry || "",
                    ownershipType: prev.ownershipType || "",
                    description: prev.description || "",
                    officesCount: prev.officesCount || "",
                    employeesCount: prev.employeesCount || "",
                    foundedYear: prev.foundedYear || "",
                    website: prev.website || "",
                    phone: prev.phone || "",
                    facebook: prev.facebook || "",
                    twitter: prev.twitter || "",
                    linkedin: prev.linkedin || "",
                    pinterest: prev.pinterest || "",
                    address: {
                        country: prev.address?.country || "",
                        state: prev.address?.state || "",
                        city: prev.address?.city || "",
                        companyAddress: prev.address?.companyAddress || "",
                        companyLocation: prev.address?.companyLocation || "",
                    },
                    hrName: prev.hrName || "",
                    hrEmail: prev.hrEmail || "",
                    designation: prev.designation || "",
                    registrationNumber: prev.registrationNumber || "",
                    logo: prev.employerLogo || "",
                }));

            } catch (err) {
                console.error("❌ Fetch Data Error:", err.response?.data || err.message);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field changed: ${name} = ${value}`);
        if (["country", "state", "city", "companyAddress", "companyLocation"].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                },
            }));

            // Regenerate map when location changes
            if (name === "companyLocation") {
                generateMapEmbedCode(value);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));

        console.log("👉 Current Password State:", {
            currentPassword: name === "currentPassword" ? value : passwords.currentPassword,
            newPassword: name === "newPassword" ? value : passwords.newPassword
        });
    };

    const handleLogoChange = (e) => {

        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));

        }
        setLogoFile(e.target.files[0]);
    };

    // Function to generate map embed code from location
    const generateMapEmbedCode = (location) => {
        if (!location) {
            setMapEmbedCode('');
            return;
        }

        const encodedLocation = encodeURIComponent(location);
        const embedCode = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.004085869492!2d73.75379047512966!3d20.00834322204287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb705d8d581d%3A0x15b55e47c4a7f07a!2sTreemiti%20Informatics!5e0!3m2!1sen!2sin!4v1756789749121!5m2!1sen!2sin`;
        setMapEmbedCode(embedCode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            // Create user object with password data if provided
            const user = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            };

            // Add password to user object if both current and new passwords are provided
            if (passwords.currentPassword && passwords.newPassword) {
                user.currentPassword = passwords.currentPassword;
                user.password = passwords.newPassword;
            }
            // Convert string IDs to appropriate types for backend
            const addressData = {
                ...formData.address,
                country: formData.address.country ? parseInt(formData.address.country) : null,
                state: formData.address.state ? parseInt(formData.address.state) : null,
                // city remains as string
            };

            const companyData = {
                name: formData.name,
                industry: formData.industry,
                ownershipType: formData.ownershipType,
                description: formData.description,
                officesCount: formData.officesCount,
                employeesCount: formData.employeesCount,
                foundedYear: formData.foundedYear,
                website: formData.website,
                phone: formData.phone,
                socialLinks: {
                    facebook: formData.facebook,
                    twitter: formData.twitter,
                    linkedin: formData.linkedin,
                    pinterest: formData.pinterest,
                },
                address: addressData,
            };

            const hrContact = {
                name: formData.hrName,
                email: formData.hrEmail,
                designation: formData.designation,
                companyRegistrationNumber: formData.registrationNumber,
            };

            const form = new FormData();

            // For self-registered users, we need to create a company first
            if (!companyId) {
                // Create a new company
                form.append("user", users?._id || "");
                form.append("userData", JSON.stringify(user));
                form.append("company", JSON.stringify(companyData));
                form.append("hrContact", JSON.stringify(hrContact));

                if (logoFile) {
                    form.append("employerLogo", logoFile);
                }

                const createRes = await axios.post("/Company-Information", form, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log(createRes);
                console.log(form);



                if (createRes.data && createRes.data.data) {
                    setCompanyId(createRes.data.data._id);
                    // Reset logo file state after successful upload
                    setLogoFile(null);
                    setPreviewLogo(null);
                    setIsCompanyCreated(true);

                    Swal.fire("Success", "Company profile created successfully", "success");
                }
            } else {
                // Update existing company
                form.append("user", users?._id || "");
                form.append("userData", JSON.stringify(user));
                form.append("company", JSON.stringify(companyData));
                form.append("hrContact", JSON.stringify(hrContact));

                // Only append logo if a new file was selected
                if (logoFile) {
                    form.append("employerLogo", logoFile);
                } else {
                    // If no new logo file, include the existing logo path to prevent it from being cleared
                    form.append("existingLogo", formData.logo || "");
                }
                const res = await axios.put(`/Company-Information/my-company/update/${companyId}`, form, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log(res);

                const updatedCompanyData = res.data.data;
                setFormData(prev => ({
                    ...prev,
                    logo: updatedCompanyData.company?.employerLogo || prev.logo
                }));
                // Reset logo file state after successful update
                setLogoFile(null);
                setPreviewLogo(null);

                // Trigger logo update event for Navbar
                window.dispatchEvent(new Event('logoUpdated'));
                Swal.fire("Success", "Company profile updated successfully", "success");
            }

            // Reset password fields after successful submission
            setPasswords({
                currentPassword: "",
                newPassword: ""
            });

        } catch (err) {
            console.error("❌ Update Error:", err.response?.data || err.message);
            Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        }
    };

    const handlePasswordSubmit = () => {
        console.log("🔑 Password Modal Values:", passwords);
        setIsPasswordModalOpen(false);
    };
    // Function to generate map URL based on company location
    const generateMapUrl = (location) => {
        if (!location) return '';
        const encodedLocation = encodeURIComponent(location);
        return `https://maps.google.com/maps?q=${encodedLocation}&output=embed`;
    };
    // Update map URL when companyLocation changes
    useEffect(() => {
        setMapUrl(generateMapUrl(formData.address.companyLocation));
    }, [formData.address.companyLocation]);

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="font-[Poppins] w-full mx-auto bg-gray-100 p-5 rounded-lg shadow-md space-y-6">
                <div>
                    <h1 className='text-[20px] text-center md:text-[35px] font-semibold'>{companyId ? 'Update Profile' : 'Create Company Profile'}</h1>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleChange}
                            className="input p-3 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleChange}
                            className="input p-3 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className="input p-3 w-full"
                        />
                    </div>

                    {/* Password */}
                    <div className="mt-6 border-t pt-6 col-span-full ">
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                            >
                                Update Password
                            </button>
                        </div>
                        {isPasswordModalOpen && (
                            <div
                                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                onClick={() => setIsPasswordModalOpen(false)}
                            >
                                <div
                                    className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h2 className="text-lg font-semibold mb-4">Update Password</h2>
                                    <div className='grid gap-4'>

                                        <div>
                                            <label className=" text-sm">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwords.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="input p-3 w-full bg-gray-100 border"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className=" text-sm">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwords.newPassword}
                                                onChange={handlePasswordChange}
                                                className="input p-3 w-full bg-gray-100 border"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsPasswordModalOpen(false)}
                                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePasswordSubmit}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Save Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Logo Upload */}
                <div className='flex flex-col items-center mt-4'>
                    <label className="text-sm font-medium mb-2">Logo</label>
                    <img
                        src={previewLogo || getFullImageUrl(formData.logo) || noImage}
                        alt="Logo Preview"
                        className="w-32 h-32 object-contain border mb-2"
                    />
                    <input
                        type="file"
                        name="employerLogo"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={handleLogoChange}
                    />
                    <label htmlFor="logo-upload" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                        {previewLogo ? 'Change Logo' : 'Upload Logo'}
                    </label>
                </div>

                {/* Company Info */}
                <h2 className="text-lg font-semibold">Company Information</h2>
                <div className='grid'>
                    <label>Company Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input p-3 w-full"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Company Category</label>
                        <select
                            name="industry"
                            className="p-3 w-full border rounded-md"
                            value={formData.industry}
                            onChange={handleChange}
                        >
                            {companyCategories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Ownership Type</label>
                        <select
                            name="ownershipType"
                            value={formData.ownershipType}
                            onChange={handleChange}
                            className="p-2 border w-full rounded"
                        >
                            <option value="">-- Select Ownership --</option>
                            {ownershipCategories.map((own) => (
                                <option key={own._id} value={own.name}>
                                    {own.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='grid'>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="p-3 w-full border rounded-md"
                        rows="3"
                    />
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">No. of Offices</label>
                        <select
                            name="officesCount"
                            value={formData.officesCount}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                        >
                            <option value="">-- Select Offices --</option>
                            {noofofficeCategories.map((own) => (
                                <option key={own._id} value={own.name}>
                                    {own.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Employees</label>
                        <select
                            name="employeesCount"
                            value={formData.employeesCount}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                        >
                            <option value="">-- Select Employees --</option>
                            {employeesCategories.map((own) => (
                                <option key={own._id} value={own.name}>
                                    {own.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Established In</label>
                        <select
                            name="foundedYear"
                            value={formData.foundedYear}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                        >
                            <option value="">-- Select Year --</option>
                            {establishedinCategory.map((own) => (
                                <option key={own._id} value={own.name}>
                                    {own.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Website & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label>Website</label>
                        <input
                            type='url'
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {["facebook", "twitter", "linkedin", "pinterest"].map((platform) => (
                        <div key={platform}>
                            <label className="block text-sm font-medium mb-1">
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </label>
                            <input
                                type='url'
                                name={platform}
                                value={formData[platform]}
                                onChange={handleChange}
                                className="p-3 w-full border rounded-md"
                            />
                        </div>
                    ))}
                </div>

                {/* Address */}
                <section className="border-t pt-6">
                    <h2 className="text-lg font-semibold mb-4">Company Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <select
                                name="country"
                                value={formData.address.country}
                                onChange={handleChange}
                                className="p-3 w-full border rounded-md"
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
                            <label className="block text-sm font-medium mb-1">State</label>
                            <select
                                name="state"
                                value={formData.address.state}
                                onChange={handleChange}
                                className="p-3 w-full border rounded-md"
                                disabled={!formData.address.country}
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
                            <label className="block text-sm font-medium mb-1">City</label>
                            <select
                                name="city"
                                value={formData.address.city}
                                onChange={handleChange}
                                className="p-3 w-full border rounded-md"
                                disabled={!formData.address.state}
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
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">Street Address</label>
                        <textarea
                            name="companyAddress"
                            value={formData.address.companyAddress}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">Company Location</label>
                        <textarea
                            name="companyLocation"
                            value={formData.address.companyLocation}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md h-[140px]"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Location Preview</label>
                        <div className="border rounded-md overflow-hidden">
                            {mapEmbedCode ? (
                                <iframe
                                    src={mapEmbedCode}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Company Location Map"
                                ></iframe>
                            ) : (
                                <div className="h-64 bg-gray-100 flex items-center justify-center">
                                    <p className="text-gray-500">Enter company location to see map preview</p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Preview of your company location. Make sure the address above is accurate.
                        </p>
                    </div>
                </section>

                {/* HR Info */}
                <h2 className="text-lg font-semibold mt-6">HR Person Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label>HR Name</label>
                        <input
                            type="text"
                            name="hrName"
                            value={formData.hrName}
                            onChange={handleChange}
                            className="input p-3 w-full border rounded"
                        />
                    </div>
                    <div>
                        <label>HR Email</label>
                        <input
                            type="email"
                            name="hrEmail"
                            value={formData.hrEmail}
                            onChange={handleChange}
                            className="input p-3 w-full border rounded"
                        />
                    </div>
                    <div>
                        <label>Designation</label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="input p-3 w-full border rounded"
                        />
                    </div>
                    <div>
                        <label>Company Registration Number</label>
                        <input
                            type="number"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            className="input p-3 w-full border rounded"
                        />
                    </div>
                </div>

                <div className="text-center mt-6">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded">
                        {companyId ? 'UPDATE PROFILE AND SAVE' : 'CREATE COMPANY PROFILE'}
                    </button>
                </div>
            </form>
        </Layout>
    );
}