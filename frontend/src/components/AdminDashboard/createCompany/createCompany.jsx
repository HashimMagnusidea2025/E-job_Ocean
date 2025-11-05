import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import noImage from "../../../media/png/no-image.png";
import Layout from "../../seekerDashboard/partials/layout";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
const baseURL = import.meta.env.VITE_BACKEND_URL;
export default function CreateCompany() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null); // null = create mode

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(noImage);
  const [mapUrl, setMapUrl] = useState('')
  const [filteredCompany, setfilteredCompany] = useState([]);
  // categories
  const [companyCategories, setCompanyCategories] = useState([]);
  const [ownershipCategories, setOwnershipCategories] = useState([]);
  const [noofofficeCategories, setNoofofficeCategories] = useState([]);
  const [employeesCategories, setEmployeesCategories] = useState([]);
  const [establishedinCategory, setEstablishedinCategory] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, seterror] = useState();

  const [formData, setFormData] = useState({
    user: "",
    userData: { firstName: "", lastName: "", email: "" },
    company: {
      name: "",
      industry: "",
      ownershipType: "",
      description: "",
      officesCount: "",
      employeesCount: "",
      foundedYear: "",
      website: "",
      phone: "",
      socialLinks: { facebook: "", twitter: "", linkedin: "", pinterest: "" },
      address: { country: "", state: "", city: "", companyAddress: "", companyLocation: "" },
    },
    hrContact: {
      name: "",
      email: "",
      designation: "",
      companyRegistrationNumber: "",
    },
  });



  // ✅ Generate Map URL
  const generateMapUrl = (location) => {
    if (!location) return "";
    const encodedLocation = encodeURIComponent(location);
    return `https://maps.google.com/maps?q=${encodedLocation}&z=15&output=embed`;
  };

  // ✅ Update mapUrl whenever textarea changes
  useEffect(() => {
    if (formData.company.address.companyLocation) {
      setMapUrl(generateMapUrl(formData.company.address.companyLocation));
    } else {
      setMapUrl("");
    }
  }, [formData.company.address.companyLocation]);

  // fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/Company-Information");
      setCompanies(res.data.data);
      setfilteredCompany(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/Company-Information/${id}`);
          Swal.fire("Deleted!", "Company has been deleted.", "success");
          fetchCompanies();
        } catch (err) {
          Swal.fire("Error", "Failed to delete company", "error");
        }
      }
    });
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`/Company-Information/toggle-status/${id}`);
      Swal.fire("Updated!", `Status changed to ${res.data.status}`, "success");
      fetchCompanies();
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // categories & users
  useEffect(() => {
    axios.get("/company-category/active/:id").then((res) => setCompanyCategories(res.data));
    axios.get("/ownership-category/active/:id").then((res) => setOwnershipCategories(res.data));
    axios.get("/no-of-office-category/active/:id").then((res) => setNoofofficeCategories(res.data));
    axios.get("/no-of-employees-category/active/:id").then((res) => setEmployeesCategories(res.data));
    axios.get("/established-in-category/active/:id").then((res) => setEstablishedinCategory(res.data));
    axios.get("/country").then((res) => setCountries(res.data.country));
    axios.get("/users/free-users").then((res) => setUsers(res.data));
  }, []);

  // dependent dropdowns
  useEffect(() => {
    if (formData.company.address.country) {
      axios.get(`/state/country/${formData.company.address.country}`).then((res) => setStates(res.data.data));
    } else setStates([]);
  }, [formData.company.address.country]);

  useEffect(() => {
    if (formData.company.address.state) {
      axios.get(`/city/state/${formData.company.address.state}`).then((res) => setCities(res.data.data));
    } else setCities([]);
  }, [formData.company.address.state]);

  // input change
  const handleChange = (e, path) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      keys.slice(0, -1).forEach((k) => {
        obj[k] = obj[k] || {};
        obj = obj[k];
      });
      obj[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  // Handle user selection change
  const handleUserChange = (e) => {
    const userId = e.target.value;
    const selectedUser = users.find(user => user._id === userId);

    setFormData(prev => ({
      ...prev,
      user: userId,
      userData: selectedUser ? {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email
      } : { firstName: "", lastName: "", email: "" }
    }));
  };

  // logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // open modal for create
  const openCreateModal = () => {
    setEditingCompany(null);
    setFormData({
      user: "",
      userData: { name: "", email: "" },
      company: {
        name: "",
        industry: "",
        ownershipType: "",
        description: "",
        officesCount: "",
        employeesCount: "",
        foundedYear: "",
        website: "",
        phone: "",
        socialLinks: { facebook: "", twitter: "", linkedin: "", pinterest: "" },
        address: { country: "", state: "", city: "", companyAddress: "", companyLocation: "" },
      },
      hrContact: { name: "", email: "", designation: "", companyRegistrationNumber: "" },
    });
    setLogoPreview(noImage);
    setLogoFile(null);
    setMapUrl('')
    setShowModal(true);
  };

  // open modal for edit

  const openEditModal = (company) => {
    setEditingCompany(company._id);
    setFormData({
      user: company.user?._id || "",
      userData: {
        firstName: company.user?.firstName || "",
        lastName: company.user?.lastName || "",
        email: company.user?.email || ""
      },
      company: company.company,
      hrContact: company.hrContact,
    });

    if (company.company?.employerLogo) {
      setLogoPreview(`${baseURL}${company.company.employerLogo}`);
    } else {
      setLogoPreview(noImage);
    }

    if (company.company?.address?.companyLocation) {
      setMapUrl(generateMapUrl(company.company.address.companyLocation))
    } else {
      setMapUrl('')
    }
    setLogoFile(null);
    setShowModal(true);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();

      // For create: send user ID as string
      // For update: send user ID as string (not object)
      payload.append("user", formData.user);

      const companyData = {
        ...formData.company,
        address: {
          ...formData.company.address,
          country: parseInt(formData.company.address.country),
          state: parseInt(formData.company.address.state),

          // city remains as string
        }
      };
      payload.append("company", JSON.stringify(companyData));
      payload.append("hrContact", JSON.stringify(formData.hrContact));
      payload.append("userData", JSON.stringify(formData.userData));
      if (logoFile) payload.append("employerLogo", logoFile);

      if (editingCompany) {
        // ✅ update company
        await axios.put(`/Company-Information/${editingCompany}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Updated", "Company updated successfully!", "success");
      } else {
        // ✅ create company
        await axios.post("/Company-Information", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Created", "Company created successfully!", "success");
      }

      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };





  const columns = [
    {
      name: "ID",
      cell: (row, index) => index + 1,
      width: "35px",
    },
    {
      name: "Company Category",
      selector: (row) => row.company?.industry,
    },
    {
      name: "Company Name", selector: (row) => row.company?.name, sortable: true,

    },
    { name: "Ownership Type", selector: (row) => row.company?.ownershipType, sortable: true },
    {
      name: "User",
      selector: (row) => `${row.user?.firstName || ""} ${row.user?.lastName || ""}`,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded text-white ${row.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {row.status}
          </span>
          <button onClick={() => handleToggleStatus(row._id)}>
            {row.status === "active" ? (
              <FaToggleOn size={22} className="text-green-500" />
            ) : (
              <FaToggleOff size={22} className="text-red-500" />
            )}
          </button>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <FaEdit size={20} className="text-blue-600 cursor-pointer" onClick={() => openEditModal(row)} />
          <FaTrash size={20} className="text-red-600 cursor-pointer" onClick={() => handleDelete(row._id)} />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {/* Table */}
      <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
        <div className=" flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">All Companies</h2>
          <div className="flex justify-end mb-6 mt-5">
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md"
            >
              + Add Company
            </button>
          </div>
        </div>
        <DataTable columns={columns} data={companies} pagination highlightOnHover striped />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{editingCompany ? "Edit Company" : "Create Company"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-red-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* USER INFO */}
              <section>
                <h2 className="text-lg font-semibold mb-4">
                  User Information
                </h2>

                {editingCompany ? (
                  // EDIT MODE: Show user info as read-only
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        User Name
                      </label>
                      <input
                        type="text"
                        value={`${formData.userData.firstName || ""} ${formData.userData.lastName || ""}`}
                        className="p-3 w-full border rounded-md bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        User Email
                      </label>
                      <input
                        type="text"
                        value={formData.userData.email}
                        className="p-3 w-full border rounded-md bg-gray-100"
                        readOnly
                      />
                    </div>
                  </div>
                ) : (
                  // CREATE MODE: Show user selection dropdown
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        User Name
                      </label>
                      <select
                        value={formData.user}
                        onChange={handleUserChange}
                        className="p-3 w-full border rounded-md"
                      >
                        <option value="">-- Select User Name --</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        User Email
                      </label>
                      <input
                        type="text"
                        value={formData.userData.email}
                        className="p-3 w-full border rounded-md bg-gray-100"
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {formData.userData.firstName && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      Selected User: <strong>{formData.userData.firstName} {formData.userData.lastName}</strong>{" "}
                      ({formData.userData.email})
                    </p>
                  </div>
                )}
              </section>

              <section className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Company Logo</h2>
                <div className="flex flex-col items-center">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-32 h-32 object-contain border mb-3 rounded-md bg-white"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={handleLogoChange}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                  >
                    Upload Logo
                  </label>
                </div>
              </section>

              {/* COMPANY INFO */}
              <section className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                <div className="mb-3">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input
                      value={formData.company.name}
                      onChange={(e) => handleChange(e, "company.name")}
                      className="p-3 w-full border rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Category */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Category</label>
                    <select
                      value={formData.company.industry}
                      onChange={(e) => handleChange(e, "company.industry")}
                      className="p-3 w-full border rounded-md"
                    >
                      <option value="">-- Select Company Category --</option>
                      {companyCategories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Ownership */}
                  <div>
                    <label className="block font-medium">Ownership Type</label>
                    <select
                      name="ownershipType"
                      value={formData.company.ownershipType}
                      onChange={(e) => handleChange(e, "company.ownershipType")}
                      className="p-2 border w-full rounded"
                    >
                      <option value="">-- Select Ownership --</option>
                      {ownershipCategories.map((own) => (
                        <option key={own._id} value={own.name}>
                          {own.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.company.description}
                    onChange={(e) => handleChange(e, "company.description")}
                    className="p-3 w-full border rounded-md"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {/* No of Offices */}
                  <div>
                    <label className="block text-sm font-medium mb-1">No. of Offices</label>
                    <select
                      value={formData.company.officesCount}
                      onChange={(e) => handleChange(e, "company.officesCount")}
                      className="p-3 w-full border rounded-md"
                    >
                      <option value="">-- Select Offices --</option>
                      {noofofficeCategories.map((own) => (
                        <option key={own._id} value={own.name}>
                          {own.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Employees */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Employees</label>
                    <select
                      value={formData.company.employeesCount}
                      onChange={(e) => handleChange(e, "company.employeesCount")}
                      className="p-3 w-full border rounded-md"
                    >
                      <option value="">-- Select Employees --</option>
                      {employeesCategories.map((own) => (
                        <option key={own._id} value={own.name}>
                          {own.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Established In */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Established In</label>
                    <select
                      value={formData.company.foundedYear}
                      onChange={(e) => handleChange(e, "company.foundedYear")}
                      className="p-3 w-full border rounded-md"
                    >
                      <option value="">-- Select Year --</option>
                      {establishedinCategory.map((own) => (
                        <option key={own._id} value={own.name}>
                          {own.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Website URL</label>
                    <input
                      type="url"
                      value={formData.company.website}
                      onChange={(e) => handleChange(e, "company.website")}
                      className="p-3 w-full border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="number"
                      value={formData.company.phone}
                      onChange={(e) => handleChange(e, "company.phone")}
                      className="p-3 w-full border rounded-md"
                    />
                  </div>
                </div>
              </section>

              {/* SOCIAL LINKS */}
              <section className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Social Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {["facebook", "twitter", "linkedin", "pinterest"].map((platform) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium mb-1">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </label>
                      <input
                        type="url"
                        value={formData.company.socialLinks[platform]}
                        onChange={(e) => handleChange(e, `company.socialLinks.${platform}`)}
                        className="p-3 w-full border rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ADDRESS */}
              <section className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Company Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <select
                      value={formData.company.address.country}
                      onChange={(e) => handleChange(e, "company.address.country")}
                      className="p-3 w-full border rounded-md"
                    >
                      <option value="">-- Select Country --</option>
                      {countries.map((country) => (
                        <option key={country._id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <select
                      value={formData.company.address.state}
                      onChange={(e) => handleChange(e, "company.address.state")}
                      className="p-3 w-full border rounded-md"
                      disabled={!formData.company.address.country}
                    >
                      <option value="">-- Select State --</option>
                      {states.map((state) => (
                        <option key={state._id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <select
                      value={formData.company.address.city}
                      onChange={(e) => handleChange(e, "company.address.city")}
                      className="p-3 w-full border rounded-md"
                      disabled={!formData.company.address.state}
                    >
                      <option value="">-- Select City --</option>
                      {cities.map((city) => (
                        <option key={city._id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <textarea
                    value={formData.company.address.companyAddress}
                    onChange={(e) => handleChange(e, "company.address.companyAddress")}
                    className="p-3 w-full border rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Company Location</label>
                  <textarea
                    value={formData.company.address.companyLocation}
                    onChange={(e) => handleChange(e, "company.address.companyLocation")}
                    className="p-3 w-full border rounded-md"
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Location Preview</label>
                  <div className="border rounded-md overflow-hidden">
                    {/* <p>{mapUrl}</p> */}
                    {mapUrl ? (
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Company Location Map"
                      ></iframe>
                    ) : (
                      <div className="flex items-center justify-center h-48 bg-gray-100">
                        <p className="text-gray-500">Enter a location above to preview the map</p>
                      </div>
                    )}


                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Preview of your company location. Make sure the address above is accurate.
                  </p>
                </div>

              </section>

              {/* HR INFO */}
              <section className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">HR Person Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">HR Name</label>
                    <input
                      value={formData.hrContact.name}
                      onChange={(e) => handleChange(e, "hrContact.name")}
                      className="p-3 w-full border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">HR Email</label>
                    <input
                      value={formData.hrContact.email}
                      onChange={(e) => handleChange(e, "hrContact.email")}
                      className="p-3 w-full border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Designation</label>
                    <input
                      value={formData.hrContact.designation}
                      onChange={(e) => handleChange(e, "hrContact.designation")}
                      className="p-3 w-full border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Registration Number
                    </label>
                    <input
                      value={formData.hrContact.companyRegistrationNumber}
                      onChange={(e) =>
                        handleChange(e, "hrContact.companyRegistrationNumber")
                      }
                      className="p-3 w-full border rounded-md"
                    />
                  </div>
                </div>
              </section>

              {/* SUBMIT */}
              <div className="text-center">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md">
                  {editingCompany ? "Update Company" : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}