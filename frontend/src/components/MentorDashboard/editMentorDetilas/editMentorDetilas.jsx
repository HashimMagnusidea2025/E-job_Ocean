import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";


const baseUrl = import.meta.env.VITE_BACKEND_URL
export default function EditMentorDetails() {
    const [mentor, setMentor] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        newPassword: "",
        profilePicture: "",
        des: ""
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch logged-in mentor details
    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                if (!loggedInUser?._id) {
                    Swal.fire("Error", "No user found in localStorage", "error");
                    return;
                }

                const res = await axios.get(`/users/${loggedInUser._id}`);
                console.log(res.data);

                if (res.data) {
                    setMentor({
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        email: res.data.email,
                        des: res.data.des,
                        profilePicture: res.data.profilePicture || "",
                        password: "",
                        newPassword: "",
                    });
                    // ✅ Robust preview URL
                    const pic = res.data.profilePicture;
                    if (pic) {
                        setPreview(pic.startsWith("http") ? pic : `${baseUrl}${pic}`);
                    } else {
                        setPreview(null); // do nothing, leave empty
                    }

                }
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load mentor details", "error");
            }
        };
        fetchMentor();
    }, []);

    // ✅ Handle image preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setMentor((prev) => ({ ...prev, profilePicture: file }));
        }
    };

    // ✅ Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMentor((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("user"));
            const formData = new FormData();

            formData.append("firstName", mentor.firstName);
            formData.append("lastName", mentor.lastName);
            formData.append("email", mentor.email);
            formData.append("des", mentor.des);
            if (mentor.password) formData.append("password", mentor.password);
            if (mentor.newPassword) formData.append("newPassword", mentor.newPassword);
            if (mentor.profilePicture instanceof File)
                formData.append("profilePicture", mentor.profilePicture);

            const res = await axios.put(`/users/${loggedInUser._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {

                // ✅ Update localStorage
                // ✅ FIXED: Update localStorage with complete user data
                const updatedUser = {
                    ...loggedInUser,
                    firstName: res.data.firstName || mentor.firstName,
                    lastName: res.data.lastName || mentor.lastName,
                    email: res.data.email || mentor.email,
                    des: res.data.des || mentor.des,
                    profilePicture: res.data.profilePicture || loggedInUser.profilePicture
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));

                // ✅ Trigger navbar update event
                window.dispatchEvent(new Event("userUpdated"));

                Swal.fire("Updated!", "Your details were updated successfully", "success");

                // ✅ Update preview with new profile picture URL
                if (res.data.profilePicture) {
                    if (res.data.profilePicture.startsWith('http')) {
                        setPreview(res.data.profilePicture);
                    } else {
                        setPreview(`${baseUrl}${res.data.profilePicture}`);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Edit Your Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* ✅ Profile Picture */}
                    <div className="flex items-center justify-center">


                        {/* <div className="relative">
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full object-cover border"
                                />
                            )}
                           <h2 className="border">
                             Add Profile picture
                           </h2>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute bottom-0 right-0 opacity-0 w-28 h-28 cursor-pointer"
                                title="Change profile picture"
                            />
                        </div> */}

                        <div className="relative flex flex-col items-center">
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full object-cover border mb-2"
                                />
                            )}

                            <label
                                htmlFor="profile-upload"
                                className="border px-4 py-2 rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition"
                            >
                                Add Profile Picture
                            </label>

                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                    </div>

                    {/* ✅ Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            value={mentor.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="border rounded-lg p-3 w-full"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={mentor.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="border rounded-lg p-3 w-full"
                            required
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        value={mentor.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border rounded-lg p-3 w-full"
                        required
                    />
                    <textarea
                        type="text"
                        name="des"
                        value={mentor.des}
                        onChange={handleChange}
                        placeholder="Description"
                        className="border rounded-lg p-3 w-full"
                        required
                    />

                    {/* ✅ Password Change - Optional */}
                    <details className="border rounded-lg p-3">
                        <summary className="cursor-pointer font-medium">
                            Change Password (Optional)
                        </summary>
                        <div className="mt-3 space-y-3">
                            <input
                                type="password"
                                name="password"
                                value={mentor.password}
                                onChange={handleChange}
                                placeholder="Current Password"
                                className="border rounded-lg p-3 w-full"
                            />
                            <input
                                type="password"
                                name="newPassword"
                                value={mentor.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                className="border rounded-lg p-3 w-full"
                            />
                        </div>
                    </details>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 transition"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </Layout>
    );
}
