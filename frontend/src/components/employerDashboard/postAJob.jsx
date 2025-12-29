import React from "react";
import { useState, useEffect } from "react";
import Layout from "../seekerDashboard/partials/layout";
import axios from '../../utils/axios.js'
import Swal from "sweetalert2";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function PostAJob() {
    const { id } = useParams(); // job id
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        jobTitle: "",
        description: "",
        salaryFrom: "",
        salaryTo: "",
        salaryCurrency: "",
        salaryPeriod: "",
        hideSalary: false,
        careerLevel: "",
        functionalArea: "",
        jobType: "",
        jobShift: "",
        positions: "",
        expiryDate: "",
        degreeLevel: "",
        experience: "",
        externalJob: "",
        mode: "",
        isFreelance: false,
        isActive: true,
        country: "",
        state: "",
        city: "",
        address: "",
        postedByType: "Employer"
    });

    const [salaryCurrencies, setSalaryCurrencies] = useState([]);
    const [salaryPeriods, setSalaryPeriods] = useState([]);
    const [degreeLevels, setDegreeLevels] = useState([]);
    const [experienceLevels, setExperienceLevels] = useState([]);
    const [careerLevels, setCareerLevels] = useState([]);
    const [functionalAreas, setFunctionalAreas] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [jobShifts, setJobShifts] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [companyId, setCompanyId] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [customSkill, setCustomSkill] = useState("");

    const [isEditing, setIdEditing] = useState(false);
    // Set editing mode based on ID
    useEffect(() => {
        if (id) {
            setIdEditing(true);
        }
    }, [id]);

    // ✅ Check if user has company profile

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get("/Company-Information/my-company");
                if (response.data.success && response.data.data) {
                    setCompanyId(response.data.data._id);
                    console.log("Company ID loaded:", response.data.data);
                } else {
                    Swal.fire("Warning", "Please create company profile first", "warning");
                }
            } catch (error) {
                console.error("Error fetching company data:", error);
                Swal.fire("Error", "Failed to load company data", "error");
            }
        };
        fetchCompanyData();
    }, []);



    // country list
    useEffect(() => {
        axios.get("/country").then((res) => setCountries(res.data.country));
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
        const fetchDegreeLevels = async () => {
            try {
                const res = await axios.get("/degree-Level-Category/active");
                setDegreeLevels(res.data);
            } catch (err) {
                console.error("Failed to fetch degree levels:", err);
            }
        };
        fetchDegreeLevels();
    }, []);


    useEffect(() => {
        const fetchCareerLevels = async () => {
            try {
                const res = await axios.get("/career-level-category/active");
                setCareerLevels(res.data);
            } catch (err) {
                console.error("Failed to fetch career levels:", err);
            }
        };
        fetchCareerLevels();
    }, []);

    useEffect(() => {
        const fetchFunctionalAreas = async () => {
            try {
                const res = await axios.get("/functionalArea-Category/active");
                setFunctionalAreas(res.data);
            } catch (err) {
                console.error("Failed to fetch functional areas:", err);
            }
        };
        fetchFunctionalAreas();
    }, []);

    useEffect(() => {
        const fetchJobTypes = async () => {
            try {
                const res = await axios.get("/job-Type-category/active");
                setJobTypes(res.data);
            } catch (error) {
                console.error("Failed to fetch job types:", error);
            }
        };
        fetchJobTypes();
    }, []);

    useEffect(() => {
        const fetchJobShifts = async () => {
            try {
                const res = await axios.get("/job-Shift-category/active");
                setJobShifts(res.data);
            } catch (error) {
                console.error("Failed to fetch job shifts:", error);
            }
        };
        fetchJobShifts();
    }, []);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get("/skills-categories/active");
                const formatted = res.data.map((skill) => ({
                    value: skill._id,
                    label: skill.name,
                }));
                // Add "Other" option
                formatted.push({ value: "other", label: "Other" });
                setSkills(formatted);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            }
        };
        fetchSkills();
    }, []);

    // Fetch additional data
    useEffect(() => {

        setSalaryCurrencies([
            { _id: "1", name: "USD" },
            { _id: "2", name: "INR" },
            { _id: "3", name: "EUR" }
        ]);

        setSalaryPeriods([
            { _id: "1", name: "Monthly" },
            { _id: "2", name: "Yearly" },
            { _id: "3", name: "Weekly" }
        ]);



        setExperienceLevels([
            { _id: "1", name: "0-1 years" },
            { _id: "2", name: "1-3 years" },
            { _id: "3", name: "3-5 years" },
            { _id: "4", name: "5-10 years" },
            { _id: "5", name: "10-15 years" },
            { _id: "6", name: "15-20 years" }
        ]);
    }, []);



    // Fetch job data for editing
    useEffect(() => {
        if (id) {
            const fetchJobData = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`/job-post/${id}`);
                    const job = response.data;

                    setFormData({
                        jobTitle: job.jobTitle || "",
                        description: job.description || "",

                        salaryFrom: job.salaryFrom || "",
                        salaryTo: job.salaryTo || "",
                        salaryCurrency: job.salaryCurrency?._id || job.salaryCurrency || "",
                        salaryPeriod: job.salaryPeriod || "",
                        hideSalary: job.hideSalary || false,
                        careerLevel: job.careerLevel?._id || job.careerLevel || "",
                        functionalArea: job.functionalArea?._id || job.functionalArea || "",
                        jobType: job.jobType?._id || job.jobType || "",
                        jobShift: job.jobShift?._id || job.jobShift || "",
                        positions: job.positions || "",
                        expiryDate: job.expiryDate?.split("T")[0] || "",
                        degreeLevel: job.degreeLevel || "",
                        experience: job.experience || "",
                        externalJob: job.externalJob || "",
                        mode: job.mode || "",
                        isFreelance: job.isFreelance || false,
                        isActive: job.isActive ?? true,
                        country: job.country || "",
                        state: job.state || "",
                        city: job.city || "",
                        address: job.address || ""
                    });

                    // populate selected skills
                    if (job.skills && job.skills.length > 0) {
                        const skillsData = job.skills.map(skill => ({
                            value: skill._id || skill,
                            label: skill.name || skill
                        }));
                        setSelectedSkills(skillsData);
                    }
                } catch (err) {
                    console.error("Error fetching job data:", err);
                    Swal.fire("Error", "Failed to load job data", "error");
                } finally {
                    setLoading(false);
                }
            };
            fetchJobData();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: Number(value),
            // Reset dependent fields when parent changes
            ...(field === 'country' && { state: "", city: "" }),
            ...(field === 'state' && { city: "" })
        }));
    };

    const handleSkillsChange = (selected) => {
        const selectedArray = selected || [];
        const hasOther = selectedArray.some(skill => skill.value === "other");
        setShowOtherInput(hasOther);
        setSelectedSkills(selectedArray);
    };

    const handleAddCustomSkill = async () => {
        if (!customSkill.trim()) return;
        try {
            const res = await axios.post("/skills-categories", { name: customSkill.trim() });
            const newSkill = { value: res.data._id, label: res.data.name };
            // Add to skills list
            setSkills(prev => [...prev.filter(s => s.value !== "other"), newSkill, { value: "other", label: "Other" }]);
            // Add to selected skills, replace "other"
            setSelectedSkills(prev => [...prev.filter(s => s.value !== "other"), newSkill]);
            setCustomSkill("");
            setShowOtherInput(false);
        } catch (error) {
            console.error("Failed to add custom skill:", error);
            Swal.fire("Error", "Failed to add custom skill", "error");
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.mode) newErrors.mode = "Job Mode is required";
        // ✅ Check if company exists
        if (!companyId) newErrors.company = "Company profile not found. Please create company profile first.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            jobTitle: "",
            description: "",
            salaryFrom: "",
            salaryTo: "",
            salaryCurrency: "",
            salaryPeriod: "",
            hideSalary: false,
            careerLevel: "",
            functionalArea: "",
            jobType: "",
            jobShift: "",
            positions: "",
            expiryDate: "",
            degreeLevel: "",
            experience: "",
            externalJob: "",
            mode: "",
            isFreelance: false,
            isActive: true,
            country: "",
            state: "",
            city: "",
            address: ""
        });
        setSelectedSkills([]);
        setErrors({});
        setShowOtherInput(false);
        setCustomSkill("");
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const submitData = {
                jobTitle: formData.jobTitle,
                description: formData.description,
                salaryFrom: formData.salaryFrom || undefined,
                salaryTo: formData.salaryTo || undefined,
                salaryCurrency: formData.salaryCurrency || undefined,
                salaryPeriod: formData.salaryPeriod || undefined,
                mode: formData.mode,
                hideSalary: formData.hideSalary,
                careerLevel: formData.careerLevel || undefined,
                functionalArea: formData.functionalArea || undefined,
                jobType: formData.jobType || undefined,
                jobShift: formData.jobShift || undefined,
                positions: formData.positions ? Number(formData.positions) : undefined,
                expiryDate: formData.expiryDate || undefined,
                degreeLevel: formData.degreeLevel || undefined,
                experience: formData.experience || undefined,
                externalJob: formData.externalJob || undefined,
                isFreelance: formData.isFreelance,
                isActive: formData.isActive,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                address: formData.address || undefined,
                skills: selectedSkills.map(skill => skill.value),
                postedByType: "Employer",
                companyId: companyId
            };

            if (isEditing) {
                // update existing job
                await axios.put(`/job-post/${id}`, submitData);
                Swal.fire("Success", "Job updated successfully", "success");
            } else {
                // create new job
                await axios.post("/job-post", submitData);
                Swal.fire("Success", "Job created successfully", "success");
                resetForm();
            }

            navigate("/employer-dashboard/posted-jobs"); // redirect back to job list
        } catch (err) {
            console.error("Submission error:", err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    // Show warning if no company found
    if (!companyId && !loading) {
        return (
            <Layout>
                <div className="w-full mx-auto p-6 bg-white border shadow-sm rounded-md space-y-6">
                    <div className="text-center py-10">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">Company Profile Required</h2>
                        <p className="text-gray-600 mb-6">You need to create a company profile before posting jobs.</p>
                        <button
                            onClick={() => navigate("/employer-dashboard/company-profile")}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold"
                        >
                            Create Company Profile
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (loading && isEditing) {
        return (
            <Layout>
                <div className="w-full mx-auto p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading job data...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <div className="w-full mx-auto p-6 bg-white border shadow-sm rounded-md space-y-6">
                    <h2 className="text-lg sm:text-[30px] font-semibold text-gray-800">Job Details</h2>
                    {companyId && (
                        <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            ✅ Company Linked
                        </span>
                    )}
                    {errors.company && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {errors.company}
                        </div>
                    )}
                    <div className="space-y-4">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Title *</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                placeholder="Enter job title"
                                className={`w-full border rounded px-4 py-2 text-sm ${errors.jobTitle ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <div className={`h-32 border rounded overflow-hidden ${errors.description ? "border-red-500" : "border-gray-300"
                                }`}>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full h-full p-2 text-sm resize-none"
                                    placeholder="Enter job description..."
                                />
                            </div>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>


                        {/* Required Skills */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Required Skills</label>
                            <Select
                                options={skills}
                                value={selectedSkills}
                                onChange={handleSkillsChange}
                                isMulti
                                placeholder="Select Required Skills"
                                className="text-sm"
                            />
                            {showOtherInput && (
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        value={customSkill}
                                        onChange={(e) => setCustomSkill(e.target.value)}
                                        placeholder="Enter custom skill"
                                        className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomSkill}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Location *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => handleLocationChange('country', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 ${errors.country ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                    >
                                        <option value="">-- Select Country --</option>
                                        {countries.map((country) => (
                                            <option key={country._id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => handleLocationChange('state', e.target.value)}
                                        disabled={!formData.country}
                                        className={`w-full border rounded-lg px-3 py-2 ${errors.state ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                    >
                                        <option value="">-- Select State --</option>
                                        {states.map((state) => (
                                            <option key={state._id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => handleLocationChange('city', e.target.value)}
                                        disabled={!formData.state}
                                        className={`w-full border rounded-lg px-3 py-2 ${errors.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                    >
                                        <option value="">-- Select City --</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded text-sm resize-none"
                                    rows="3"
                                    placeholder="Enter address details"
                                />
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Salary Range</label>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    name="salaryFrom"
                                    value={formData.salaryFrom}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                                    placeholder="Salary From"
                                />
                                <input
                                    type="number"
                                    name="salaryTo"
                                    value={formData.salaryTo}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                                    placeholder="Salary To"
                                />
                            </div>
                        </div>

                        {/* Salary Details */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Salary Details</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <select
                                    name="salaryCurrency"
                                    value={formData.salaryCurrency}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                                >
                                    <option value="">Select Salary Currency</option>
                                    {salaryCurrencies.map((currency) => (
                                        <option key={currency._id} value={currency._id}>
                                            {currency.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="salaryPeriod"
                                    value={formData.salaryPeriod}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                                >
                                    <option value="">Select Salary Period</option>
                                    {salaryPeriods.map((period) => (
                                        <option key={period._id} value={period._id}>
                                            {period.name}
                                        </option>
                                    ))}
                                </select>
                                <label className="flex items-center gap-2 text-sm">
                                    Hide Salary?
                                    <input
                                        type="checkbox"
                                        name="hideSalary"
                                        checked={formData.hideSalary}
                                        onChange={handleInputChange}
                                        className="ml-2"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Job Specifications */}
                        <div>
                            <label className="block text-2xl font-medium mb-5">Job Specifications</label>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Career Level</label>
                                    <select
                                        name="careerLevel"
                                        value={formData.careerLevel}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Select Career Level</option>
                                        {careerLevels.map((level) => (
                                            <option key={level._id} value={level._id}>
                                                {level.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Functional Area</label>
                                    <select
                                        name="functionalArea"
                                        value={formData.functionalArea}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Select Functional Area</option>
                                        {functionalAreas.map((area) => (
                                            <option key={area._id} value={area._id}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Type</label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Select Job Type</option>
                                        {jobTypes.map((job) => (
                                            <option key={job._id} value={job._id}>
                                                {job.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Shift</label>
                                    <select
                                        name="jobShift"
                                        value={formData.jobShift}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Select Job Shift</option>
                                        {jobShifts.map((shift) => (
                                            <option key={shift._id} value={shift._id}>
                                                {shift.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Number of Positions</label>
                                    <input
                                        type="number"
                                        name="positions"
                                        value={formData.positions}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                        placeholder="Number of Positions"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Expiry Date</label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Required Degree Level</label>
                                    <select
                                        name="degreeLevel"
                                        value={formData.degreeLevel}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Select Required Degree Level</option>
                                        {degreeLevels.map((degree) => (
                                            <option key={degree._id} value={degree._id}>
                                                {degree.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Required Experience</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Select Required Experience</option>
                                        {experienceLevels.map((exp) => (
                                            <option key={exp._id} value={exp._id}>
                                                {exp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">External Job</label>
                                    <select
                                        name="externalJob"
                                        value={formData.externalJob}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Is this External Job?</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Mode *</label>
                                    <select
                                        name="mode"
                                        value={formData.mode}
                                        onChange={handleInputChange}
                                        className={`w-full border px-3 py-2 rounded text-sm ${errors.mode ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Job Mode</option>
                                        <option value="Work From Home">Work From Home</option>
                                        <option value="Work From Office">Work From Office</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>

                                    {errors.mode && (
                                        <p className="text-red-500 text-xs mt-1">{errors.mode}</p>
                                    )}
                                </div>


                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        Is Freelance?
                                        <input
                                            type="checkbox"
                                            name="isFreelance"
                                            checked={formData.isFreelance}
                                            onChange={handleInputChange}
                                            className="ml-2"
                                        />
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        Is Active?
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="ml-2"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-sm">
                            SUBMIT JOB
                        </button>
                    </div>
                </div>
            </form>
        </Layout>
    );
}