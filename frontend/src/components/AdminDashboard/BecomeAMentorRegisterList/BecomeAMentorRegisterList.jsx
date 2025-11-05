import React, { useEffect, useState } from "react";
import Layout from "../../seekerDashboard/partials/layout";
import DataTable from "react-data-table-component";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";



export default function BecomeAMentorRegisterList() {
    const [mentors, setMentors] = useState([]);

    const fetchMentors = async () => {
        try {
            const res = await axios.get("/auth/mentors");
            if (res.data.success) {
                setMentors(res.data.data); // Already filtered
            }
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetchMentors();
    }, []);


    const handleView = (mentor) => {
        Swal.fire({
            title: `${mentor.firstName} ${mentor.lastName}`,
            html: `
      <p>Email: ${mentor.email}</p>
      <p>Phone: ${mentor.phone || "N/A"}</p>
      <p>Status: ${mentor.Approved}</p>
    `,
        });
    };

    const handleEdit = (mentor) => {
        // You can open a modal or navigate to an edit page
        console.log("Edit mentor:", mentor);
    };

    const handleDelete = async (mentor) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/auth/mentor/${mentor._id}`);
                Swal.fire("Deleted!", "Mentor has been deleted.", "success");
                fetchMentors(); // refresh list
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete mentor.", "error");
            }
        }
    };


    const handleApprove = async (mentor) => {
        const { value: password } = await Swal.fire({
            title: `Approve ${mentor.firstName}?`,
            input: "text",
            inputLabel: "Set a password for mentor login",
            inputPlaceholder: "Enter password",
            showCancelButton: true,
        });

        if (!password) return;

        try {
            const res = await axios.post("/auth/approve-mentor", {
                userId: mentor._id,
                password,
            });

            Swal.fire("Approved!", "Mentor account activated successfully.", "success");
            fetchMentors();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to approve mentor.", "error");
        }
    };

    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            width: "80px",
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => `${row.firstName} ${row.lastName}`,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        // {
        //   name: "Phone",
        //   selector: (row) => row.phone,
        // },
        {
  name: "Approved",
  selector: (row) => (
    <div className="flex items-center gap-2">
      <select
        value={row.Approved}
        onChange={async (e) => {
          const action = e.target.value;

          if (action === "Approved") {
            // Prompt for password
            const { value: password } = await Swal.fire({
              title: `Approve ${row.firstName}?`,
              input: "text",
              inputLabel: "Set a password for mentor login",
              inputPlaceholder: "Enter password",
              showCancelButton: true,
            });

            if (!password) return;

            await axios.post("/auth/approve-mentor", {
              userId: row._id,
              password,
              action: "approve",
            });

            Swal.fire(
              "Approved!",
              "Mentor account activated successfully.",
              "success"
            );

          } else if (action === "Rejected") {
            await axios.post("/auth/approve-mentor", {
              userId: row._id,
              action: "reject",
            });

            Swal.fire("Rejected!", "Mentor account rejected.", "error");
          }

          // Refresh list
          fetchMentors();
        }}
        className={`px-2 py-1 rounded ${
          row.Approved === "Approved"
            ? "bg-green-500 text-white"
            : row.Approved === "Rejected"
            ? "bg-red-500 text-white"
            : "bg-yellow-500 text-black"
        }`}
      >
        <option value="pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  ),
},



        {
            name: "Action",
            cell: (row) => (
                <div className="flex items-center gap-2">


                    <FaEye size={22} className="text-green-500 cursor-pointer" onClick={() => handleView(row)} />
                    <FaEdit size={22} className="text-blue-500 cursor-pointer" onClick={() => handleEdit(row)} />
                    <FaTrash size={22} className="text-red-500 cursor-pointer" onClick={() => handleDelete(row)} />
                </div>
            ),
        },



    ];



    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Mentor Registration List</h1>
                <DataTable
                    columns={columns}
                    data={mentors}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                />
            </div>
        </Layout>
    );
}
