import React, { useEffect, useState } from "react";
import axios from '../../utils/axios.js';
import Swal from "sweetalert2";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function KnowledgeBasePage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState(""); // "download" or "view"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("/knowlege-base");
      if (res.data.success) {
        setData(res.data.data);
        setFilteredData(res.data.data);
      }
    } catch (err) {
      console.error(err?.message || err);
      Swal.fire("Error", "Failed to load data", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // 🔹 Increment count & handle download or modal
  // Only for Download button (increments count)
  const handleDownload = async (item) => {
    try {
      const res = await axios.post(`/knowlege-base/${item._id}/increment`);
      if (res.data.success) {
        setData((prev) =>
          prev.map((d) =>
            d._id === item._id ? { ...d, count: res.data.updatedCount } : d
          )
        );
      }
      
      if (item.fromStatus === "Disabled") {
        window.open(`${baseURL}/${item.uploadPDF}`, "_blank");
      } else if (item.fromStatus === "Enabled") {
        setSelectedItem(item);
        setModalMode("download"); // show form
        setShowModal(true);
      }
    } catch (err) {
      console.error(err?.message || err);
      Swal.fire("Error", "Failed to increment count", "error");
    }
  };

  // Only for View button (does NOT increment count)
  const handleView = (item) => {
    setSelectedItem(item);
    setModalMode("view");
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({ firstName: "", lastName: "", email: "", mobile: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/knowlege-base-register", {
        knowlegeBaseId: selectedItem._id,
        ...formData,
      });

      if (res.data.success) {
        Swal.fire("Success", "Registered successfully!", "success");
        setData((prev) =>
          prev.map((d) =>
            d._id === selectedItem._id ? { ...d, count: res.data.updatedCount } : d
          )
        );
        closeModal();

        // Auto-download after registration
        if (selectedItem.uploadPDF)
          window.open(`${baseURL}/${selectedItem.uploadPDF}`, "_blank");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (err) {
      console.error(err?.message || err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No records found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg shadow p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-4">{item.description}</p>
              </div>

              <div className="mt-4 flex gap-2">
                {item.uploadPDF && (
                  <button
                    onClick={() => handleDownload(item, "download")}
                    className="flex-1 text-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Download
                  </button>
                )}

                <button
                  onClick={() => handleView(item)}
                  className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Modal (for both View & Disabled cases) */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">
              {modalMode === "view"
                ? `View: ${selectedItem.title}`
                : `${selectedItem.title} Form`}
            </h3>


            {/* 🔹 Description only in VIEW mode */}
            {modalMode === "view" && (
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
            )}

            {modalMode === "view" ? (
              // ✅ View-only modal
              selectedItem.fromStatus === "Disabled" && (
                <button
                  onClick={() => {
                    setModalMode("download"); // switch to form modal
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download
                </button>
              )
            ) : (
              // ✅ Form modal
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {["firstName", "lastName", "email", "mobile"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label
                      htmlFor={field}
                      className="mb-1 font-medium text-gray-700 capitalize"
                    >
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      id={field}
                      type={field === "email" ? "email" : "text"}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter your ${field}`}
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                >
                  Submit & Download
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
