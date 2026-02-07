import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import { IoCloseSharp } from "react-icons/io5";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
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

  //  Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  //  Fetch Roles
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(value) ||
        user.email.toLowerCase().includes(value) ||
        (user.roleID?.name || '').toLowerCase().includes(value) ||
        user.status.toLowerCase().includes(value)
      );
    });

    setFilteredUsers(filtered);
  };


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

  //  Validate form
  const validateForm = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.roleID) newErrors.roleID = "Role is required";

    if (!isEditMode) {
     
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

  //  Create / Update User
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
      //  Show error under Current Password field
      const message = err.response?.data?.message || err.message;

      if (message.includes("Current password is incorrect")) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
      } else {
        Swal.fire("Error", message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  //  Reset Form
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

  //  Edit User
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

  //  Delete User
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

  //  Toggle Status
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

  const columns = [
    {
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Name",
      accessorFn: (row) => `${toCamelCase(row.firstName)} ${toCamelCase(row.lastName)}`,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      header: "Role",
      accessorFn: (row) => row.roleID?.name || "N/A",
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded text-white ${
              row.original.status === "active" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {row.original.status}
          </span>
          <button onClick={() => handleToggleStatus(row.original._id, row.original.status)}>
            {row.original.status === "active" ? (
              <FaToggleOn size={22} className="text-green-500" />
            ) : (
              <FaToggleOff size={22} className="text-red-500" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEdit(row.original)}
          >
            <FaEdit size={20} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row.original._id)}
          >
            <FaTrash size={20} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: {
      globalFilter: searchText,
    },
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Layout>
      <div className="px-4 py-8">
        {/*  Modal */}
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Users</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={handleSearch}
            className="border p-2 rounded"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-semibold border"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2 border text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
