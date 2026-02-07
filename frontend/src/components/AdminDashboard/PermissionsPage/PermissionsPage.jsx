import { useEffect, useState } from "react";
import axios from "../../../utils/axios.js";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function PermissionsPage() {
  
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", status: "active" });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    const res = await axios.get("/permissions/permission");
    setPermissions(res.data);
    setFilteredPermissions(res.data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
    });
    if (confirm.isConfirmed) {
      await axios.delete(`/permissions/permission-delete/${id}`);
      fetchPermissions();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put("/permissions/permission-update", form);
      Swal.fire("Updated!", "", "success");
    } else {
      await axios.post("/permissions/create-permission", form);
      Swal.fire("Created!", "", "success");
    }
    setForm({ id: "", name: "", status: "active" });
    setIsEditing(false);
    setShowModal(false);
    fetchPermissions();
  };

 const handleToggleStatus = async (id, currentStatus) => {
 const newStatus = currentStatus === "active" ? "inactive" : "active";
 await axios.put(`/permissions/permission-toggle/${id}`, { status: newStatus });
 fetchPermissions();
};

 const handleSearch = (e) => {
   const value = e.target.value.toLowerCase();
   setSearchText(value);
   const filtered = permissions.filter((permission) =>
     permission.name.toLowerCase().includes(value) ||
     permission.status.toLowerCase().includes(value)
   );
   setFilteredPermissions(filtered);
 };

  const columns = [
    {
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
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
            onClick={() => {
              setForm({ id: row.original._id, name: row.original.name, status: row.original.status });
              setIsEditing(true);
              setShowModal(true);
            }}
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
    data: filteredPermissions,
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Permissions</h2>
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchText}
            onChange={handleSearch}
            className="border p-2 rounded"
          />
          <button
            onClick={() => {
              setForm({ id: "", name: "", status: "active" });
              setIsEditing(false);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create Permission
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
                    No permissions found
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">
                {isEditing ? "Edit Permission" : "Create Permission"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Permission Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {isEditing ? "Update" : "Create"}
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
