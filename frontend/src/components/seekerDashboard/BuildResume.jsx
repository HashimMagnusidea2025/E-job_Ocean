import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from '../../utils/axios.js'
import {
    FaPen,
    FaTimes,
    FaDownload,
    FaPencilAlt,
    FaMapMarkerAlt,
    FaBuilding,
    FaCalendarAlt,
    FaPlus,
    FaEdit,
    FaGraduationCap,
    FaSchool,
    FaLanguage,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";
import Layout from "./partials/layout";

const data = [
    {
        id: 1,
        title: "My Resume1",
        isDefault: "Default",
        date: "2025-03-09 06:19:47",
    },
];

const columns = [
    {
        name: "CV Title",
        selector: (row) => row.title,
        sortable: true,
        cell: (row) => (
            <span className="text-blue-600 hover:underline cursor-pointer">{row.title}</span>
        ),
    },
    {
        name: "Default CV",
        selector: (row) => row.isDefault,
        sortable: true,
    },
    {
        name: "Date",
        selector: (row) => row.date,
        sortable: true,
    },
    {
        name: "Action",
        cell: (row) => (
            <div className="space-x-3 text-xl">
                <button className="">
                    <FaDownload />
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                    <FaPencilAlt />
                </button>
                <button className="text-red-600 hover:text-red-800">
                    <FaTimes />
                </button>
            </div>
        ),
    },
];

const initialSkills = [
    { name: "Adobe Photoshop", experience: "14 Years" },
    { name: "Adobe Illustrator", experience: "9 years" },
    { name: "HTML", experience: "14 Years" },
    { name: "CSS", experience: "13 Years" },
    { name: "Adaptability skills", experience: "8 years" },
];

export default function BuildResume() {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [educationStates, setEducationStates] = useState([]);
    const [educationCities, setEducationCities] = useState([]);
    const [degreeLevels, setDegreeLevels] = useState([]);
    const [degreeTypes, setDegreeTypes] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [editingSkill, setEditingSkill] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [experienceLocationNames, setExperienceLocationNames] = useState({});
    const [educationLocationNames, setEducationLocationNames] = useState({});
    const [editingExperience, setEditingExperience] = useState(null);
    const [editingEducation, setEditingEducation] = useState(null);

    const [showCustomDegreeType, setShowCustomDegreeType] = useState(false);
    const [customDegreeType, setCustomDegreeType] = useState("");
    // Form states
    const [experienceFormData, setExperienceFormData] = useState({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
        country: "",
        state: "",
        city: "",
    });

    const [educationFormData, setEducationFormData] = useState({
        degreeLevel: "",
        degreeType: "",
        degreeTitle: "",
        yearOfCompletion: "",
        country: "",
        state: "",
        city: "",
        customDegreeType: "" // 🔹 NEW: Custom degree type field
    });

    const [skillsFormData, setSkillsFormData] = useState({
        skillName: "",
        experience: "",
    });

    const [languagesFormData, setLanguagesFormData] = useState({
        languageName: "",
        proficiency: "",
    });

    // 🔹 NEW: Toggle active status functions
    const toggleExperienceStatus = async (id) => {
        try {
            const res = await axios.patch(`/build-Resume/experiences/${id}/toggle-status`);
            if (res.data.success) {
                await fetchUserData();
            }
        } catch (error) {
            console.error("❌ Error toggling experience status:", error);
        }
    };

    const toggleEducationStatus = async (id) => {
        try {
            const res = await axios.patch(`/build-Resume/educations/${id}/toggle-status`);
            if (res.data.success) {
                await fetchUserData();
            }
        } catch (error) {
            console.error("❌ Error toggling education status:", error);
        }
    };

    const toggleSkillStatus = async (id) => {
        try {
            const res = await axios.patch(`/build-Resume/skills/${id}/toggle-status`);
            if (res.data.success) {
                await fetchUserSkills();
            }
        } catch (error) {
            console.error("❌ Error toggling skill status:", error);
        }
    };

    const toggleLanguageStatus = async (id) => {
        try {
            const res = await axios.patch(`/build-Resume/languages/${id}/toggle-status`);
            if (res.data.success) {
                await fetchUserLanguages();
            }
        } catch (error) {
            console.error("❌ Error toggling language status:", error);
        }
    };

    // 🔹 NEW: Fetch location names for experiences and educations
    const fetchLocationNames = async (expData = experiences, eduData = educations) => {
        try {
            console.log("🔄 Starting to fetch location names...");
            const newExperienceLocationNames = {};
            const newEducationLocationNames = {};

            // Fetch location names for experiences
            for (let experience of expData) {
                const locationData = { country: "", state: "", city: "" };

                // Fetch country name
                if (experience.country) {
                    try {
                        const countryResponse = await axios.get(`/country/${experience.country}`);
                        if (countryResponse.data.success) {
                            locationData.country = countryResponse.data.data.name;
                        }
                    } catch (err) {
                        console.error("❌ Error fetching country:", err);
                        locationData.country = experience.country;
                    }
                }

                // Fetch state name
                if (experience.state) {
                    try {
                        const stateResponse = await axios.get(`/state/${experience.state}`);
                        if (stateResponse.data.success) {
                            locationData.state = stateResponse.data.data.name;
                        }
                    } catch (err) {
                        console.error("❌ Error fetching state:", err);
                        locationData.state = experience.state;
                    }
                }

                // Fetch city name
                if (experience.city) {
                    try {
                        const cityResponse = await axios.get(`/city/${experience.city}`);
                        if (cityResponse.data.success) {
                            locationData.city = cityResponse.data.data.name;
                        }
                    } catch (err) {
                        console.error("❌ Error fetching city:", err);
                        locationData.city = experience.city;
                    }
                }

                newExperienceLocationNames[experience._id] = locationData;
            }

            // Fetch location names for educations
            for (let education of eduData) {
                const locationData = { country: "", state: "", city: "" };

                // Fetch country name
                if (education.country) {
                    try {
                        const countryResponse = await axios.get(`/country/${education.country}`);
                        if (countryResponse.data.success) {
                            locationData.country = countryResponse.data.data.name;
                        }
                    } catch (err) {
                        console.error("❌ Error fetching country:", err);
                        locationData.country = education.country;
                    }
                }

                // Fetch state name
                if (education.state) {
                    try {
                        const stateResponse = await axios.get(`/state/${education.state}`);
                        if (stateResponse.data.success) {
                            locationData.state = stateResponse.data.data.name;
                        }
                    } catch (err) {
                        console.error("❌ Error fetching state:", err);
                        locationData.state = education.state;
                    }
                }

                // Fetch city name
                if (education.city) {
                    try {
                        const cityResponse = await axios.get(`/city/${education.city}`);
                        if (cityResponse.data.success) {
                            locationData.city = cityResponse.data.data.name;
                        }
                    } catch (err) {
                        console.error("❌ Error fetching city:", err);
                        locationData.city = education.city;
                    }
                }

                newEducationLocationNames[education._id] = locationData;
            }

            setExperienceLocationNames(newExperienceLocationNames);
            setEducationLocationNames(newEducationLocationNames);
        } catch (err) {
            console.error("❌ Error fetching location names:", err);
        }
    };

    // 🔹 NEW: Fetch user skills function
    const fetchUserSkills = async () => {
        try {
            console.log("🔄 Fetching user skills...");
            const skillsRes = await axios.get("/build-Resume/skills");
            const skillsData = skillsRes.data.data || [];
            setSkills(skillsData);
        } catch (error) {
            console.error("❌ Error fetching skills:", error);
        }
    };

    // 🔹 NEW: Fetch user languages function
    const fetchUserLanguages = async () => {
        try {
            console.log("🔄 Fetching user languages...");
            const languagesRes = await axios.get("/build-Resume/languages");
            const languagesData = languagesRes.data.data || []
            setLanguages(languagesData);
        } catch (error) {
            console.error("❌ Error fetching languages:", error);
        }
    };

    // 🔹 NEW: Fetch user experiences and educations
    const fetchUserData = async () => {
        setLoading(true);
        try {
            console.log("🔄 Fetching user data...");

            // Fetch experiences
            const expRes = await axios.get("/build-Resume/experiences");
            const experiencesData = expRes.data.data || [];
            setExperiences(experiencesData);

            // Fetch educations
            const eduRes = await axios.get("/build-Resume/educations");
            const educationsData = eduRes.data.data || [];
            setEducations(educationsData);

            await fetchUserSkills();
            await fetchUserLanguages();

            // 🔹 NEW: Fetch location names after getting data
            await fetchLocationNames(experiencesData, educationsData);

        } catch (error) {
            console.error("❌ Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 NEW: Function to get location display string
    const getLocationString = (item, locationNames = {}) => {
        const locationParts = [
            locationNames.city || item.city || '',
            locationNames.state || item.state || '',
            locationNames.country || item.country || ''
        ].filter(part => part && part !== 'N/A');

        return locationParts.length > 0 ? locationParts.join(', ') : 'Location not specified';
    };

    // 🔹 NEW: Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // 🔹 NEW: Format date for input fields (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // 🔹 NEW: Handle Skills Form Change
    const handleSkillsChange = (e) => {
        const { name, value } = e.target;
        setSkillsFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLanguagesChange = (e) => {
        const { name, value } = e.target;
        setLanguagesFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleExperienceChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (["country", "state", "city"].includes(name)) {
            setExperienceFormData((prev) => ({
                ...prev,
                [name]: value,
                ...(name === "country" && { state: "", city: "" }),
                ...(name === "state" && { city: "" }),
            }));
        } else if (type === "checkbox") {
            setExperienceFormData((prev) => ({
                ...prev,
                [name]: checked,
                ...(name === "currentlyWorking" && checked && { endDate: "" })
            }));
        } else {
            setExperienceFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEducationChange = (e) => {
        const { name, value } = e.target;

        if (["country", "state", "city"].includes(name)) {
            setEducationFormData((prev) => ({
                ...prev,
                [name]: value,
                ...(name === "country" && { state: "", city: "" }),
                ...(name === "state" && { city: "" }),
            }));
        } else {
            setEducationFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // 🔹 NEW: Handle Edit Experience
    const handleEditExperience = (experience) => {
        setEditingExperience(experience);
        setExperienceFormData({
            jobTitle: experience.jobTitle || "",
            companyName: experience.companyName || "",
            startDate: formatDateForInput(experience.startDate) || "",
            endDate: formatDateForInput(experience.endDate) || "",
            currentlyWorking: experience.currentlyWorking || false,
            description: experience.description || "",
            country: experience.country || "",
            state: experience.state || "",
            city: experience.city || "",
        });
        setOpenModal("experience");
    };

    // 🔹 NEW: Handle Edit Skill
    const handleEditSkill = (skill) => {
        setEditingSkill(skill);
        setSkillsFormData({
            skillName: skill.skillName || "",
            experience: skill.experience || "",
        });
        setOpenModal("skills");
    };

    // 🔹 NEW: Handle Edit Language
    const handleEditLanguage = (language) => {
        setEditingLanguage(language);
        setLanguagesFormData({
            languageName: language.languageName || "",
            proficiency: language.proficiency || "",
        });
        setOpenModal("languages");
    };




    // 🔹 NEW: Handle Edit Education
    // const handleEditEducation = (education) => {
    //     setEditingEducation(education);
    //     setEducationFormData({
    //         degreeLevel: education.degreeLevel?._id || education.degreeLevel || "",
    //         degreeType: education.degreeType?._id || education.degreeType || "",
    //         degreeTitle: education.degreeTitle || "",
    //         yearOfCompletion: education.yearOfCompletion || "",
    //         country: education.country || "",
    //         state: education.state || "",
    //         city: education.city || "",
    //     });
    //     setOpenModal("education");
    // };

    // 🔹 NEW: When editing education, check if degree type is custom
    // const handleEditEducation = (education) => {
    //     setEditingEducation(education);

    //     // Check if degree type exists in predefined list
    //     const degreeTypeId = education.degreeType?._id || education.degreeType;
    //     const isCustomDegreeType = !degreeTypes.some(type => type._id === degreeTypeId);

    //     if (isCustomDegreeType && education.degreeType) {
    //         // If it's a custom degree type
    //         setShowCustomDegreeType(true);
    //         setEducationFormData({
    //             degreeLevel: education.degreeLevel?._id || education.degreeLevel || "",
    //             degreeType: "other",
    //             customDegreeType: education.degreeType?.name || education.degreeType || "",
    //             degreeTitle: education.degreeTitle || "",
    //             yearOfCompletion: education.yearOfCompletion || "",
    //             country: education.country || "",
    //             state: education.state || "",
    //             city: education.city || "",
    //         });
    //     } else {
    //         // If it's a predefined degree type
    //         setShowCustomDegreeType(false);
    //         setEducationFormData({
    //             degreeLevel: education.degreeLevel?._id || education.degreeLevel || "",
    //             degreeType: education.degreeType?._id || education.degreeType || "",
    //             customDegreeType: "",
    //             degreeTitle: education.degreeTitle || "",
    //             yearOfCompletion: education.yearOfCompletion || "",
    //             country: education.country || "",
    //             state: education.state || "",
    //             city: education.city || "",
    //         });
    //     }
    //     setOpenModal("education");
    // };
    // 🔹 UPDATED: Handle Edit Education with proper custom degree type handling
const handleEditEducation = (education) => {
    setEditingEducation(education);
    
    console.log("Editing Education:", education); // Debug log
    
    // Check if this education has a custom degree type
    const hasCustomDegreeType = education.customDegreeType && education.customDegreeType !== "";
    const degreeTypeId = education.degreeType?._id || education.degreeType;
    
    // Check if it's a custom degree type (not in predefined list)
    const isCustomInDatabase = !degreeTypes.some(type => type._id === degreeTypeId) && 
                               education.degreeType && 
                               education.degreeType !== "other";

    if (hasCustomDegreeType || isCustomInDatabase) {
        // If it's a custom degree type
        setShowCustomDegreeType(true);
        setEducationFormData({
            degreeLevel: education.degreeLevel?._id || education.degreeLevel || "",
            degreeType: "other",
            customDegreeType: education.customDegreeType || 
                             education.degreeType?.name || 
                             education.degreeType || 
                             "",
            degreeTitle: education.degreeTitle || "",
            yearOfCompletion: education.yearOfCompletion || "",
            country: education.country || "",
            state: education.state || "",
            city: education.city || "",
        });
    } else {
        // If it's a predefined degree type
        setShowCustomDegreeType(false);
        setEducationFormData({
            degreeLevel: education.degreeLevel?._id || education.degreeLevel || "",
            degreeType: education.degreeType?._id || education.degreeType || "",
            customDegreeType: "",
            degreeTitle: education.degreeTitle || "",
            yearOfCompletion: education.yearOfCompletion || "",
            country: education.country || "",
            state: education.state || "",
            city: education.city || "",
        });
    }
    setOpenModal("education");
};

    // 🔹 NEW: Get degree type display name for rendering
    // const getDegreeTypeDisplayName = (education) => {
    //     if (education.customDegreeType) {
    //         return education.customDegreeType;
    //     }
    //     if (education.degreeType?.name) {
    //         return education.degreeType.name;
    //     }
    //     if (typeof education.degreeType === 'string' && education.degreeType !== 'other') {
    //         return education.degreeType;
    //     }
    //     return "Other";
    // };

    // 🔹 UPDATED: Get degree type display name with better fallbacks
const getDegreeTypeDisplayName = (education) => {
    // First check for custom degree type
    if (education.customDegreeType && education.customDegreeType !== "") {
        return education.customDegreeType;
    }
    
    // Then check for degree type object with name
    if (education.degreeType?.name) {
        return education.degreeType.name;
    }
    
    // Then check if degreeType is a string (could be "other" or custom value)
    if (typeof education.degreeType === 'string' && education.degreeType !== 'other') {
        return education.degreeType;
    }
    
    // If it's "other" but no custom value, or no degree type at all
    return "Not specified";
};

    const handleExperienceSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                jobTitle: experienceFormData.jobTitle,
                companyName: experienceFormData.companyName,
                country: experienceFormData.country,
                state: experienceFormData.state,
                city: experienceFormData.city,
                startDate: experienceFormData.startDate,
                endDate: experienceFormData.currentlyWorking ? null : experienceFormData.endDate,
                currentlyWorking: experienceFormData.currentlyWorking,
                description: experienceFormData.description,
            };

            let res;
            if (editingExperience) {
                res = await axios.put(`/build-Resume/experiences/${editingExperience._id}`, submitData);
                setEditingExperience(null);
            } else {
                res = await axios.post("/build-Resume/experiences", submitData);
            }

            setOpenModal(null);
            setExperienceFormData({
                jobTitle: "",
                companyName: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                description: "",
                country: "",
                state: "",
                city: "",
            });

            await fetchUserData();
        } catch (err) {
            console.error("❌ Error saving experience:", err.response?.data || err.message);
        }
    };

    // 🔹 NEW: Handle Languages Submit
    const handleLanguagesSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                languageName: languagesFormData.languageName,
                proficiency: languagesFormData.proficiency,
            };

            let res;
            if (editingLanguage) {
                res = await axios.put(`/build-Resume/languages/${editingLanguage._id}`, submitData);
                setEditingLanguage(null);
            } else {
                res = await axios.post("/build-Resume/languages", submitData);
            }

            if (res.data.success) {
                setOpenModal(null);
                setLanguagesFormData({
                    languageName: "",
                    proficiency: "",
                });
                await fetchUserLanguages();
            } else {
                alert(`Failed to save language: ${res.data.message}`);
            }
        } catch (err) {
            console.error("❌ Error saving language:", err.response?.data || err.message);
        }
    };

    // 🔹 NEW: Handle Skills Submit
    const handleSkillsSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                skillName: skillsFormData.skillName,
                experience: skillsFormData.experience,
            };

            let res;
            if (editingSkill) {
                res = await axios.put(`/build-Resume/skills/${editingSkill._id}`, submitData);
                setEditingSkill(null);
            } else {
                res = await axios.post("/build-Resume/skills", submitData);
            }

            setOpenModal(null);
            setSkillsFormData({
                skillName: "",
                experience: "",
            });
            await fetchUserSkills();
        } catch (err) {
            console.error("❌ Error saving skill:", err.response?.data || err.message);
        }
    };


    // 🔹 NEW: Handle degree type change with "Other" option
    const handleDegreeTypeChange = (e) => {
        const { value } = e.target;

        if (value === "other") {
            // If "Other" is selected, show custom input
            setShowCustomDegreeType(true);
            setEducationFormData(prev => ({
                ...prev,
                degreeType: "other",
                customDegreeType: ""
            }));
        } else {
            // If regular degree type is selected
            setShowCustomDegreeType(false);
            setEducationFormData(prev => ({
                ...prev,
                degreeType: value,
                customDegreeType: ""
            }));
        }
    };

    // 🔹 NEW: Handle custom degree type input change
    const handleCustomDegreeTypeChange = (e) => {
        const { value } = e.target;
        setCustomDegreeType(value);
        setEducationFormData(prev => ({
            ...prev,
            customDegreeType: value
        }));
    };
    // const handleEducationSubmit = async (e) => {
    //     e.preventDefault();
    //     try {

    //         let degreeTypeToSubmit = educationFormData.degreeType;
    //         let customDegreeTypeToSubmit = "";

    //         // If "Other" is selected, use the custom degree type
    //         if (educationFormData.degreeType === "other" && educationFormData.customDegreeType) {
    //             customDegreeTypeToSubmit = educationFormData.customDegreeType;
    //             // You can choose to create a new degree type in backend or store as custom
    //             // For now, we'll send both fields and let backend handle
    //         }

    //         const submitData = {
    //             degreeLevel: educationFormData.degreeLevel,
    //             // degreeType: educationFormData.degreeType,
    //             degreeType: educationFormData.degreeType === "other" ? "other" : educationFormData.degreeType,
    //             customDegreeType: customDegreeTypeToSubmit, // 🔹 NEW: Send custom degree type

    //             degreeTitle: educationFormData.degreeTitle,
    //             country: educationFormData.country,
    //             state: educationFormData.state,
    //             city: educationFormData.city,
    //             yearOfCompletion: educationFormData.yearOfCompletion,
    //         };

    //         let res;
    //         if (editingEducation) {
    //             res = await axios.put(`/build-Resume/educations/${editingEducation._id}`, submitData);
    //             setEditingEducation(null);
    //         } else {
    //             res = await axios.post("/build-Resume/educations", submitData);
    //         }

    //         setOpenModal(null);
    //         setEducationFormData({
    //             degreeLevel: "",
    //             degreeType: "",
    //             degreeTitle: "",
    //             yearOfCompletion: "",
    //             country: "",
    //             state: "",
    //             city: "",
    //             customDegreeType: "" // 🔹 NEW: Reset custom degree type
    //         });
    //          setShowCustomDegreeType(false);
    //         setCustomDegreeType("");

    //         await fetchUserData();
    //     } catch (err) {
    //         console.error("❌ Error saving education:", err.response?.data || err.message);
    //     }
    // };

    // 🔹 NEW: Delete experience
    
    // 🔹 UPDATED: Handle Education Submit with better data handling
const handleEducationSubmit = async (e) => {
    e.preventDefault();
    try {
        let submitData = {
            degreeLevel: educationFormData.degreeLevel,
            degreeTitle: educationFormData.degreeTitle,
            country: educationFormData.country,
            state: educationFormData.state,
            city: educationFormData.city,
            yearOfCompletion: educationFormData.yearOfCompletion,
        };

        // Handle degree type based on selection
        if (educationFormData.degreeType === "other" && educationFormData.customDegreeType) {
            // If "Other" is selected with custom value
            submitData.degreeType = "other";
            submitData.customDegreeType = educationFormData.customDegreeType;
        } else if (educationFormData.degreeType === "other" && !educationFormData.customDegreeType) {
            // If "Other" is selected but no custom value
            alert("Please specify your degree type");
            return;
        } else {
            // If predefined degree type is selected
            submitData.degreeType = educationFormData.degreeType;
            submitData.customDegreeType = ""; // Clear custom degree type
        }

        console.log("Submitting Education Data:", submitData); // Debug log

        let res;
        if (editingEducation) {
            res = await axios.put(`/build-Resume/educations/${editingEducation._id}`, submitData);
            setEditingEducation(null);
        } else {
            res = await axios.post("/build-Resume/educations", submitData);
        }

        if (res.data.success) {
            setOpenModal(null);
            setEducationFormData({
                degreeLevel: "",
                degreeType: "",
                customDegreeType: "",
                degreeTitle: "",
                yearOfCompletion: "",
                country: "",
                state: "",
                city: "",
            });
            setShowCustomDegreeType(false);
            setCustomDegreeType("");
            await fetchUserData();
        } else {
            alert(`Failed to save education: ${res.data.message}`);
        }
    } catch (err) {
        console.error("❌ Error saving education:", err.response?.data || err.message);
        alert("Error saving education. Please try again.");
    }
};
    
    const handleDeleteExperience = async (id) => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
            try {
                await axios.delete(`/build-Resume/experiences/${id}`);
                await fetchUserData();
            } catch (error) {
                console.error("Error deleting experience:", error);
            }
        }
    };

    // 🔹 NEW: Delete language
    const handleDeleteLanguage = async (id) => {
        if (window.confirm("Are you sure you want to delete this language?")) {
            try {
                await axios.delete(`/build-Resume/languages/${id}`);
                await fetchUserLanguages();
            } catch (error) {
                console.error("Error deleting language:", error);
            }
        }
    };

    // 🔹 NEW: Delete skill
    const handleDeleteSkill = async (id) => {
        if (window.confirm("Are you sure you want to delete this skill?")) {
            try {
                await axios.delete(`/build-Resume/skills/${id}`);
                await fetchUserSkills();
            } catch (error) {
                console.error("Error deleting skill:", error);
            }
        }
    };

    // 🔹 NEW: Delete education
    const handleDeleteEducation = async (id) => {
        if (window.confirm("Are you sure you want to delete this education?")) {
            try {
                await axios.delete(`/build-Resume/educations/${id}`);
                await fetchUserData();
            } catch (error) {
                console.error("Error deleting education:", error);
            }
        }
    };

    const handleClose = () => {
        setOpenModal(null);
        setEditingExperience(null);
        setEditingEducation(null);
        setEditingSkill(null);
        setEditingLanguage(null);
        setShowCustomDegreeType(false);
        setCustomDegreeType("");

        // Reset forms
        setExperienceFormData({
            jobTitle: "",
            companyName: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            description: "",
            country: "",
            state: "",
            city: "",
        });

        setEducationFormData({
            degreeLevel: "",
            degreeType: "",
            customDegreeType: "",
            degreeTitle: "",
            yearOfCompletion: "",
            country: "",
            state: "",
            city: "",
        });

        setSkillsFormData({
            skillName: "",
            experience: "",
        });

        setLanguagesFormData({
            languageName: "",
            proficiency: "",
        });
    };

    // ✅ Fetch Degree Level & Type on mount
    useEffect(() => {
        axios
            .get("/degree-Level-Category/active")
            .then((res) => {
                setDegreeLevels(res.data.data || res.data || []);
            })
            .catch((err) => console.error("❌ Error fetching degree levels:", err));

        axios
            .get("/degree-Type-Category/active")
            .then((res) => {
                setDegreeTypes(res.data.data || res.data || []);
                console.log(res.data);

            })
            .catch((err) => console.error("❌ Error fetching degree types:", err));

        // 🔹 NEW: Fetch user data on component mount
        fetchUserData();
    }, []);

    useEffect(() => {
        // Fetch countries
        axios.get("/country")
            .then((res) => {
                setCountries(res.data.country || []);
            })
            .catch(err => console.error("Failed to fetch countries:", err));
    }, []);

    // Effect for Experience Form States
    useEffect(() => {
        if (experienceFormData.country) {
            axios
                .get(`/state/country/${experienceFormData.country}`)
                .then((res) => {
                    setStates(res.data.data || []);
                })
                .catch((err) => console.error("❌ Error fetching states:", err));
        } else {
            setStates([]);
        }
    }, [experienceFormData.country]);

    // Effect for Experience Form Cities
    useEffect(() => {
        if (experienceFormData.state) {
            axios
                .get(`/city/state/${experienceFormData.state}`)
                .then((res) => {
                    setCities(res.data.data || []);
                })
                .catch((err) => console.error("❌ Error fetching cities:", err));
        } else {
            setCities([]);
        }
    }, [experienceFormData.state]);

    // 🔹 NEW: Effect for Education Form States
    useEffect(() => {
        if (educationFormData.country) {
            axios
                .get(`/state/country/${educationFormData.country}`)
                .then((res) => {
                    setEducationStates(res.data.data || []);
                })
                .catch((err) => console.error("❌ Error fetching education states:", err));
        } else {
            setEducationStates([]);
        }
    }, [educationFormData.country]);

    // 🔹 NEW: Effect for Education Form Cities
    useEffect(() => {
        if (educationFormData.state) {
            axios
                .get(`/city/state/${educationFormData.state}`)
                .then((res) => {
                    setEducationCities(res.data.data || []);
                })
                .catch((err) => console.error("❌ Error fetching education cities:", err));
        } else {
            setEducationCities([]);
        }
    }, [educationFormData.state]);

    // 🔹 NEW: Effect to fetch location names when experiences/educations change
    useEffect(() => {
        if (experiences.length > 0 || educations.length > 0) {
            fetchLocationNames();
        }
    }, [experiences, educations]);

    // 🔹 NEW: Render experience item with active/inactive toggle
    const renderExperienceItem = (experience, location) => (
        <div key={experience._id} className={`relative pl-6 mb-6 border-l-2 ${experience.isActive ? 'border-gray-200' : 'border-red-200'} ${!experience.isActive ? 'opacity-60' : ''}`}>
            <div className={`absolute left-0 top-2 w-3 h-3 rounded-full ${experience.isActive ? 'bg-gray-300' : 'bg-red-300'}`}></div>

            {/* Status Badge */}
            <div className="absolute top-2 right-80">
                <span className={`px-2 py-1 rounded-full text-xs font-medium  ${experience.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {experience.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <h3 className="text-md sm:text-[20px] font-bold text-gray-800">
                {experience.jobTitle}
            </h3>

            <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                <FaMapMarkerAlt />
                <span>{getLocationString(experience, location)}</span>
            </div>

            <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                <FaBuilding />
                <span>{experience.companyName}</span>
            </div>

            <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                <FaCalendarAlt />
                <span>
                    From <strong>{formatDate(experience.startDate)}</strong> -{" "}
                    <strong>
                        {experience.currentlyWorking
                            ? "Present"
                            : formatDate(experience.endDate)}
                    </strong>
                </span>
            </div>

            {experience.description && (
                <p className="text-md text-gray-700 mt-2">
                    {experience.description}
                </p>
            )}

            <div className="absolute top-2 right-6 flex gap-3">
                {/* Toggle Status Button */}
                <button
                    onClick={() => toggleExperienceStatus(experience._id)}
                    className={`p-1 rounded ${experience.isActive
                        ? 'text-green-600 hover:text-green-800'
                        : 'text-red-600 hover:text-red-800'
                        }`}
                    title={experience.isActive ? 'Deactivate' : 'Activate'}
                >
                    {experience.isActive ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>

                <FaEdit
                    className="cursor-pointer text-md hover:text-blue-600"
                    size={18}
                    onClick={() => handleEditExperience(experience)}
                />
                <FaTimes
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    size={18}
                    onClick={() => handleDeleteExperience(experience._id)}
                />
            </div>
        </div>
    );

    // 🔹 NEW: Render education item with active/inactive toggle
    const renderEducationItem = (education, location) => (
        <div key={education._id} className={`relative pl-6 mb-6 border-l-2 ${education.isActive ? 'border-gray-200' : 'border-red-200'} ${!education.isActive ? 'opacity-60' : ''}`}>
            <div className={`absolute left-0 top-2 w-3 h-3 rounded-full ${education.isActive ? 'bg-gray-300' : 'bg-red-300'}`}></div>

            {/* Status Badge */}
            <div className="absolute top-2 right-80">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${education.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {education.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <h3 className="text-md sm:text-[20px] font-bold text-gray-800">
                {education.degreeLevel?.name} - {education.degreeTitle}
            </h3>

            <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                <span>
                    {education.yearOfCompletion} — {getLocationString(education, location)}
                </span>
            </div>

            <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                <FaGraduationCap />
                <span>{getDegreeTypeDisplayName(education)}</span>
            </div>

            <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                <FaMapMarkerAlt />
                <span>{getLocationString(education, location)}</span>
            </div>

            {education.institute && (
                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                    <FaSchool />
                    <span>{education.institute}</span>
                </div>
            )}

            <div className="absolute top-2 right-6 flex gap-3">
                {/* Toggle Status Button */}
                <button
                    onClick={() => toggleEducationStatus(education._id)}
                    className={`p-1 rounded ${education.isActive
                        ? 'text-green-600 hover:text-green-800'
                        : 'text-red-600 hover:text-red-800'
                        }`}
                    title={education.isActive ? 'Deactivate' : 'Activate'}
                >
                    {education.isActive ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>

                <FaEdit
                    className="cursor-pointer hover:text-blue-600"
                    size={18}
                    onClick={() => handleEditEducation(education)}
                />
                <FaTimes
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    size={18}
                    onClick={() => handleDeleteEducation(education._id)}
                />
            </div>
        </div>
    );

    // 🔹 NEW: Render skill item with active/inactive toggle
    const renderSkillItem = (skill, index) => (
        <div
            key={skill._id}
            className={`flex justify-between items-center px-4 py-4 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors duration-200 ${!skill.isActive ? 'opacity-60' : ''}`}
        >
            <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                    {skill.skillName}
                </h3>
            </div>
            <div className="flex-1 flex items-center gap-2">
                <span className="text-gray-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                    {skill.experience}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${skill.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {skill.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div className="flex gap-4">
                {/* Toggle Status Button */}
                <button
                    onClick={() => toggleSkillStatus(skill._id)}
                    className={`p-1 rounded ${skill.isActive
                        ? 'text-green-600 hover:text-green-800'
                        : 'text-red-600 hover:text-red-800'
                        }`}
                    title={skill.isActive ? 'Deactivate' : 'Activate'}
                >
                    {skill.isActive ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>

                <FaEdit
                    className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    size={16}
                    onClick={() => handleEditSkill(skill)}
                />
                <FaTimes
                    className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors duration-200"
                    size={16}
                    onClick={() => handleDeleteSkill(skill._id)}
                />
            </div>
        </div>
    );

    // 🔹 NEW: Render language item with active/inactive toggle
    const renderLanguageItem = (language, index) => (
        <div
            key={language._id}
            className={`flex justify-between items-center px-4 py-4 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors duration-200 ${!language.isActive ? 'opacity-60' : ''}`}
        >
            <div className="flex items-center gap-3 flex-1">
                <FaLanguage className="text-blue-500" />
                <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {language.languageName}
                    </h3>
                </div>
            </div>
            <div className="flex-1 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${language.proficiency === 'Native'
                    ? 'bg-green-100 text-green-800'
                    : language.proficiency === 'Expert'
                        ? 'bg-blue-100 text-blue-800'
                        : language.proficiency === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                    {language.proficiency}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${language.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {language.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div className="flex gap-4">
                {/* Toggle Status Button */}
                <button
                    onClick={() => toggleLanguageStatus(language._id)}
                    className={`p-1 rounded ${language.isActive
                        ? 'text-green-600 hover:text-green-800'
                        : 'text-red-600 hover:text-red-800'
                        }`}
                    title={language.isActive ? 'Deactivate' : 'Activate'}
                >
                    {language.isActive ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>

                <FaEdit
                    className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    size={16}
                    onClick={() => handleEditLanguage(language)}
                />
                <FaTimes
                    className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors duration-200"
                    size={16}
                    onClick={() => handleDeleteLanguage(language._id)}
                />
            </div>
        </div>
    );

    // Modal content based on type
    const renderModalContent = () => {
        switch (openModal) {
            case "experience":
                return (
                    <div className="relative bg-white rounded-lg w-full max-w-4xl mx-auto max-h-[90vh] p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                            {editingExperience ? "Edit Experience" : "Add Experience"}
                        </h2>

                        <form className="space-y-5" onSubmit={handleExperienceSubmit}>
                            {/* Job Title */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={experienceFormData.jobTitle}
                                    onChange={handleExperienceChange}
                                    placeholder="Enter your job title"
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={experienceFormData.companyName}
                                    onChange={handleExperienceChange}
                                    placeholder="Enter company name"
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block font-medium mb-1">Country *</label>
                                    <select
                                        name="country"
                                        value={experienceFormData.country || ""}
                                        onChange={handleExperienceChange}
                                        className="p-3 w-full border rounded-md"
                                        required
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
                                        value={experienceFormData.state || ""}
                                        onChange={handleExperienceChange}
                                        className="p-3 w-full border rounded-md"
                                        disabled={!experienceFormData.country}
                                        required
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
                                        value={experienceFormData.city || ""}
                                        onChange={handleExperienceChange}
                                        className="p-3 w-full border rounded-md"
                                        disabled={!experienceFormData.state}
                                        required
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

                            {/* Start Date */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Experience Start Date *
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={experienceFormData.startDate}
                                    onChange={handleExperienceChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Currently Working */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="currentlyWorking"
                                    name="currentlyWorking"
                                    checked={experienceFormData.currentlyWorking}
                                    onChange={handleExperienceChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="currentlyWorking" className="text-gray-700">
                                    Currently Working?
                                </label>
                            </div>

                            {/* End Date */}
                            {!experienceFormData.currentlyWorking && (
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">
                                        Experience End Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={experienceFormData.endDate}
                                        onChange={handleExperienceChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required={!experienceFormData.currentlyWorking}
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Experience Description
                                </label>
                                <textarea
                                    name="description"
                                    value={experienceFormData.description}
                                    onChange={handleExperienceChange}
                                    placeholder="Describe your role and responsibilities"
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                ></textarea>
                            </div>

                            <div className="text-center pt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all duration-200"
                                >
                                    {editingExperience ? "Update Experience" : "Save Experience"}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case "education":
                return (
                    <div className="relative bg-white rounded-lg w-full max-w-4xl mx-auto max-h-[90vh] p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingEducation ? "Edit Education" : "Add Education"}
                        </h2>
                        <form className="space-y-4" onSubmit={handleEducationSubmit}>
                            {/* Degree Level */}
                            <div>
                                <label htmlFor="degreeLevel" className="block text-gray-700 font-medium mb-1">
                                    Degree Level *
                                </label>
                                <select
                                    id="degreeLevel"
                                    name="degreeLevel"
                                    value={educationFormData.degreeLevel}
                                    onChange={handleEducationChange}
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Degree Level</option>
                                    {degreeLevels.map((level) => (
                                        <option key={level._id} value={level._id}>
                                            {level.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Degree Type */}
                            <div>
                                <label htmlFor="degreeType" className="block text-gray-700 font-medium mb-1">
                                    Degree Type *
                                </label>
                                <select
                                    id="degreeType"
                                    name="degreeType"
                                    value={educationFormData.degreeType}
                                    onChange={handleDegreeTypeChange} // 🔹 UPDATED: Use new handler
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Degree Type</option>
                                    {degreeTypes.map((type) => (
                                        <option key={type._id} value={type._id}>
                                            {type.name}
                                        </option>
                                    ))}
                                    <option value="other">Other</option> {/* 🔹 NEW: Other option */}
                                </select>
                            </div>

                            {/* 🔹 NEW: Custom Degree Type Input - Show only when "Other" is selected */}
                            {showCustomDegreeType && (
                                <div>
                                    <label htmlFor="customDegreeType" className="block text-gray-700 font-medium mb-1">
                                        Specify Degree Type *
                                    </label>
                                    <input
                                        id="customDegreeType"
                                        name="customDegreeType"
                                        type="text"
                                        value={educationFormData.customDegreeType || ""}
                                        onChange={handleCustomDegreeTypeChange}
                                        placeholder="Enter your degree type (e.g., Diploma in Computer Science)"
                                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required={showCustomDegreeType}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Please specify your degree type if it's not in the list above
                                    </p>
                                </div>
                            )}

                            {/* Degree Title */}
                            <div>
                                <label htmlFor="degreeTitle" className="block text-gray-700 font-medium mb-1">
                                    Degree Title *
                                </label>
                                <input
                                    id="degreeTitle"
                                    name="degreeTitle"
                                    type="text"
                                    value={educationFormData.degreeTitle || ""}
                                    onChange={handleEducationChange}
                                    placeholder="Degree Title"
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                {/* Country */}
                                <div>
                                    <label className="block font-medium mb-1">Country *</label>
                                    <select
                                        name="country"
                                        value={educationFormData.country || ""}
                                        onChange={handleEducationChange}
                                        className="p-3 w-full border rounded-md"
                                        required
                                    >
                                        <option value="">-- Select Country --</option>
                                        {countries.map((country) => (
                                            <option key={country._id} value={country.id || country._id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block font-medium mb-1">State *</label>
                                    <select
                                        name="state"
                                        value={educationFormData.state || ""}
                                        onChange={handleEducationChange}
                                        className="p-3 w-full border rounded-md"
                                        disabled={!educationFormData.country}
                                        required
                                    >
                                        <option value="">-- Select State --</option>
                                        {educationStates.map((state) => (
                                            <option key={state._id} value={state.id || state._id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block font-medium mb-1">City *</label>
                                    <select
                                        name="city"
                                        value={educationFormData.city || ""}
                                        onChange={handleEducationChange}
                                        className="p-3 w-full border rounded-md"
                                        disabled={!educationFormData.state}
                                        required
                                    >
                                        <option value="">-- Select City --</option>
                                        {educationCities.map((city) => (
                                            <option key={city._id} value={city.id || city._id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Year of Completion */}
                            <div>
                                <label htmlFor="yearOfCompletion" className="block text-gray-700 font-medium mb-1">
                                    Year of Completion *
                                </label>
                                <select
                                    id="yearOfCompletion"
                                    name="yearOfCompletion"
                                    value={educationFormData.yearOfCompletion || ""}
                                    onChange={handleEducationChange}
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 30 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center pt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all duration-200"
                                >
                                    {editingEducation ? "Update Education" : "Save Education"}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case "skills":
                return (
                    <div className="relative bg-white rounded-lg w-full max-w-2xl mx-auto max-h-[90vh] p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                            {editingSkill ? "Edit Skill" : "Add Skill"}
                        </h2>

                        <form className="space-y-5" onSubmit={handleSkillsSubmit}>
                            {/* Skill Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Skill Name *
                                </label>
                                <input
                                    type="text"
                                    name="skillName"
                                    value={skillsFormData.skillName}
                                    onChange={handleSkillsChange}
                                    placeholder="Enter skill name (e.g., JavaScript, React, Photoshop)"
                                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Experience *
                                </label>
                                <select
                                    name="experience"
                                    value={skillsFormData.experience}
                                    onChange={handleSkillsChange}
                                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Experience Level</option>
                                    <option value="Less than 1 year">Less than 1 year</option>
                                    <option value="1-2 years">1-2 years</option>
                                    <option value="3-5 years">3-5 years</option>
                                    <option value="5-7 years">5-7 years</option>
                                    <option value="7-10 years">7-10 years</option>
                                    <option value="10+ years">10+ years</option>
                                    <option value="15+ years">15+ years</option>
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select your proficiency level with this skill
                                </p>
                            </div>

                            <div className="text-center pt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                                >
                                    {editingSkill ? "Update Skill" : "Save Skill"}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case "languages":
                return (
                    <div className="relative bg-white rounded-lg w-full max-w-2xl mx-auto max-h-[90vh] p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                            {editingLanguage ? "Edit Language" : "Add Language"}
                        </h2>
                        <form className="space-y-5" onSubmit={handleLanguagesSubmit}>
                            {/* Language Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Language Name *
                                </label>
                                <input
                                    type="text"
                                    name="languageName"
                                    value={languagesFormData.languageName}
                                    onChange={handleLanguagesChange}
                                    placeholder="Enter language name (e.g., English, Spanish, French)"
                                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Proficiency */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Proficiency Level *
                                </label>
                                <select
                                    name="proficiency"
                                    value={languagesFormData.proficiency}
                                    onChange={handleLanguagesChange}
                                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Proficiency Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                    <option value="Native">Native</option>
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select your proficiency level in this language
                                </p>
                            </div>

                            <div className="text-center pt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                                >
                                    {editingLanguage ? "Update Language" : "Save Language"}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    // Modal size based on type
    const getModalSize = () => {
        return (openModal === "experience" || openModal === "education") ? "max-w-4xl" : "max-w-md";
    };

    return (
        <Layout>
            <div className="w-full bg-[f6f8fd] rounded shadow text-sm sm:text-base">
                <h2 className="text-xl sm:text-[32px] font-semibold mb-10 text-center">
                    Build Your Resume
                </h2>

                {/* ✅ Attached CV Section */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg sm:text-[30px] font-semibold text-gray-800">
                            Attached CV
                        </h2>
                        <button className="text-blue-600 text-xl hover:text-blue-800">+</button>
                    </div>

                    <div className="overflow-x-auto bg-white p-4 rounded shadow">
                        <DataTable
                            columns={columns}
                            data={data}
                            responsive
                            highlightOnHover
                            striped
                            customStyles={{
                                headCells: {
                                    style: {
                                        fontWeight: "bold",
                                        backgroundColor: "#f3f4f6",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* ✅ Experience Section */}
                <div className="pt-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">
                            Experience
                        </h2>
                        <FaPlus
                            className="text-blue-500 cursor-pointer text-xl"
                            onClick={() => setOpenModal("experience")}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-4">Loading experiences...</div>
                    ) : experiences.length === 0 ? (
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
                            <p className="text-gray-500">No experiences added yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 w-full relative mb-4">
                            {experiences.map((experience) => {
                                const location = experienceLocationNames[experience._id] || {};
                                return renderExperienceItem(experience, location);
                            })}
                        </div>
                    )}
                </div>

                {/* ✅ Education Section */}
                <div className="pt-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">
                            Education
                        </h2>
                        <FaPlus
                            className="text-blue-500 cursor-pointer text-xl"
                            onClick={() => setOpenModal("education")}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-4">Loading educations...</div>
                    ) : educations.length === 0 ? (
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
                            <p className="text-gray-500">No educations added yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 w-full relative mb-4">
                            {educations.map((education) => {
                                const location = educationLocationNames[education._id] || {};
                                return renderEducationItem(education, location);
                            })}
                        </div>
                    )}
                </div>

                {/* ✅ Skills Section */}
                <div className="pt-6">
                    <div className="w-full mx-auto mt-10 border rounded-lg shadow bg-white">
                        <div className="p-4 flex justify-between items-center">
                            <h2 className="text-xl sm:text-[28px] font-semibold text-gray-800">
                                Skills
                            </h2>
                            <button
                                className="text-blue-500 text-2xl font-bold hover:text-blue-700"
                                onClick={() => setOpenModal("skills")}
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {skills.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">No skills added yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {skills.map((skill, index) => renderSkillItem(skill, index))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ✅ Languages Section */}
                <div className="pt-6">
                    <div className="w-full mx-auto mt-10 border rounded-lg shadow bg-white">
                        <div className="p-4 flex justify-between items-center">
                            <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">
                                Languages
                            </h2>
                            <button
                                className="text-blue-500 text-2xl font-bold hover:text-blue-700"
                                onClick={() => setOpenModal("languages")}
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {languages.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">No languages added yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {languages.map((language, index) => renderLanguageItem(language, index))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ✅ MODAL SECTION - Fixed */}
                {openModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className={`bg-white rounded-lg p-6 w-full ${getModalSize()} relative max-h-[90vh] overflow-y-auto`}>
                            {/* Close Button - Top Right */}
                            <button
                                onClick={handleClose}
                                className="absolute top-3 right-3 text-gray-500 hover:text-black z-10"
                            >
                                <FaTimes size={20} />
                            </button>

                            {/* Modal Content */}
                            {renderModalContent()}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}