import React from "react";
import { useState, useEffect } from "react";
import caarchitaggarwal from "../../media/png/ca-archit-aggarwal.png";
import noImage from '../../media/png/no-image.png';
import Layout from "./partials/layout";
import axios from '../../utils/axios.js'
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
const ProfileForm = () => {
    const [functionalAreas, setFunctionalAreas] = useState([]);
    const [careerLevels, setCareerLevels] = useState([]);
    const [companyCategories, setCompanyCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ COMPLETE formData with all fields - FIXED INITIAL VALUES
    const [formData, setFormData] = useState({
        // Account Info
        firstName: "",
        middleName: "",
        nickName: "",
        email: "",
        password: "",

        // Personal Info
        gender: "",
        maritalStatus: "",
        dateOfBirth: "",
        phone: "",
        mobile: "",
        streetAddress: "",
        address: {
            country: "",
            state: "",
            city: "",
        },

        // Video Profile
        youTubeVideoLink: "",

        // Career Info
        jobExperience: "",
        careerLevel: "",
        industry: "",
        functionalArea: "",
        salaryCurrency: "",
        currentSalary: "",
        expectedSalary: "",

        // Newsletter
        subscribeToNewsletter: false,
        summary:""
    });

    // Fetch user and seeker info
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // 1️⃣ Fetch user
                const userRes = await axios.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // 2️⃣ Fetch Seeker info - FIXED ENDPOINT
                const seekerRes = await axios.get("/seeker/me", { // ✅ Changed from "/seeker/me"
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (seekerRes.data.success && seekerRes.data.data) {
                    const s = seekerRes.data.data;
                    setFormData((prev) => ({
                        ...prev,
                        firstName: userRes.data.firstName || "",
                        middleName: userRes.data.lastName || "", // ✅ Fixed field name
                        email: userRes.data.email || "",
                        nickName: s.nickName || "",
                        gender: s.gender || "",
                        maritalStatus: s.maritalStatus || "",
                        phone: s.phone || "",
                        mobile: s.mobile || "",
                        streetAddress: s.streetAddress || "",
                        youTubeVideoLink: s.youTubeVideoLink || "", // ✅ Fixed field name mapping
                        jobExperience: s.jobExperience || "",
                        careerLevel: s.careerLevel || "",
                        industry: s.industry || "",
                        functionalArea: s.functionalArea || "",
                        salaryCurrency: s.salaryCurrency || "",
                        currentSalary: s.currentSalary || "",
                        expectedSalary: s.expectedSalary || "",
                        subscribeToNewsletter: s.subscribetoNewsletter || false, // ✅ Fixed field name
                        dateOfBirth: s.dateofBirth ? s.dateofBirth.split("T")[0] : "", // ✅ Fixed field name
                        address: {
                            country: s.country || "",
                            state: s.state || "",
                            city: s.city || "",
                        },
                        summary: s.summary || "",
                    }));

                    if (s.profileImage) {
                        const cleanBase = baseURL.replace(/\/+$/, ""); // remove trailing slashes
                        const cleanPath = s.profileImage.replace(/^\/+/, ""); // remove leading slashes
                        setPreviewImage(`${cleanBase}/${cleanPath}`);
                    }

                } else {
                    // If no seeker data exists, still set user data
                    setFormData(prev => ({
                        ...prev,
                        firstName: userRes.data.firstName || "",
                        middleName: userRes.data.lastName || "",
                        email: userRes.data.email || "",
                    }));
                }
            } catch (err) {
                console.error("❌ Error fetching user/seeker data:", err);
                // Still try to set user data even if seeker fails
                try {
                    const token = localStorage.getItem("token");
                    const userRes = await axios.get("/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFormData(prev => ({
                        ...prev,
                        firstName: userRes.data.firstName || "",
                        middleName: userRes.data.lastName || "",
                        email: userRes.data.email || "",
                    }));
                } catch (userErr) {
                    console.error("❌ Error fetching user data:", userErr);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch company categories - FIXED ENDPOINT
        axios.get("/company-category/active/:id") //  Removed :id
            .then((res) => setCompanyCategories(res.data || []))
            .catch(err => console.error("Failed to fetch company categories:", err));

        // Fetch countries
        axios.get("/country")
            .then((res) => {
                console.log("Countries response:", res.data);
                setCountries(res.data.country || []);
            })
            .catch(err => console.error("Failed to fetch countries:", err));
    }, []);

    useEffect(() => {
        if (formData.address.country) {
            axios
                .get(`/state/country/${formData.address.country}`)
                .then((res) => {
                    console.log("States response:", res.data);
                    setStates(res.data.data || []);
                })
                .catch((err) => console.error("❌ Error fetching states:", err));
        } else {
            setStates([]);
        }
    }, [formData.address.country]);

    useEffect(() => {
        if (formData.address.state) {
            axios
                .get(`/city/state/${formData.address.state}`)
                .then((res) => {
                    console.log("Cities response:", res.data);
                    setCities(res.data.data || []);
                })
                .catch((err) => console.error("❌ Error fetching cities:", err));
        } else {
            setCities([]);
        }
    }, [formData.address.state]);

    useEffect(() => {
        const fetchFunctionalAreas = async () => {
            try {
                const { data } = await axios.get("/functionalArea-Category/active");
                setFunctionalAreas(data || []);
            } catch (err) {
                console.error("Failed to fetch functional areas:", err);
                setFunctionalAreas([]);
            }
        };
        fetchFunctionalAreas();
    }, []);

    useEffect(() => {
        const fetchCareerLevels = async () => {
            try {
                const { data } = await axios.get("/career-level-category/active");
                setCareerLevels(data || []);
            } catch (err) {
                console.error("Failed to fetch career levels:", err);
                setCareerLevels([]);
            }
        };
        fetchCareerLevels();
    }, []);

    // ✅ SINGLE handleChange function for all inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // For nested address fields
        if (["country", "state", "city"].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                    ...(name === "country" && { state: "", city: "" }),
                    ...(name === "state" && { city: "" }),
                },
            }));
        }
        // For checkbox inputs
        else if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        }
        // For all other inputs
        else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         const token = localStorage.getItem("token");
    //         const form = new FormData();

    //         // ✅ Map frontend field names to backend expected names
    //         form.append("firstName", formData.firstName);
    //         form.append("MiddletName", formData.middleName); //  Backend expects "MiddletName"
    //         form.append("nickName", formData.nickName);
    //         form.append("gender", formData.gender);
    //         form.append("maritalStatus", formData.maritalStatus);
    //         form.append("phone", formData.phone);
    //         form.append("mobile", formData.mobile);
    //         form.append("streetAddress", formData.streetAddress);
    //         form.append("youTubeVideoLink", formData.youTubeVideoLink); //  Backend expects "youTubeVideoLink"
    //         form.append("jobExperience", formData.jobExperience);
    //         form.append("careerLevel", formData.careerLevel);
    //         form.append("industry", formData.industry);
    //         form.append("functionalArea", formData.functionalArea);

    //         form.append('salaryCurrency', formData.salaryCurrency)
    //         form.append("currentSalary", formData.currentSalary);
    //         form.append("expectedSalary", formData.expectedSalary);
    //         form.append("subscribetoNewsletter", formData.subscribeToNewsletter); // ✅ Backend expects "subscribetoNewsletter"
    //         form.append("dateofBirth", formData.dateOfBirth); //  Backend expects "dateofBirth"

    //         // Address fields
    //         form.append("country", formData.address.country);
    //         form.append("state", formData.address.state);
    //         form.append("city", formData.address.city);

    //         if (imageFile) {
    //             form.append("profileImage", imageFile);
    //         }

    //         const res = await axios.post("/seeker/update", form, { // ✅ Fixed endpoint
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         });

    //          if (res.data.success) {
    //          // ✅ IMPORTANT: Update localStorage and trigger event for navbar
    //          const updatedUserData = res.data.data || res.data.user;
    //          if (updatedUserData) {
    //              // Update localStorage
    //              const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    //              const updatedUser = {
    //                  ...currentUser,
    //                  ...updatedUserData,
    //                  profilePicture: updatedUserData.profileImage || updatedUserData.profilePicture
    //              };
    //              localStorage.setItem("user", JSON.stringify(updatedUser));

    //              // Trigger custom event to notify navbar about update
    //              window.dispatchEvent(new Event("userUpdated"));
    //          }

    //          Swal.fire("Success", "Profile updated successfully", "success");
    //      }
    //     } catch (err) {
    //         console.error("❌ Update Error:", err);
    //         Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const token = localStorage.getItem("token");
        const form = new FormData();

        // ✅ Map frontend field names to backend expected names
        form.append("firstName", formData.firstName);
        form.append("middletName", formData.middleName); // ✅ Fixed spelling: MiddletName -> middletName
        form.append("nickName", formData.nickName);
        form.append("gender", formData.gender);
        form.append("maritalStatus", formData.maritalStatus);
        form.append("phone", formData.phone);
        form.append("mobile", formData.mobile);
        form.append("streetAddress", formData.streetAddress);
        form.append("youTubeVideoLink", formData.youTubeVideoLink); 
        form.append("jobExperience", formData.jobExperience);
        form.append("careerLevel", formData.careerLevel);
        form.append("industry", formData.industry);
        form.append("functionalArea", formData.functionalArea);
        form.append('salaryCurrency', formData.salaryCurrency);
        form.append("currentSalary", formData.currentSalary);
        form.append("expectedSalary", formData.expectedSalary);
        form.append("subscribetoNewsletter", formData.subscribeToNewsletter);
        form.append("dateofBirth", formData.dateOfBirth);
        form.append("country", formData.address.country);
        form.append("state", formData.address.state);
        form.append("city", formData.address.city);
        form.append("summary",formData.summary)

        if (imageFile) {
            form.append("profileImage", imageFile);
        }

        console.log("Submitting form data..."); // Debug log

        const res = await axios.post("/seeker/update", form, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        if (res.data.success) {
            console.log("Profile update successful:", res.data); // Debug log
            
            // ✅ IMPORTANT: Refresh seeker data after update
            const seekerRes = await axios.get("/seeker/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (seekerRes.data.success && seekerRes.data.data) {
                const updatedSeeker = seekerRes.data.data;
                console.log("Updated seeker data:", updatedSeeker); // Debug log
                
                // Update preview image immediately
                if (updatedSeeker.profileImage) {
                    const cleanBase = baseURL.replace(/\/+$/, "");
                    const cleanPath = updatedSeeker.profileImage.replace(/^\/+/, "");
                    const imageUrl = `${cleanBase}/${cleanPath}`;
                    console.log("Setting preview image:", imageUrl); // Debug log
                    setPreviewImage(imageUrl);
                }

                // Update localStorage with fresh data
                const userRes = await axios.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const updatedUser = {
                    ...userRes.data,
                    profilePicture: updatedSeeker.profileImage // Use profileImage from seeker
                };
                
                localStorage.setItem("user", JSON.stringify(updatedUser));
                console.log("Updated user in localStorage:", updatedUser); // Debug log
                
                // Trigger custom event with detailed data
                window.dispatchEvent(new CustomEvent("userUpdated", { 
                    detail: { 
                        user: updatedUser,
                        seeker: updatedSeeker 
                    } 
                }));
            }
            
            Swal.fire("Success", "Profile updated successfully", "success");
        }
    } catch (err) {
        console.error("❌ Update Error:", err);
        console.error("Error response:", err.response); // Detailed error log
        Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
        setLoading(false);
    }
};


    if (loading && !formData.email) {
        return (
            <Layout>
                <div className="w-full bg-[#f6f8fd] p-6 sm:p-10 rounded shadow text-sm sm:text-base text-center">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-4">Loading your profile...</p>
                    
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="w-full bg-[#f6f8fd] p-6 sm:p-10 rounded shadow text-sm sm:text-base">


                {/* Account Info */}
                <h2 className="text-xl sm:text-[32px] font-semibold mb-10 text-center">Account Information</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password || ""}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current"
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>
                </div>

                <hr className="border-2 border-black mb-6" />

                {/* Personal Info */}
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-6">
                    <div className="bg-white w-full sm:w-[400px]">
                        <label className="block font-medium mb-2 text-gray-700 text-center">Profile Image *</label>
                        <div className="w-full h-40 flex items-center justify-center rounded overflow-hidden mb-2">
                            <img
                                src={previewImage || noImage}
                                alt="Profile Preview"
                                className="object-cover border-2 h-full"
                            />
                        </div>
                        <div className="border-2 border-dashed border-gray-400 p-4 rounded text-center">
                            <input
                                type="file"
                                id="profileImage"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="profileImage" className="cursor-pointer text-blue-600 hover:underline">
                                + SELECT PROFILE IMAGE
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleChange}
                            placeholder="First Name *"
                            className="w-full border border-gray-300 rounded p-3"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName || ""}
                            onChange={handleChange}
                            placeholder="Middle Name"
                            className="w-full border border-gray-300 rounded p-3"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Nick Name *</label>
                        <input
                            type="text"
                            name="nickName"
                            value={formData.nickName || ""}
                            onChange={handleChange}
                            placeholder="Nick Name *"
                            className="w-full border border-gray-300 rounded p-3"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Gender *</label>
                        <select
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                        >
                            <option value="">Gender *</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Marital Status *</label>
                        <select
                            name="maritalStatus"
                            value={formData.maritalStatus || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                        >
                            <option value="">Marital Status *</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Country *</label>
                        <select
                            name="country"
                            value={formData.address.country || ""}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                        >
                            <option value="">-- Select Country --</option>
                            {countries.map((country) => (
                                <option key={country._id} value={country.id || country._id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">State *</label>
                        <select
                            name="state"
                            value={formData.address.state || ""}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                            disabled={!formData.address.country}
                        >
                            <option value="">-- Select State --</option>
                            {states.map((state) => (
                                <option key={state._id} value={state.id || state._id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">City *</label>
                        <select
                            name="city"
                            value={formData.address.city || ""}
                            onChange={handleChange}
                            className="p-3 w-full border rounded-md"
                            disabled={!formData.address.state}
                        >
                            <option value="">-- Select City --</option>
                            {cities.map((city) => (
                                <option key={city._id} value={city.id || city._id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Date of Birth *</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Phone *</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            placeholder="Phone *"
                            className="w-full border border-gray-300 rounded p-3"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mobile *</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile || ""}
                            onChange={handleChange}
                            placeholder="Mobile *"
                            className="w-full border border-gray-300 rounded p-3"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-1">Street Address *</label>
                    <textarea
                        name="streetAddress"
                        value={formData.streetAddress || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-3 h-[100px] sm:h-[150px]"
                        placeholder="Street Address *"
                    ></textarea>
                </div>

                <hr className="border-2 border-black mb-6" />

                {/* Video Profile */}
                <div className="pt-5">
                    <h2 className="text-xl font-semibold mb-4">Add Video Profile</h2>
                    <label className="block font-medium mb-1">YouTube Video Link</label>
                    <textarea
                        name="youTubeVideoLink"
                        value={formData.youTubeVideoLink || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-3 h-[100px] sm:h-[150px] mb-6"
                        placeholder="https://www.youtube.com/watch?v=d341k58FmuU"
                    ></textarea>
                </div>

                {/* Career Info */}
                <h2 className="text-xl font-semibold mb-4">Career Information</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Job Experience *</label>
                        <input
                            type="text"
                            name="jobExperience"
                            value={formData.jobExperience || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                            placeholder="Job Experience *"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Career Level *</label>
                        <select
                            name="careerLevel"
                            value={formData.careerLevel || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                        >
                            <option value="">Career Level *</option>
                            {careerLevels.map((career) => (
                                <option key={career._id} value={career._id}>
                                    {career.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Industry *</label>
                        <select
                            name="industry"
                            value={formData.industry || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                        >
                            <option value="">Industry *</option>
                            {companyCategories.map((company) => (
                                <option key={company._id} value={company._id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Functional Area *</label>
                        <select
                            name="functionalArea"
                            value={formData.functionalArea || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                        >
                            <option value="">Functional Area *</option>
                            {functionalAreas.map((area) => (
                                <option key={area._id} value={area._id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Salary Currency *</label>
                        <input
                            type="text"
                            name="salaryCurrency"
                            value={formData.salaryCurrency || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                            placeholder="Salary Currency *"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Current Salary *</label>
                        <input
                            type="text"
                            name="currentSalary"
                            value={formData.currentSalary || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                            placeholder="Current Salary *"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Expected Salary *</label>
                        <input
                            type="text"
                            name="expectedSalary"
                            value={formData.expectedSalary || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-3"
                            placeholder="Expected Salary *"
                        />
                    </div>
                </div>

                {/* Newsletter & Submit */}
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="newsletter"
                        name="subscribeToNewsletter"
                        checked={formData.subscribeToNewsletter || false}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="newsletter">Subscribe to Newsletter</label>
                </div>

                <div className="mb-6">
                    <label className="block text-2xl font-medium mb-1">Summary *</label>
                    <textarea
                        name="summary"
                        value={formData.summary || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-3 h-[100px] sm:h-[150px]"
                        placeholder="Summary *"
                    ></textarea>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 bg-[#00b6bd] hover:bg-[#239da1] disabled:bg-gray-400 text-white py-2 font-semibold rounded"
                    >
                        {loading ? "UPDATING..." : "UPDATE PROFILE AND SAVE"}
                    </button>
                </div>
            </form>
        </Layout>
    );
};

export default ProfileForm;