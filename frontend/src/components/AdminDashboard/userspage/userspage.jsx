import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { IoCloseSharp } from "react-icons/io5";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    roleID: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // ✅ Search Filter
  useEffect(() => {
    const lower = filterText.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lower) ||
        user.lastName.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower) ||
        user.roleID?.name?.toLowerCase().includes(lower) ||
        user.status.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  }, [filterText, users]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const toCamelCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.roleID) newErrors.roleID = "Role is required";

    if (!isEditMode) {
      // Create Mode → password required
      if (!form.newPassword) {
        newErrors.newPassword = "Password is required";
      } else if (!passwordRegex.test(form.newPassword)) {
        newErrors.newPassword =
          "Password must contain uppercase, lowercase, number & special char";
      }

      if (form.newPassword !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      // Edit Mode
      if (form.currentPassword) {
        // ✅ If currentPassword is provided → new & confirm required
        if (!form.newPassword) {
          newErrors.newPassword = "New password is required";
        } else if (!passwordRegex.test(form.newPassword)) {
          newErrors.newPassword =
            "Password must contain uppercase, lowercase, number & special char";
        }

        if (!form.confirmPassword) {
          newErrors.confirmPassword = "Confirm password is required";
        } else if (form.newPassword !== form.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Create / Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const formattedForm = {
        firstName: toCamelCase(form.firstName),
        lastName: toCamelCase(form.lastName),
        email: form.email,
        roleID: form.roleID,
        status: form.status,
      };

      if (form.currentPassword && form.newPassword) {
        formattedForm.password = form.currentPassword;
        formattedForm.newPassword = form.newPassword;
      }

      if (isEditMode) {
        await axios.put(`/users/${editingUserId}`, formattedForm);
        Swal.fire("Updated!", "User updated successfully", "success");
      } else {
        await axios.post("/auth/register", {
          ...formattedForm,
          password: form.newPassword,
          confirmPassword: form.confirmPassword,
        });
        Swal.fire("Success", "User registered successfully", "success");
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      // 🔴 Show error under Current Password field
      const message = err.response?.data?.message || err.message;

      if (message.includes("Current password is incorrect")) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
      } else {
        Swal.fire("Error", message, "error"); // fallback
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      roleID: "",
      status: "active",
    });
    setErrors({});
    setShowModal(false);
    setIsEditMode(false);
    setEditingUserId(null);
  };

  // ✅ Edit User
  const handleEdit = (user) => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      roleID: user.roleID?._id || "",
      status: user.status || "active",
    });
    setEditingUserId(user._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  // ✅ Delete User
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/${id}`);
        fetchUsers();
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || err.message, "error");
      }
    }
  };

  // ✅ Toggle Status
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await axios.put(`/users/${id}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
      Swal.fire("Updated!", `User status changed to ${newStatus}`, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // ✅ DataTable columns
  const columns = [
    {
      name: "Name",
      selector: (row) =>
        `${toCamelCase(row.firstName)} ${toCamelCase(row.lastName)}`,
      sortable: true,
    },
    { name: "Email", selector: (row) => row.email },
    { name: "Role", selector: (row) => row.roleID?.name || "N/A" },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded text-white ${
              row.status === "active" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {row.status}
          </span>
          <button onClick={() => handleToggleStatus(row._id, row.status)}>
            {row.status === "active" ? (
              <FaToggleOn size={22} className="text-green-500" />
            ) : (
              <FaToggleOff size={22} className="text-red-500" />
            )}
          </button>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEdit(row)}
          >
            <FaEdit size={20} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row._id)}
          >
            <FaTrash size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="px-4 py-8">
        {/* ✅ Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 relative"
            >
              <button
                type="button"
                onClick={resetForm}
                className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
              >
                <IoCloseSharp size={30}/>
              </button>
              <h2 className="text-2xl font-bold text-center text-gray-700">
                {isEditMode ? "Edit User" : "Register User"}
              </h2>

              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="px-4 py-2 border rounded-lg w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="px-4 py-2 border rounded-lg w-full"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="px-4 py-2 border rounded-lg w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password fields */}
              {isEditMode ? (
                <>
                  <div>
                    <input
                      name="currentPassword"
                      type="password"
                      placeholder="Current Password"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className="px-4 py-2 border rounded-lg w-full"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-lg w-full"
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-lg w-full"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      name="newPassword"
                      type="password"
                      placeholder="Password"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="px-4 py-2 border rounded-lg w-full"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="px-4 py-2 border rounded-lg w-full"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Role */}
              <div>
                <select
                  name="roleID"
                  value={form.roleID}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border rounded-lg w-full"
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.roleID && (
                  <p className="text-red-500 text-sm">{errors.roleID}</p>
                )}
              </div>

              {/* Status */}
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                {loading
                  ? "Processing..."
                  : isEditMode
                  ? "Update User"
                  : "Register User"}
              </button>
            </form>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center pb-6">
          <h2 className="text-2xl font-bold text-gray-700">Users List</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Create User
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full max-w-sm mb-4"
        />

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            responsive
            highlightOnHover
            striped
          />
        </div>
      </div>
    </Layout>
  );
}
