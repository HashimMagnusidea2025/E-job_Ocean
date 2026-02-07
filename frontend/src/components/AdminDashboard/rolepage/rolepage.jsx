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

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [status, setStatus] = useState("active"); 
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
  
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = roles.filter((role) =>
      role.name.toLowerCase().includes(value) ||
      role.permissions.some(p => p.name.toLowerCase().includes(value)) ||
      role.status.toLowerCase().includes(value)
    );

    setFilteredRoles(filtered);
  };
  

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

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`/roles/${id}`, { status: newStatus });
      Swal.fire("Updated!", `Role status changed to ${newStatus}`, "success");
      fetchRoles();
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
      accessorKey: "name",
      header: "Role Name",
    },
    {
      header: "Permissions",
      cell: ({ row }) =>
        row.original.permissions.map((p) => p.name).join(", ") || "No permissions",
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
            onClick={() => handleEdit(row.original)}
            className="text-blue-600"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="text-red-600"
          >
            <FaTrash size={20} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredRoles,
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
            placeholder="Search roles..."
            value={searchText}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table */}
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
                    No roles found
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
