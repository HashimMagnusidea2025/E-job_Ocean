import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "../../../utils/axios.js";
import Layout from "../../seekerDashboard/partials/layout.jsx";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
export default function ContactUserList() {
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch contact data
    const fetchContacts = async () => {
        try {
            const res = await axios.get("/contact"); // adjust endpoint if needed
            setContactList(res.data);
        } catch (err) {
            console.error("Error fetching contact data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);


    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the contact.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/contact/${id}`);
                setContactList((prev) => prev.filter((item) => item._id !== id));
                Swal.fire("Deleted!", "Contact has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "Failed to delete contact.", "error");
            }
        }
    };


    // ✅ Define table columns
    const columns = [
        {
            name: "Full Name",
            selector: (row) => row.fullName || "N/A",
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email || "N/A",
            sortable: true,
        },
        {
            name: "Contact Number",
            selector: (row) => row.contactNumber || "N/A",
        },
        {
            name: "Message",
            selector: (row) => row.message || "—",
            grow: 2,
        },
        {
            name: "Date",
            selector: (row) => new Date(row.createdAt).toLocaleString(),
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="text-red-500 cursor-pointer"
                >
                   <FaTrash size={22}/>
                </button>
            ),
        },
    ];

    // ✅ Table custom styles
    const customStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#008080",
                color: "white",
            },
        },
        rows: {
            style: {
                fontSize: "14px",
                backgroundColor: "white",
                '&:nth-of-type(odd)': {
                    backgroundColor: "#f9f9f9",
                },
            },
        },
    };

    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-bold mb-4 text-[#008080]">📋 Contact User List</h2>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <DataTable
                        columns={columns}
                        data={contactList}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        customStyles={customStyles}
                    />
                </div>
            </div>
        </Layout>
    );
}
