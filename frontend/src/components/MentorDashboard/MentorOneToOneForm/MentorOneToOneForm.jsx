import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx"; // Mentor dashboard layout
import { FaPlus, FaMinus } from "react-icons/fa";

export default function MentorOneToOneForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get("editId");

    const [forms, setForms] = useState([
        {
            selectDays: [],
            selectDate: "",
            courseTitle: "",
            courseDescription: "",
            fees: "",
            courseType: "",
            paymentType: "",
            includingGST: false,
            startTime: "",
            endTime: "",
            status: "active",
        },
    ]);

    const [errors, setErrors] = useState([{}]);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedForms = [...forms];
        updatedForms[index][name] = type === "checkbox" ? checked : value;
        setForms(updatedForms);

        if (errors[index] && errors[index][name]) {
            const updatedErrors = [...errors];
            delete updatedErrors[index][name];
            setErrors(updatedErrors);
        }
    };

    const addForm = () => {
        setForms([
            ...forms,
            {
                selectDays: [],
                selectDate: "",
                courseTitle: "",
                courseDescription: "",
                fees: "",
                courseType: "",
                paymentType: "",
                includingGST: false,
                startTime: "",
                endTime: "",
                status: "active",
            },
        ]);
        setErrors([...errors, {}]);
    };

    const removeForm = (index) => {
        const updatedForms = forms.filter((_, i) => i !== index);
        const updatedErrors = errors.filter((_, i) => i !== index);
        setForms(updatedForms);
        setErrors(updatedErrors);
    };

    // Fetch session data if editing
    useEffect(() => {
        if (editId) {
            const fetchSession = async () => {
                try {
                    const { data } = await axios.get(`/one-to-one/${editId}`);
                    if (data) {
                        setForms([{
                            selectDays: data.selectDays || [],
                            selectDate: data.selectDate || "",
                            courseTitle: data.courseTitle || "",
                            courseDescription: data.courseDescription || "",
                            fees: data.fees || "",
                            courseType: data.courseType || "",
                            paymentType: data.paymentType || "",
                            includingGST: data.includingGST || false,
                            startTime: data.startTime || "",
                            endTime: data.endTime || "",
                            status: data.status || "active",
                        }]);
                    }
                } catch (err) {
                    console.error("Error fetching session data:", err);
                }
            };
            fetchSession();
        }
    }, [editId]);

    const validateForm = () => {
        const newErrors = forms.map((form, index) => {
            const formErrors = {};

            if (form.selectDays.length === 0) formErrors.selectDays = "At least one day must be selected";
            if (!form.selectDate) formErrors.selectDate = "Date is required";
            if (!form.courseTitle.trim()) formErrors.courseTitle = "Course title is required";
            if (!form.courseDescription.trim()) formErrors.courseDescription = "Course description is required";
            if (!form.fees && form.paymentType === "Paid") formErrors.fees = "Fees is required for paid sessions";
            if (!form.courseType) formErrors.courseType = "Course type is required";
            if (!form.paymentType) formErrors.paymentType = "Payment type is required";
            if (!form.startTime) formErrors.startTime = "Start time is required";
            if (!form.endTime) formErrors.endTime = "End time is required";

            if (form.startTime && form.endTime && form.startTime >= form.endTime) {
                formErrors.endTime = "End time must be after start time";
            }

            return formErrors;
        });

        setErrors(newErrors);
        return newErrors.every(formErrors => Object.keys(formErrors).length === 0);
    };

    //   const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) {
    //         alert("Please fix the errors before submitting");
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         if (editId) {
    //             await axios.put(`/one-to-one/${editId}`, forms[0]);
    //             alert("Session updated successfully!");
    //         } else {
    //             // Multiple sessions create करने के लिए
    //             const promises = forms.map(formData => 
    //                 axios.post("/one-to-one", formData)
    //             );
    //             await Promise.all(promises);
    //             alert("Sessions created successfully!");
    //         }
    //         navigate("/mentor-dashboard/my-sessions");
    //     } catch (err) {
    //         console.error("Submit Error:", err);
    //         const errorMessage = err.response?.data?.message || "Error saving session";
    //         alert(errorMessage);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // Same as your MentorOneToOneForm but with improved error handling
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert("Please fix the errors before submitting");
            return;
        }

        setLoading(true);

        try {
            if (editId) {
                await axios.put(`/one-to-one/${editId}`, forms[0]);
                alert("Session updated successfully!");
            } else {
                // Multiple sessions create करने के लिए
                const promises = forms.map(formData =>
                    axios.post("/one-to-one", formData)
                );
                await Promise.all(promises);
                alert("Sessions created successfully!");
            }
            navigate("/mentor-dashboard/mentor-session-list");
        } catch (err) {
            console.error("Submit Error:", err);
            const errorMessage = err.response?.data?.message || "Error saving session";

            if (err.response?.status === 403) {
                alert("Access denied. You don't have permission to create sessions.");
            } else if (err.response?.status === 401) {
                alert("Please login again.");
                // Redirect to login if needed
            } else {
                alert(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Layout>
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg font-[Poppins]">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {editId ? "Edit My Session" : "Create New Session"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    {forms.map((formData, index) => (
                        <div key={index} className="border p-4 rounded-lg mb-6 relative">
                            {/* Select Days */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    Select Days <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="selectDays"
                                    multiple
                                    value={formData.selectDays}
                                    onChange={(e) =>
                                        handleChange(index, {
                                            target: {
                                                name: "selectDays",
                                                value: Array.from(e.target.selectedOptions, o => o.value),
                                            },
                                        })
                                    }
                                    className={`border rounded-lg px-4 py-2 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.selectDays ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                {errors[index]?.selectDays && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].selectDays}</p>
                                )}
                            </div>

                            {/* Select Date */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    Select Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="selectDate"
                                    value={formData.selectDate}
                                    onChange={(e) => handleChange(index, e)}
                                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.selectDate ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors[index]?.selectDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].selectDate}</p>
                                )}
                            </div>

                            {/* Course Title */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    Course Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="courseTitle"
                                    placeholder="Course Title"
                                    value={formData.courseTitle}
                                    onChange={(e) => handleChange(index, e)}
                                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.courseTitle ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors[index]?.courseTitle && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].courseTitle}</p>
                                )}
                            </div>

                            {/* Course Description */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    Course Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="courseDescription"
                                    placeholder="Course Description"
                                    value={formData.courseDescription}
                                    onChange={(e) => handleChange(index, e)}
                                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.courseDescription ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors[index]?.courseDescription && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].courseDescription}</p>
                                )}
                            </div>

                            {/* Course Type */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    Course Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="courseType"
                                    value={formData.courseType}
                                    onChange={(e) => handleChange(index, e)}
                                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.courseType ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">-- Course Type --</option>
                                    <option value="One To One">One To One</option>
                                    <option value="Course">Course</option>
                                </select>
                                {errors[index]?.courseType && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].courseType}</p>
                                )}
                            </div>

                            {/* Payment Type */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    Payment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="paymentType"
                                    value={formData.paymentType}
                                    onChange={(e) => handleChange(index, e)}
                                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.paymentType ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">-- Payment Type --</option>
                                    <option value="Free">Free</option>
                                    <option value="Paid">Paid</option>
                                </select>
                                {errors[index]?.paymentType && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].paymentType}</p>
                                )}
                            </div>

                            {/* Fees - Only show when Paid */}
                            {formData.paymentType === "Paid" && (
                                <>
                                    <div className="flex flex-col mb-2">
                                        <label className="mb-2 font-semibold text-gray-700">
                                            Fees <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fees"
                                            placeholder="Fees"
                                            value={formData.fees}
                                            onChange={(e) => handleChange(index, e)}
                                            className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.fees ? "border-red-500" : "border-gray-300"
                                                }`}
                                        />
                                        {errors[index]?.fees && (
                                            <p className="text-red-500 text-sm mt-1">{errors[index].fees}</p>
                                        )}
                                    </div>

                                    {/* Including GST */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            name="includingGST"
                                            checked={formData.includingGST}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-4 h-4"
                                        />
                                        <label className="font-semibold text-gray-700">Including GST</label>
                                    </div>
                                </>
                            )}

                            {/* Start Time */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={(e) => handleChange(index, e)}
                                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.startTime ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors[index]?.startTime && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].startTime}</p>
                                )}
                            </div>

                            {/* End Time */}
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-gray-700">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={(e) => handleChange(index, e)}
                                    min={formData.startTime || "00:00"}
                                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[index]?.endTime ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors[index]?.endTime && (
                                    <p className="text-red-500 text-sm mt-1">{errors[index].endTime}</p>
                                )}
                            </div>

                            {/* Remove button */}
                            {forms.length > 1 && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => removeForm(index)}
                                        className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <FaMinus className="mr-2" /> Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add button */}
                    {!editId && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={addForm}
                                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaPlus className="mr-2" /> Add Another Session
                            </button>
                        </div>
                    )}

                    {/* Save/Cancel buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate("/mentor-dashboard/my-sessions")}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editId ? "Update Session" : "Create Sessions"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}