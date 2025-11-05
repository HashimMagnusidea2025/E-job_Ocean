import React, { useEffect, useState } from "react";
import axios from "../../../../utils/axios"; // Adjust path if needed
import Navbar from '../../navbar/navbar';
import Footer from '../../footer/footer';
const CaFreshersForm = () => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    jobProfile: "",
    jobLocation: "",
    passingMonth: "July",
    passingYear: "2025",
    ResumeUpload: null,
  });

  const [filterOptions, setFilterOptions] = useState({
    Qualification: [],
    Experience: [],
    Profile: [],
    Location: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [filtersRes, locationRes] = await Promise.all([
          axios.get("/professional-categories/professional"),
          axios.get("/location"),
        ]);

        const activeLocations = locationRes.data.location
          .filter((loc) => loc.status === "active")
          .map((loc) => loc.name);

        setFilterOptions({
          Qualification: filtersRes.data.Qualification || [],
          Experience: filtersRes.data.Experience || [],
          Profile: filtersRes.data.Profile || [],
          Location: activeLocations,
        });

        setFormData((prev) => ({
          ...prev,
          qualification: filtersRes.data.Qualification?.[0] || "",
          experience: filtersRes.data.Experience?.[0] || "",
        }));
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "document" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.jobProfile) newErrors.jobProfile = "Profile is required";
    if (!formData.jobLocation) newErrors.jobLocation = "Location is required";
    if (!formData.passingMonth) newErrors.passingMonth = "Month is required";
    if (!formData.passingYear) newErrors.passingYear = "Year is required";
    // if (!formData.ResumeUpload) newErrors.ResumeUpload = "Resume is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );

      await axios.post("/CA-Fresher", payload);
      alert("Form submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        qualification: filterOptions.Qualification?.[0] || "",
        experience: filterOptions.Experience?.[0] || "",
        jobProfile: "",
        jobLocation: "",
        passingMonth: "July",
        passingYear: "2025",
        ResumeUpload: null,
      });
      setErrors({});
      document.querySelector('input[name="document"]').value = "";
    } catch (err) {
      console.error("Submit error:", err);
      alert("Submission failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-10">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          CA Freshers
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded px-3 py-2"
              value={formData.phone}
              onChange={(e) => {
                const { value } = e.target;
                // allow only numbers and max 10 digits
                if (/^\d{0,10}$/.test(value)) {
                  setFormData({ ...formData, phone: value });
                }
              }}
              maxLength={10}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Qualification */}
          <div>
            <label className="block mb-1 text-sm font-medium">Qualification</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-50"
            >
              <option value="">-- Select Qualification --</option>
              {filterOptions.Qualification.map((q, i) => (
                <option key={i} value={q}>{q}</option>
              ))}
            </select>
            {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification}</p>}
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-1 text-sm font-medium">Experience</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-50"
            >
              <option value="">-- Select Experience --</option>
              {filterOptions.Experience.map((exp, i) => (
                <option key={i} value={exp}>{exp}</option>
              ))}
            </select>
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
          </div>

          {/* Job Profile */}
          <div>
            <label className="block mb-1 text-sm font-medium">Preferred Job Profile</label>
            <select
              name="jobProfile"
              value={formData.jobProfile}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-50"
            >
              <option value="">-- Select Profile --</option>
              {filterOptions.Profile.map((profile, i) => (
                <option key={i} value={profile}>{profile}</option>
              ))}
            </select>
            {errors.jobProfile && <p className="text-red-500 text-sm">{errors.jobProfile}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 text-sm font-medium">Preferred Job Location</label>
            <select
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-50"
            >
              <option value="">-- Select Location --</option>
              {filterOptions.Location.map((loc, i) => (
                <option key={i} value={loc}>{loc}</option>
              ))}
            </select>
            {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
          </div>

          {/* Passing Month */}
          <div>
            <label className="block mb-1 text-sm font-medium">Passing Month</label>
            <select
              name="passingMonth"
              value={formData.passingMonth}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            {errors.passingMonth && <p className="text-red-500 text-sm">{errors.passingMonth}</p>}
          </div>

          {/* Passing Year */}
          <div>
            <label className="block mb-1 text-sm font-medium">Passing Year</label>
            <select
              name="passingYear"
              value={formData.passingYear}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {Array.from({ length: 10 }, (_, i) => 2025 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.passingYear && <p className="text-red-500 text-sm">{errors.passingYear}</p>}
          </div>

          {/* Resume Upload */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Upload Resume (PDF)</label>
            <input
              type="file"
              name="document"
              accept="application/pdf"
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
            {errors.ResumeUpload && <p className="text-red-500 text-sm">{errors.ResumeUpload}</p>}
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CaFreshersForm;



// // components/CAImport.jsx
// import { useState } from "react";
// import api from "../../../../utils/axios.js";
// import Swal from "sweetalert2";
// export default function CaFreshersForm() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };
//   const handleImport = async () => {
//     if (!file) {
//       Swal.fire("Error", "Please select a JSON file", "error");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     setLoading(true);
//     try {
//       const res = await api.post("/CA-Fresher/ca/import", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       Swal.fire(
//         "Success",
//         `${res.data.count} records imported successfully`,
//         "success"
//       );
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", err.response?.data?.message || "Import failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Import CA Fresher Registrations</h2>
//       <input type="file" accept=".json" onChange={handleFileChange} />
//       <button onClick={handleImport} disabled={loading}>
//         {loading ? "Importing..." : "Import JSON"}
//       </button>
//     </div>
//   );
// }
