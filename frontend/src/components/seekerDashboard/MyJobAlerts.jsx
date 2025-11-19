import { useState, useEffect } from "react"
import { FaTrashAlt } from "react-icons/fa";
import Layout from "./partials/layout";
import Select from "react-select";
import axios from '../../utils/axios.js'
import Swal from "sweetalert2";

export default function MYJobAlerts() {
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [careerLevels, setCareerLevels] = useState([]);
  const [buildSkills, setBuildSkills] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alerts, setAlerts] = useState([]); // Changed from initialAlerts to empty array
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    country: "",
    state: "",
    city: "",
    careerLevel: "",
    functionalArea: "",
    skills: [],
    experience: "",
    mode: "",
  });


  // Format skills for react-select
  const skillsOptions = Array.isArray(buildSkills)
    ? buildSkills.map(skill => ({
      value: skill._id,
      label: skill.name   
    }))
    : [];

  // Fetch job alerts from backend
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get('/job-alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(data);


      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      Swal.fire("Error!", "Failed to load job alerts", "error");
    }
  };

  useEffect(() => {
    fetchAlerts(); // Fetch alerts when component mounts
  }, []);

  useEffect(() => {
    const fetchBuildSkills = async () => {
      try {
        const { data } = await axios.get('/skills-categories/active');
        // Ensure data is an array before setting state
        // console.log(data);
        console.log(data);

        if (data && data.success && Array.isArray(data.data)) {
          setBuildSkills(data.data);
        } else if (Array.isArray(data)) {
          setBuildSkills(data);
        } else if (data && Array.isArray(data.data)) {
          setBuildSkills(data.data);
        } else if (data && Array.isArray(data.skills)) {
          setBuildSkills(data.skills);
        } else {
          console.warn("Skills data is not in expected format:", data);
          setBuildSkills([]);
        }
      } catch (err) {
        console.error("Failed to fetch Build Skills:", err);
        setBuildSkills([]);
      }
    }
    fetchBuildSkills();
  }, [])

  useEffect(() => {
    const fetchFunctionalAreas = async () => {
      try {
        const { data } = await axios.get("/functionalArea-Category/active");
        setFunctionalAreas(Array.isArray(data) ? data : []);
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
        setCareerLevels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch career levels:", err);
        setCareerLevels([]);
      }
    };
    fetchCareerLevels();
  }, []);

  useEffect(() => {
    // Fetch countries
    axios.get("/country")
      .then((res) => {
        // console.log("Countries response:", res.data);
        // Handle different possible response structures
        const countriesData = res.data.country || res.data.data || res.data || [];
        setCountries(Array.isArray(countriesData) ? countriesData : []);
      })
      .catch(err => console.error("Failed to fetch countries:", err));
  }, []);

  useEffect(() => {
    if (formData.country) {
      axios
        .get(`/state/country/${formData.country}`)
        .then((res) => {
          console.log("States response:", res.data);
          const statesData = res.data.data || res.data || [];
          setStates(Array.isArray(statesData) ? statesData : []);
        })
        .catch((err) => console.error("❌ Error fetching states:", err));
    } else {
      setStates([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      axios
        .get(`/city/state/${formData.state}`)
        .then((res) => {
          console.log("Cities response:", res.data);
          const citiesData = res.data.data || res.data || [];
          setCities(Array.isArray(citiesData) ? citiesData : []);
        })
        .catch((err) => console.error("❌ Error fetching cities:", err));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset dependent dropdowns properly
    if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
        state: "",
        city: "",
      }));
    } else if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  // Handle skills selection - FIXED: Now sends array of skills
  const handleSkillsChange = (selected) => {
    setSelectedSkills(selected || []);
    const skillIds = selected ? selected.map(skill => skill.value) : [];
    setFormData(prev => ({
      ...prev,
      skills: skillIds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Alert:", formData);
    console.log("Selected Skills:", selectedSkills);

    try {
      const token = localStorage.getItem("token");

      // Prepare data for API - convert location fields to numbers as required by backend
      const submitData = {
        ...formData,
        country: Number(formData.country),
        state: Number(formData.state),
        city: Number(formData.city),
        // If skills should be a single ObjectId (not array), take the first one
        skills: formData.skills // Now sends the entire array

      };

      const res = await axios.post('/job-alerts', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Alert Created:", res.data);

      // Refresh the alerts list
      await fetchAlerts();
      setShowModal(false);
      resetForm();

      Swal.fire("Success!", "Job alert created successfully!", "success");
    } catch (error) {
      console.error("Error creating alert:", error);
      Swal.fire("Error!", error.response?.data?.message || "Failed to create alert", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      country: "",
      state: "",
      city: "",
      careerLevel: "",
      functionalArea: "",
      skills: [],
      experience: "",
      mode: "",
    });
    setSelectedSkills([]);
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/job-alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from local state
      setAlerts(prev => prev.filter(alert => alert._id !== alertId));
      Swal.fire("Deleted!", "Job alert deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting alert:", error);
      Swal.fire("Error!", "Failed to delete alert", "error");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="p-6 w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-[30px] font-semibold">Manage Jobs Alerts</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
          >
            Create Alert
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 font-medium text-[18px]">Alert Title</th>
                <th className="p-3 font-medium text-[18px]">Mode</th>
                <th className="p-3 font-medium text-[18px]">Skills</th>
                <th className="p-3 font-medium text-[18px]">Created On</th>
                <th className="p-3 font-medium text-[18px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <tr key={alert._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{alert.jobTitle}</td>
                    <td className="p-3">{alert.mode}</td>
                    <td className="p-3">
                      {alert.skills && alert.skills.length > 0
                        ? alert.skills.map(skill => skill.skillName).join(', ')
                        : 'No skills specified'}
                    </td>

                    <td className="p-3">{formatDate(alert.createdAt)}</td>
                    <td
                      className="p-3 text-red-600 font-medium flex items-center gap-1 cursor-pointer hover:underline"
                      onClick={() => handleDeleteAlert(alert._id)}
                    >
                      <FaTrashAlt className="text-red-600" /> Delete
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">
                    No job alerts found. Create your first alert!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Alert Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 relative overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Create Job Alert
              </h2>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    placeholder="Enter job title"
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Location Fields */}
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Country</label>
                    <select
                      name="country"
                      value={formData.country || ""}
                      onChange={handleChange}
                      className="p-3 w-full border rounded-md"
                      required
                    >
                      <option value="">-- Select Country --</option>
                      {Array.isArray(countries) && countries.map((country) => (
                        <option key={country._id} value={country.id || country._id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">State</label>
                    <select
                      name="state"
                      value={formData.state || ""}
                      onChange={handleChange}
                      className="p-3 w-full border rounded-md"
                      disabled={!formData.country}
                      required
                    >
                      <option value="">-- Select State --</option>
                      {Array.isArray(states) && states.map((state) => (
                        <option key={state._id} value={state.id || state._id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">City</label>
                    <select
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      className="p-3 w-full border rounded-md"
                      disabled={!formData.state}
                      required
                    >
                      <option value="">-- Select City --</option>
                      {Array.isArray(cities) && cities.map((city) => (
                        <option key={city._id} value={city.id || city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Career Level + Functional Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-medium mb-1">Career Level</label>
                    <select
                      name="careerLevel"
                      value={formData.careerLevel || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-3"
                    >
                      <option value="">Select Career Level</option>
                      {Array.isArray(careerLevels) && careerLevels.map((career) => (
                        <option key={career._id} value={career._id}>
                          {career.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Functional Area</label>
                    <select
                      name="functionalArea"
                      value={formData.functionalArea || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-3"
                    >
                      <option value="">Select Functional Area</option>
                      {Array.isArray(functionalAreas) && functionalAreas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Skills + Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Skills</label>
                    <Select
                      options={skillsOptions}
                      value={selectedSkills}
                      onChange={handleSkillsChange}
                      isMulti
                      placeholder="Select Required Skills"
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Experience</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- Select Experience --</option>
                      <option value="Fresher">Fresher</option>
                      <option value="0-1 Years">0 - 1 Years</option>
                      <option value="1-3 Years">1 - 3 Years</option>
                      <option value="3-5 Years">3 - 5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                </div>

                {/* Mode */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Select Mode --</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200"
                  >
                    Save Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}