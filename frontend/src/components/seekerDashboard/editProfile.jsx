import React from "react";
import caarchitaggarwal from "../../media/png/ca-archit-aggarwal.png";
import Layout from "./partials/layout";

const ProfileForm = () => {
    return (
        <>
            <Layout>
                <div className="w-full bg-[#f6f8fd] p-6 sm:p-10 rounded shadow text-sm sm:text-base">
                    {/* Account Info */}
                    <h2 className="text-xl sm:text-[32px] font-semibold mb-10 text-center">Account Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Password</label>
                            <input type="password" placeholder="Password" className="w-full border border-gray-300 rounded p-2" />
                        </div>
                    </div>

                    <hr className="border-2 border-black mb-6" />

                    {/* Personal Info */}
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-6">
                        <div className="bg-white w-full sm:w-[400px]">
                            <label className="block font-medium mb-2 text-gray-700 text-center">Profile Image *</label>
                            <div className="w-full h-40 flex items-center justify-center rounded overflow-hidden mb-2">
                                <img src={caarchitaggarwal} alt="Profile Preview" className="object-cover border-2 h-full" />
                            </div>
                            <div className="border-2 border-dashed border-gray-400 p-4 rounded text-center">
                                <input type="file" id="profileImage" className="hidden" accept="image/*" />
                                <label htmlFor="profileImage" className="cursor-pointer text-blue-600 hover:underline">
                                    + SELECT PROFILE IMAGE
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">First Name *</label>
                            <input type="text" placeholder="First Name *" className="w-full border border-gray-300 rounded p-3" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Middle Name</label>
                            <input type="text" placeholder="Middle Name" className="w-full border border-gray-300 rounded p-3" />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Nick Name *</label>
                            <input type="text" placeholder="Nick Name *" className="w-full border border-gray-300 rounded p-3" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Gender *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>Gender *</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Marital Status *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>Marital Status *</option>
                                <option>Single</option>
                                <option>Married</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Country *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>Country *</option>
                                <option>India</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">State *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>State *</option>
                                <option>Bihar</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">City *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>City *</option>
                                <option>Bagaha</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Nationality *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>Nationality *</option>
                                <option>American</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Date of Birth *</label>
                            <input type="date" className="w-full border border-gray-300 rounded p-3" />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Phone *</label>
                            <input type="text" placeholder="Phone *" className="w-full border border-gray-300 rounded p-3" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Mobile *</label>
                            <input type="text" placeholder="Mobile *" className="w-full border border-gray-300 rounded p-3" />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-medium mb-1">Street Address *</label>
                        <textarea className="w-full border border-gray-300 rounded p-3 h-[100px] sm:h-[150px]" placeholder="Street Address *"></textarea>
                    </div>

                    <hr className="border-2 border-black mb-6" />

                    {/* Video Profile */}
                    <div className="pt-5">
                        <h2 className="text-xl font-semibold mb-4">Add Video Profile</h2>
                        <label className="block font-medium mb-1">YouTube Video Link</label>
                        <textarea className="w-full border border-gray-300 rounded p-3 h-[100px] sm:h-[150px] mb-6" placeholder="https://www.youtube.com/watch?v=d341k58FmuU"></textarea>
                    </div>

                    {/* Career Info */}
                    <h2 className="text-xl font-semibold mb-4">Career Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Job Experience *</label>
                            <input type="text" className="w-full border border-gray-300 rounded p-3" placeholder="Job Experience *" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Career Level *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>Career Level *</option>
                                <option>Experienced Professional</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Industry *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>Industry *</option>
                                <option>Advertising/PR</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Functional Area *</label>
                            <select className="w-full border border-gray-300 rounded p-3">
                                <option>Functional Area *</option>
                                <option>Engineering and IT</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Salary Currency *</label>
                            <input type="text" className="w-full border border-gray-300 rounded p-3" placeholder="Salary Currency *" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Current Salary *</label>
                            <input type="text" className="w-full border border-gray-300 rounded p-3" placeholder="Current Salary *" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Expected Salary *</label>
                            <input type="text" className="w-full border border-gray-300 rounded p-3" placeholder="Expected Salary *" />
                        </div>
                    </div>

                    {/* Newsletter & Submit */}
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="newsletter" className="mr-2" />
                        <label htmlFor="newsletter">Subscribe to Newsletter</label>
                    </div>
                    <div className="text-center">
                        <button className="px-4 bg-[#00b6bd] hover:bg-[#239da1] text-white py-2 font-semibold rounded">
                            UPDATE PROFILE AND SAVE
                        </button>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default ProfileForm;