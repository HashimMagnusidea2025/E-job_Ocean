import React from "react";
import { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
const WebinarPage = () => {
  const [webinars, setWebinars] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [filteredWebinars, setFilteredWebinars] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    WebinarTitle: "",
    WebinarSlug: "",
    Introduction: "",
    Description: "",
    Keywords: "",
    WebinarStartDateTime: "",
    WebinarEndDateTime: "",
    NumberofSeats: "",
    YouTubeVideoLink: "",
    RegistrationStartDateTime: "",
    RegistrationCloseDateTime: "",
    WebinarMode: "",
    WebinarType: "",
    IncludingGST: false,
    IsActive: false,
    Speaker: "",
    WebinarImage: null,
    WebinarLogo: null,
    WebinarVideoOptional: null,
    webinarlink: "",
    webinarAddress: "",
    registrationFees: "",
  });

  // fetch webinars on mount
  useEffect(() => {
    fetchWebinars();
    fetchSpeakers();
  }, []);




  const fetchSpeakers = async () => {
    try {
      const res = await axios.get("/speakers/active");
      setSpeakers(res.data);
      console.log(res.data);

    } catch (err) {
      console.error("Error fetching speakers:", err);
    }
  };

  const fetchWebinars = async () => {
    try {
      const res = await axios.get("/webinars");
      setWebinars(res.data);
      setFilteredWebinars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleAdd = () => {
    setEditData(null);
    setFormData({
      WebinarTitle: "",
      WebinarSlug: "",
      Introduction: "",
      Description: "",
      Keywords: "",
      WebinarStartDateTime: "",
      WebinarEndDateTime: "",
      NumberofSeats: "",
      YouTubeVideoLink: "",
      RegistrationStartDateTime: "",
      RegistrationCloseDateTime: "",
      WebinarMode: "",
      WebinarType: "",
      IncludingGST: false,
      IsActive: false,
      Speaker: "",
      WebinarImage: null,
      WebinarLogo: null,
      WebinarVideoOptional: null,
      webinarlink: "",
      webinarAddress: "",
      registrationFees: "",
    });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setFormData({
      ...row,
      Speaker: row.Speaker?._id || ""
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    const token = localStorage.getItem("token");
    try {
      if (editData) {
        await axios.put(`/webinars/${editData._id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        });
        alert("Webinar updated!");
      } else {
        await axios.post("/webinars", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,  //  Add this
          },
        });
        alert("Webinar created!");
      }
      setModalOpen(false);
      fetchWebinars();
    } catch (err) {
      console.error(err);
      alert("Error saving webinar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/webinars/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      fetchWebinars();
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (row) => {
    setViewData(row);
    setViewModalOpen(true);
  };



  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = webinars.filter((webinar) => {
      // Yahan aap jo columns filter karna chahte ho unhe check kar sakte ho
      return (
        webinar.WebinarTitle.toLowerCase().includes(value) ||
        webinar.Introduction.toLowerCase().includes(value) ||
        webinar.Speaker?.firstName.toLowerCase().includes(value) ||
        webinar.Speaker?.lastName.toLowerCase().includes(value) ||
        webinar.IsActive.toLowerCase().includes(value) ||
        webinar.WebinarStartDateTime.toLowerCase().includes(value) ||
        webinar.WebinarEndDateTime.toLowerCase().includes(value)
      );
    });

    setFilteredWebinars(filtered);
  };
  const columns = [
    {
      name: "ID",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    { name: "Title", selector: (row) => row.WebinarTitle, sortable: true },
    { name: "Introduction", selector: (row) => row.Introduction },
    { name: "Start Date", selector: (row) => row.WebinarStartDateTime },
    { name: "End Date", selector: (row) => row.WebinarEndDateTime },
    {
      name: "Active Webinar",
      selector: (row) =>
        row.IsActive === "active" ? "Active" : "Inactive",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleView(row)}
          >
            <FaEye size={22} />
          </button>
          <button
            className="text-green-500 hover:text-green-700"
            onClick={() => handleEdit(row)}
          >
            <FaEdit size={22} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row._id)}
          >
            <FaTrash size={22} />
          </button>
        </div>
      ),
    }

  ];


  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Webinars</h2>
          <input
            type="text"
            placeholder="Search webinars..."
            value={searchText}
            onChange={handleSearch}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create Webinar
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <DataTable columns={columns} data={filteredWebinars} pagination highlightOnHover />
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editData ? "Edit Webinar" : "Create Webinar"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Webinar Title */}
                <label className="block">
                  <span className="text-gray-700 flex items-center gap-1">
                    Webinar Title <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="text"
                    name="WebinarTitle"
                    value={formData.WebinarTitle}
                    placeholder="Enter webinar title"
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>


                {/* Webinar Slug */}
                <label className="block">
                  <span className="text-gray-700 flex items-center gap-1">
                    Webinar Slug <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    name="WebinarSlug"
                    value={formData.WebinarSlug}
                    placeholder="Enter webinar slug"
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Introduction */}
                <label className="block md:col-span-2">
                  <span className="text-gray-700 flex items-center gap-1">
                    Introduction <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    name="Introduction"
                    value={formData.Introduction}
                    placeholder="Short introduction"
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Description */}
                <label className="block md:col-span-2">
                  <span className="text-gray-700 flex items-center gap-1">
                    Description <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    name="Description"
                    value={formData.Description}
                    placeholder="Detailed description"
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Keywords */}
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="text-gray-700 font-medium">Keywords</span>
                    <textarea
                      name="Keywords"
                      value={formData.Keywords}
                      placeholder="Keywords"
                      className="w-full border p-2 rounded mt-1"
                      onChange={handleChange}
                    />
                  </label>
                </div>

                {/* Number of Seats */}
                <label className="block md:col-span-2">
                  <span className="text-gray-700">Number of Seats</span>
                  <input
                    type="number"
                    name="NumberofSeats"
                    value={formData.NumberofSeats}
                    placeholder="Enter available seats"
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Start Date */}
                <label className="block">
                  <span className="text-gray-700">Webinar Start Date & Time</span>
                  <input
                    type="datetime-local"
                    name="WebinarStartDateTime"
                    value={formData.WebinarStartDateTime}
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* End Date */}
                <label className="block">
                  <span className="text-gray-700">Webinar End Date & Time</span>
                  <input
                    type="datetime-local"
                    name="WebinarEndDateTime"
                    value={formData.WebinarEndDateTime}
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Registration Start */}
                <label className="block">
                  <span className="text-gray-700">Registration Start Date & Time</span>
                  <input
                    type="datetime-local"
                    name="RegistrationStartDateTime"
                    value={formData.RegistrationStartDateTime}
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Registration Close */}
                <label className="block">
                  <span className="text-gray-700">Registration Close Date & Time</span>
                  <input
                    type="datetime-local"
                    name="RegistrationCloseDateTime"
                    value={formData.RegistrationCloseDateTime}
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Webinar Mode */}
                {/* Webinar Mode */}
                <label className="block">
                  <span className="text-gray-700">Webinar Mode</span>
                  <select
                    name="WebinarMode"
                    value={formData.WebinarMode}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="">-- Select Mode --</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </label>

                {/* Show Webinar Link if Online */}
                {formData.WebinarMode === "online" && (
                  <label className="block md:col-span-2">
                    <span className="text-gray-700">Webinar Link</span>
                    <input
                      type="url"
                      name="webinarlink"
                      value={formData.webinarlink || ""}
                      placeholder="Enter webinar link"
                      className="w-full border p-2 rounded mt-1"
                      onChange={handleChange}
                    />
                  </label>
                )}

                {/* Show Webinar Address if Offline */}
                {formData.WebinarMode === "offline" && (
                  <label className="block md:col-span-2">
                    <span className="text-gray-700">Webinar Address</span>
                    <textarea
                      name="webinarAddress"
                      value={formData.webinarAddress || ""}
                      placeholder="Enter webinar address"
                      className="w-full border p-2 rounded mt-1"
                      onChange={handleChange}
                    />
                  </label>
                )}


                {/* Webinar Type */}
                <label className="block">
                  <span className="text-gray-700">Webinar Type</span>
                  <select
                    name="WebinarType"
                    value={formData.WebinarType}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Reset fields based on type
                      setFormData({
                        ...formData,
                        WebinarType: value,
                        registrationFees: value === "Paid" ? formData.registrationFees : "",
                        IncludingGST: value === "Free" ? formData.IncludingGST : "inactive",
                        IsActive: value === "Free" ? formData.IsActive : "inactive"
                      });
                    }}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="">-- Select Type --</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </label>

                {/* If Paid → show Registration Fees */}
                {formData.WebinarType === "Paid" && (
                  <label className="block md:col-span-2">
                    <span className="text-gray-700">Registration Fees</span>
                    <input
                      type="text"
                      name="registrationFees"
                      value={formData.registrationFees}
                      placeholder="Enter registration fees"
                      className="w-full border p-2 rounded mt-1"
                      onChange={handleChange}
                    />
                  </label>
                )}


                {/* GST + Active */}


                {/* Speaker */}
                <label className="block md:col-span-2">
                  <span className="text-gray-700 flex items-center gap-1">
                    Speaker <span className="text-red-500">*</span>
                  </span>
                  <select
                    name="Speaker"
                    value={formData.Speaker}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="">-- Select Speaker --</option>
                    {speakers.map((spk) => (
                      <option key={spk._id} value={spk._id}>
                        {spk.salutation} {spk.firstName} {spk.lastName}
                      </option>
                    ))}
                  </select>
                </label>


                {/* YouTube Link */}
                <label className="block md:col-span-2">
                  <span className="text-gray-700">YouTube Video Link</span>
                  <input
                    type="url"
                    name="YouTubeVideoLink"
                    value={formData.YouTubeVideoLink}
                    placeholder="Paste YouTube link"
                    className="w-full border p-2 rounded mt-1"
                    onChange={handleChange}
                  />
                </label>

                {/* Files */}
                <label className="block">
                  <span className="text-gray-700">Webinar Image</span>
                  <input
                    type="file"
                    name="WebinarImage"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Webinar Logo</span>
                  <input
                    type="file"
                    name="WebinarLogo"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Webinar Video (Optional)</span>
                  <input
                    type="file"
                    name="WebinarVideoOptional"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                  />
                </label>

                {formData.WebinarType === "Paid" && (
                  <div className="flex items-center gap-6 md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="IncludingGST"
                        checked={formData.IncludingGST === "active"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            IncludingGST: e.target.checked ? "active" : "inactive"
                          })
                        }
                      />
                      <span className="text-gray-700">Including GST</span>
                    </label>


                  </div>
                )}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="IsActive"
                    checked={formData.IsActive === "active"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        IsActive: e.target.checked ? "active" : "inactive"
                      })
                    }
                  />
                  <span className="text-gray-700">Active Webinar</span>
                </label>
                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    {editData ? "Update Webinar" : "Create Webinar"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {viewModalOpen && viewData && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fadeIn">

              {/* Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Webinar Details
                </h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold transition-transform duration-200 hover:scale-110"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">

                {/* Basic Info */}
                <div className="md:col-span-2 p-6 bg-white rounded-xl border shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Basic Info</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <p><span className="font-semibold">Title:</span> {viewData.WebinarTitle}</p>
                    <p><span className="font-semibold">Slug:</span> {viewData.WebinarSlug}</p>
                    <p className="md:col-span-2"><span className="font-semibold">Introduction:</span> {viewData.Introduction}</p>
                    <p className="md:col-span-2"><span className="font-semibold">Description:</span> {viewData.Description}</p>
                    <p className="md:col-span-2"><span className="font-semibold">Keywords:</span> {viewData.Keywords}</p>
                    <p><span className="font-semibold">Seats:</span> {viewData.NumberofSeats}</p>

                    {viewData.WebinarType === "Paid" && (
                      <p><span className="font-semibold">Registration Fees:</span> {viewData.registrationFees}</p>
                    )}
                    <p><span className="font-semibold">Type:</span> {viewData.WebinarType}</p>
                    <p><span className="font-semibold">Mode:</span> {viewData.WebinarMode}</p>


                    {viewData.WebinarMode === "online" && (


                      <div className="md:col-span-2 p-6 bg-white rounded-xl border shadow-sm">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">Webinar Link:</h4>
                        <a href={viewData.webinarlink} target="_blank" className="text-blue-600 underline">{viewData.webinarlink}</a>
                      </div>


                    )}
                    {viewData.WebinarMode === "offline" && (
                      <p><span className="font-semibold">Webinar Address:</span> {viewData.webinarAddress}</p>
                    )}

                    {viewData.WebinarType === "Free" && (
                      <>
                        <p><span className="font-semibold">Including GST:</span> {viewData.IncludingGST === "active" ? "Yes" : "No"}</p>
                        <p><span className="font-semibold">Active Webinar:</span> {viewData.IsActive === "active" ? "Yes" : "No"}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="md:col-span-2 p-6 bg-white rounded-xl border shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Dates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <p><span className="font-semibold">Start:</span> {formatDate(viewData.WebinarStartDateTime)}</p>
                    <p><span className="font-semibold">End:</span> {formatDate(viewData.WebinarEndDateTime)}</p>
                    <p><span className="font-semibold">Registration Start:</span> {formatDate(viewData.RegistrationStartDateTime)}</p>
                    <p><span className="font-semibold">Registration Close:</span> {formatDate(viewData.RegistrationCloseDateTime)}</p>
                  </div>
                </div>

                {/* Speaker */}
                <div className="md:col-span-2 p-6 bg-white rounded-xl border shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Speaker</h4>
                  <p className="text-gray-800">{viewData.Speaker?.salutation} {viewData.Speaker?.firstName} {viewData.Speaker?.lastName}</p>
                </div>

                {/* Media */}

                {/* Media Section */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Webinar Image */}
                  {viewData.WebinarImage && (
                    <div className="p-6 bg-white rounded-xl border shadow-sm flex flex-col items-center">
                      <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900 w-full text-center">
                        Webinar Image
                      </h4>
                      <img
                        src={`${baseURL}${viewData.WebinarImage}`}
                        alt="Webinar"
                        className="w-60 h-auto rounded-lg shadow"
                      />
                    </div>
                  )}

                  {/* Logo */}
                  {viewData.WebinarLogo && (
                    <div className="p-6 bg-white rounded-xl border shadow-sm flex flex-col items-center">
                      <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900 w-full text-center">
                        Logo
                      </h4>
                      <img
                        src={`${baseURL}${viewData.WebinarLogo}`}
                        alt="Logo"
                        className="w-60 h-auto rounded-lg shadow"
                      />
                    </div>
                  )}
                </div>

                {/* Video Section */}
                {viewData.WebinarVideoOptional &&
                  viewData.WebinarVideoOptional !== "undefined" && (
                    <div className="md:col-span-2 p-6 bg-white rounded-xl border shadow-sm">
                      <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
                        Video (Optional)
                      </h4>
                      <video
                        controls
                        src={`${baseURL}${viewData.WebinarVideoOptional}`}
                        className="w-full rounded-lg shadow"
                      />
                    </div>
                  )}

                {/* YouTube Link */}
                <div className="md:col-span-2 p-6 bg-white rounded-xl border shadow-sm">
                  <h4 className="text-lg font-semibold mb-2 text-gray-900">YouTube Link</h4>
                  <a href={viewData.YouTubeVideoLink} target="_blank" className="text-blue-600 underline">{viewData.YouTubeVideoLink}</a>
                </div>

              </div>
            </div>
          </div>
        )}




      </div>
    </Layout>
  );
};

export default WebinarPage;
