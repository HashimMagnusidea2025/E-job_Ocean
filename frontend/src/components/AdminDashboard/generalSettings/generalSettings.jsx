import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Layout from "../../seekerDashboard/partials/layout";

// Utility function
const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    description: "",
    location: "",
    GST: "",
    logo: null,
    faviconIcon: null,
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewFavicon, setPreviewFavicon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/general-settings");
      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          ...res.data,
        }));
        if (res.data.logo)
          setPreviewLogo(`http://localhost:5000${res.data.logo}`);
        if (res.data.faviconIcon)
          setPreviewFavicon(`http://localhost:5000${res.data.faviconIcon}`);
      }
      console.log(res.data);

    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const camelCaseFields = ["companyName", "companyAddress", "location"];
    const newValue = camelCaseFields.includes(name)
      ? toCamelCase(value)
      : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (name === "logo") {
        setPreviewLogo(URL.createObjectURL(files[0]));
      } else if (name === "faviconIcon") {
        setPreviewFavicon(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      await axios.put("/general-settings", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update settings.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen  py-10 px-4">
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-xl mt-6 ">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">General Settings</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { name: "companyName", label: "Company Name" },
              { name: "companyEmail", label: "Company Email", type: "email" },
              { name: "companyPhone", label: "Company Phone" },
              { name: "companyAddress", label: "Company Address" },
              { name: "location", label: "Location" },
              { name: "GST", label: "GST" },
            ].map(({ name, label, type = "text" }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Logo</label>
              {previewLogo && (
                <img
                  src={previewLogo}
                  alt="Logo Preview"
                  className="w-[250px] h-[250px] object-contain border"
                />
              )}
              <input type="file" name="logo" onChange={handleFileChange} />
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Favicon Icon</label>
              {previewFavicon && (
                <img
                  src={previewFavicon}
                  alt="Favicon Preview"
                  className="w-[200px] h-[200px] object-contain mt-2 border"
                />
              )}
              <input type="file" name="faviconIcon" onChange={handleFileChange} />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default GeneralSettings;
