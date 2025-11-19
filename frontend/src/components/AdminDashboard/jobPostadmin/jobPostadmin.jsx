import React from "react";
import { useState, useEffect } from "react";
import Layout from "../../seekerDashboard/partials/layout";
import axios from '../../../utils/axios.js'
import Swal from "sweetalert2";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function PostAJobAdmin() {
    const { id } = useParams(); // job id
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        jobTitle: "",
        description: "",
        benefits: "",
        salaryFrom: "",
        salaryTo: "",
        salaryCurrency: "",
        salaryPeriod: "",
        mode: "",
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
        isFreelance: false,
        isActive: true,
        country: "",
        state: "",
        city: "",
        postedByType: "superadmin",
         companyId: "" // ✅ Add companyId for admin posts
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
    const [loading, setLoading] = useState({
        countries: false,
        states: false,
        cities: false
    })

     const [companies, setCompanies] = useState([]);
        // ✅ Fetch companies for admin to select
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get("/Company-Information");
                if (response.data.success) {
                    setCompanies(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        fetchCompanies();
    }, []);

    // // country list
    // useEffect(() => {
    //     axios.get("/country").then((res) => setCountries(res.data.country));
    //     console.log(countries);

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

    // Load countries
    useEffect(() => {
        const loadCountries = async () => {
            setLoading(prev => ({ ...prev, countries: true }));
            try {
                const response = await axios.get("/country");
                setCountries(response.data.country || []);
            } catch (error) {
                console.error("Failed to fetch countries:", error);
                Swal.fire("Error", "Failed to load countries", "error");
            } finally {
                setLoading(prev => ({ ...prev, countries: false }));
            }
        };
        loadCountries();
    }, []);

    // Load states when country changes
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
                Swal.fire("Error", "Failed to load states", "error");
            } finally {
                setLoading(prev => ({ ...prev, states: false }));
            }
        };

        loadStates();
    }, [formData.country]);

    // Load cities when state changes
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
                Swal.fire("Error", "Failed to load cities", "error");
            } finally {
                setLoading(prev => ({ ...prev, cities: false }));
            }
        };

        loadCities();
    }, [formData.state]);

    useEffect(() => {
        const fetchCareerLevels = async () => {
            try {
                const { data } = await axios.get("/career-level-category/active");
                setCareerLevels(data);
            } catch (err) {
                console.error("Failed to fetch career levels:", err);
            }
        };
        fetchCareerLevels();
    }, []);

    useEffect(() => {
        const fetchFunctionalAreas = async () => {
            try {
                const { data } = await axios.get("/functionalArea-Category/active");
                setFunctionalAreas(data);
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
                setSkills(formatted);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            }
        };
        fetchSkills();
    }, []);


    useEffect(() => {
        const fetchDegreeLevels = async () => {
            try {
                const res = await axios.get("/degree-level-category/active");
                setDegreeLevels(res.data); // store only active categories
            } catch (error) {
                console.error("Failed to fetch degree levels:", error);
            }
        };
        fetchDegreeLevels();
    }, []);

    // Fetch additional data
    useEffect(() => {
        // Mock data for demonstration - replace with actual API calls
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

        // setDegreeLevels([
        //     { _id: "1", name: "High School" },
        //     { _id: "2", name: "Bachelor's" },
        //     { _id: "3", name: "Master's" },
        //     { _id: "4", name: "PhD" }
        // ]);

        setExperienceLevels([
            { _id: "1", name: "0-1 years" },
            { _id: "2", name: "1-3 years" },
            { _id: "3", name: "3-5 years" },
            { _id: "4", name: "5+ years" }
        ]);
    }, []);

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

    // const handleLocationChange = (field, value) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         [field]: Number(value),
    //         // Reset dependent fields when parent changes
    //         ...(field === 'country' && { state: "", city: "" }),
    //         ...(field === 'state' && { city: "" })
    //     }));
    // };
    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            // Reset dependent fields when parent changes
            ...(field === 'country' && { state: "", city: "" }),
            ...(field === 'state' && { city: "" })
        }));
    };
    const handleSkillsChange = (selected) => {
        setSelectedSkills(selected || []);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.careerLevel) newErrors.careerLevel = "Career level is required";
        if (!formData.jobType) newErrors.jobType = "Job type is required";
        if (!formData.functionalArea) newErrors.functionalArea = "Functional Area is required";
        if (!formData.positions) newErrors.positions = "Number of positions is required";
        if (!formData.jobShift) newErrors.jobShift = "Job Shift is required";
        if (!formData.mode) newErrors.mode = " Mode is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            jobTitle: "",
            description: "",
            benefits: "",
            salaryFrom: "",
            salaryTo: "",
            salaryCurrency: "",
            salaryPeriod: "",
            mode: "",
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
            isFreelance: false,
            isActive: true,
            country: "",
            state: "",
            city: ""
        });
        setSelectedSkills([]);
        setErrors({});
    };



    useEffect(() => {
        if (id) {
            // fetch job data for editing
            axios.get(`/job-post/${id}`).then(res => {
                const job = res.data;
                setFormData({
                    jobTitle: job.jobTitle || "",
                    description: job.description || "",
                    benefits: job.benefits || "",
                    salaryFrom: job.salaryFrom || "",
                    salaryTo: job.salaryTo || "",
                    salaryCurrency: job.salaryCurrency?._id || "",
                    salaryPeriod: job.salaryPeriod || "",
                    mode: job.mode || "",
                    hideSalary: job.hideSalary || false,
                    careerLevel: job.careerLevel?._id || "",
                    functionalArea: job.functionalArea?._id || "",
                    jobType: job.jobType?._id || "",
                    jobShift: job.jobShift?._id || "",
                    positions: job.positions || "",
                    expiryDate: job.expiryDate?.split("T")[0] || "",
                    degreeLevel: job.degreeLevel?._id || "",   
                    experience: job.experience || "",
                    externalJob: job.externalJob || "",
                    isFreelance: job.isFreelance || false,
                    isActive: job.isActive ?? true,
                    country: job.country || "",
                    state: job.state || "",
                    city: job.city || ""
                });

                // populate selected skills
                setSelectedSkills((job.skills || []).map(skill => ({
                    value: skill._id,
                    label: skill.name
                })));
            }).catch(err => console.error(err));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const selectedExp = experienceLevels.find(exp => exp._id === formData.experience);
        try {
            const submitData = {
                ...formData,
                experience: selectedExp ? selectedExp.name : formData.experience, // 👈 convert _id → name
                skills: selectedSkills.map(skill => skill.value),
                postedByType: "superadmin",
                 companyId: formData.companyId // ✅ Use selected companyId
            };

            if (id) {
                // update existing job
                await axios.put(`/job-post/${id}`, submitData);
                Swal.fire("Success", "Job updated successfully", "success");
            } else {
                // create new job
                await axios.post("/job-post", submitData);
                Swal.fire("Success", "Job created successfully", "success");
            }

            navigate("/admin-dashboard/job-post-list"); // redirect back to list
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };


    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <div className="w-full mx-auto p-6 bg-white border shadow-sm rounded-md space-y-6">
                    <h2 className="text-lg sm:text-[30px] font-semibold text-gray-800">Job Details</h2>

                    <div className="space-y-4">


                         <div>
                            <label className="block text-sm font-medium mb-1">Company *</label>
                            <select
                                name="companyId"
                                value={formData.companyId}
                                onChange={handleInputChange}
                                className={`w-full border rounded px-4 py-2 text-sm ${errors.companyId ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Select Company</option>
                                {companies.map((company) => (
                                    <option key={company._id} value={company._id}>
                                        {company.company?.name || "Unnamed Company"}
                                    </option>
                                ))}
                            </select>
                            {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>}
                        </div>

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

                        {/* Benefits */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Benefits</label>
                            <div className="h-32 border border-gray-300 rounded overflow-hidden">
                                <textarea
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleInputChange}
                                    className="w-full h-full p-2 text-sm resize-none"
                                    placeholder="Enter benefits..."
                                />
                            </div>
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
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            {/* Location Section - FIXED */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Location *</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Country */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country * {loading.countries && "(Loading...)"}
                                        </label>
                                        <select
                                            value={formData.country}
                                            onChange={(e) => handleLocationChange('country', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 ${errors.country ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                                                }`}
                                            disabled={loading.countries}
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

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State * {loading.states && "(Loading...)"}
                                        </label>
                                        <select
                                            value={formData.state}
                                            onChange={(e) => handleLocationChange('state', e.target.value)}
                                            disabled={!formData.country || loading.states}
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

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City * {loading.cities && "(Loading...)"}
                                        </label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => handleLocationChange('city', e.target.value)}
                                            disabled={!formData.state || loading.cities}
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
                                    <label className="block text-sm font-medium mb-1">Career Level *</label>
                                    <select
                                        name="careerLevel"
                                        value={formData.careerLevel}
                                        onChange={handleInputChange}
                                        className={`w-full border px-3 py-2 rounded text-sm ${errors.careerLevel ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Career Level</option>
                                        {careerLevels.map((level) => (
                                            <option key={level._id} value={level._id}>
                                                {level.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.careerLevel && <p className="text-red-500 text-xs mt-1">{errors.careerLevel}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Functional Area *</label>
                                    <select
                                        name="functionalArea"
                                        value={formData.functionalArea}
                                        onChange={handleInputChange}
                                        className={`w-full border px-3 py-2 rounded text-sm ${errors.functionalArea ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Functional Area</option>
                                        {functionalAreas.map((area) => (
                                            <option key={area._id} value={area._id}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.functionalArea && <p className="text-red-500 text-xs mt-1">{errors.functionalArea}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Type *</label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleInputChange}
                                        className={`w-full border px-3 py-2 rounded text-sm ${errors.jobType ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Job Type</option>
                                        {jobTypes.map((job) => (
                                            <option key={job._id} value={job._id}>
                                                {job.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Shift *</label>
                                    <select
                                        name="jobShift"
                                        value={formData.jobShift}
                                        onChange={handleInputChange}
                                        className={`w-full border px-3 py-2 rounded text-sm ${errors.jobShift ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Job Shift</option>
                                        {jobShifts.map((shift) => (
                                            <option key={shift._id} value={shift._id}>
                                                {shift.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.jobShift && <p className="text-red-500 text-xs mt-1">{errors.jobShift}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Number of Positions *</label>
                                    <input
                                        type="number"
                                        name="positions"
                                        value={formData.positions}
                                        onChange={handleInputChange}
                                        className={`w-full border px-3 py-2 rounded text-sm ${errors.positions ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="Number of Positions"
                                    />
                                    {errors.positions && <p className="text-red-500 text-xs mt-1">{errors.positions}</p>}
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
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm">
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
                                            <option key={exp._id} value={exp.name}>
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
                                    <label className="block text-sm font-medium mb-1">Mode</label>
                                    <select
                                        name="mode"
                                        value={formData.mode}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                                    >
                                        <option value="">Select Mode</option>
                                        <option value="remote">Remote</option>
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                    </select>

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