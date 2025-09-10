import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../../utils/axios.js";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", status: "active" });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    const res = await axios.get("/permissions/permission");
    setPermissions(res.data);
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

  const columns = [
    {
    name: "ID",
    selector: (row, index) => index + 1, // index start from 0, so +1
    width: "80px",
    sortable: false,
  },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              setForm({ id: row._id, name: row.name, status: row.status });
              setIsEditing(true);
              setShowModal(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Permissions</h2>
          <button
            onClick={() => {
              setForm({ id: "", name: "", status: "active" });
              setIsEditing(false);
              setShowModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Create Permission
          </button>
        </div>

        <DataTable title="Permissions" columns={columns} data={permissions} pagination />

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
