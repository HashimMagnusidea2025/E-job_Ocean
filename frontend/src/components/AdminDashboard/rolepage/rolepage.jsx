import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [status, setStatus] = useState("active"); // NEW
  const [allPermissions, setAllPermissions] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/roles");
      setRoles(res.data);
      setFilteredRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    axios
      .get("/permissions/permission")
      .then((res) => setAllPermissions(res.data))
      .catch((err) => {
        console.error("Permissions error:", err.response?.data || err.message);
        alert("Failed to load permissions");
      });
  }, []);

  useEffect(() => {
    const filtered = roles.filter((role) =>
      role.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [filterText, roles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`/roles/${editingRoleId}`, {
          name: name.trim(),
          permissions,
          status, // send status
        });
        Swal.fire("Updated!", "Role updated successfully", "success");
      } else {
        await axios.post("/roles/role-create", {
          name: name.trim(),
          permissions,
          status, // send status
        });
        Swal.fire("Created!", "Role created successfully", "success");
      }

      setName("");
      setPermissions([]);
      setStatus("active");
      setIsEditMode(false);
      setEditingRoleId(null);
      setShowModal(false);
      fetchRoles();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const handleEdit = (role) => {
    setIsEditMode(true);
    setEditingRoleId(role._id);
    setName(role.name);
    setPermissions(role.permissions.map((p) => p._id));
    setStatus(role.status); // set status while editing
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This role will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/roles/${id}`);
      Swal.fire("Deleted!", "Role deleted successfully.", "success");
      fetchRoles();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const columns = [
    {
      name: "Role Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Permissions",
      selector: (row) =>
        row.permissions.map((p) => p.name).join(", ") || "No permissions",
      wrap: true,
    },
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
       },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3 text-lg">
          <button onClick={() => handleEdit(row)} title="Edit">
            <FaEdit size={20} className="text-blue-600 hover:text-blue-800" />
          </button>
          <button onClick={() => handleDelete(row._id)} title="Delete">
            <FaTrash size={20} className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      
    },
  ];

  return (
    <Layout>
      <div className="px-4 py-8 min-h-screen">
        {/* Header + Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Roles Management
          </h2>
          <button
            onClick={() => {
              setShowModal(true);
              setIsEditMode(false);
              setName("");
              setPermissions([]);
              setStatus("active");
              setEditingRoleId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Create Role
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by role name..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
          <DataTable
            title="All Roles"
            columns={columns}
            data={filteredRoles}
            pagination
            highlightOnHover
            responsive
            dense
          />
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg space-y-4 relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold text-gray-700">
                {isEditMode ? "Edit Role" : "Create Role"}
              </h2>

              {/* Role Name */}
              <input
                type="text"
                placeholder="Enter role name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Permissions */}
              <div>
                <label className="block mb-2 font-medium text-gray-600">
                  Select Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                  {allPermissions.map((perm) => (
                    <label key={perm._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={perm._id}
                        checked={permissions.includes(perm._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPermissions([...permissions, perm._id]);
                          } else {
                            setPermissions(
                              permissions.filter((id) => id !== perm._id)
                            );
                          }
                        }}
                      />
                      {perm.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block mb-2 font-medium text-gray-600">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {isEditMode ? "Update Role" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
