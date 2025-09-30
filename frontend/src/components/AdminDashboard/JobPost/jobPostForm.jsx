import { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Layout from "../../seekerDashboard/partials/layout.jsx";

export default function JobPostForm() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    jobTitle: "",
    description: "",
    details_des: "",
    no_of_opning: "",
    qualification: "",
    experience: "",
    location: "",
    email: "",
    contact: "",
    name: "",
    file_attach: null,
  });

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/job-post");
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, [name]: files[0] });
    else setForm({ ...form, [name]: value });
  };

  // Handle form submission (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      if (editJob) {
        const { data } = await axios.put(`/job-post/${editJob._id}`, formData);
        Swal.fire({
          icon: "success",
          title: "Job Updated",
          text: "Job updated successfully!",
          confirmButtonColor: "#3085d6",
        });
      } else {
        const { data } = await axios.post("/job-post", formData);
        Swal.fire({
          icon: "success",
          title: "Job Created",
          text: "Job created successfully!",
          confirmButtonColor: "#3085d6",
        });
      }

      resetForm();
      fetchJobs();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error ${editJob ? "updating" : "creating"} job. Please try again.`,
        confirmButtonColor: "#d33",
      });
    }
  };

  // Delete job
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/job-post/${id}`);
        Swal.fire("Deleted!", "Job has been deleted.", "success");
        fetchJobs();
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete job.", "error");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      jobTitle: "",
      description: "",
      details_des: "",
      no_of_opning: "",
      qualification: "",
      experience: "",
      location: "",
      email: "",
      contact: "",
      name: "",
      file_attach: null,
    });
    setEditJob(null);
    setShowForm(false);
  };

  // Open edit form
  const handleEdit = (job) => {
    setEditJob(job);
    setForm({
      jobTitle: job.jobTitle || "",
      description: job.description || "",
      details_des: job.details_des || "",
      no_of_opning: job.no_of_opning || "",
      qualification: job.qualification || "",
      experience: job.experience || "",
      location: job.location || "",
      email: job.email || "",
      contact: job.contact || "",
      name: job.name || "",
      file_attach: null, // file input can't prefill
    });
    setShowForm(true);
  };

  // Open create form
  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // Add this at the top of your component
  const [filterText, setFilterText] = useState("");

  // Filtered jobs based on filterText
  const filteredJobs = jobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(filterText.toLowerCase()) ||
    (job.qualification && job.qualification.toLowerCase().includes(filterText.toLowerCase())) ||
    (job.location && job.location.toLowerCase().includes(filterText.toLowerCase()))
  );


  // Columns for DataTable
  const columns = [
    { name: "Job Title", selector: (row) => row.jobTitle, sortable: true },
    { name: "Qualification", selector: (row) => row.qualification, sortable: true },
    { name: "Experience", selector: (row) => row.experience },
    { name: "Location", selector: (row) => row.location },
    { name: "Openings", selector: (row) => row.no_of_opning },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setViewJob(row)} className="text-blue-500">
            <FaEye size={22} />
          </button>
          <button onClick={() => handleEdit(row)} className="text-yellow-500">
            <FaEdit size={22} />
          </button>
          <button onClick={() => handleDelete(row._id)} className="text-red-500">
            <FaTrash size={22} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Job Posts Management</h2>
          {/* Filter Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create New Job
          </button>

        </div>

        {/* Job List Table */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <DataTable
            columns={columns}
            data={filteredJobs} // use filteredJobs
            progressPending={loading}
            pagination
            highlightOnHover
            pointerOnHover
          />
        </div>

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{editJob ? "Edit Job Post" : "Create Job Post"}</h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Job Title</label>
                    <input
                      name="jobTitle"
                      placeholder="Job Title"
                      value={form.jobTitle}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Short Description</label>
                    <textarea
                      name="description"
                      placeholder="Short Description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Detailed Description</label>
                    <textarea
                      name="details_des"
                      placeholder="Detailed Description"
                      value={form.details_des}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Number of Openings</label>
                    <input
                      name="no_of_opning"
                      type="number"
                      placeholder="Number of Openings"
                      value={form.no_of_opning}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Qualification</label>
                    <input
                      name="qualification"
                      placeholder="Qualification"
                      value={form.qualification}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Experience</label>
                    <input
                      name="experience"
                      placeholder="Experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Location</label>
                    <input
                      name="location"
                      placeholder="Location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Contact</label>
                    <input
                      name="contact"
                      placeholder="Contact"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Your Name</label>
                    <input
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Attachment</label>
                    <input
                      name="file_attach"
                      type="file"
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      {editJob ? "Update Job" : "Create Job"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Job Details Modal */}
        {viewJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setViewJob(null)}
              >
                &times;
              </button>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">{viewJob.jobTitle}</h2>
                <div className="space-y-3">
                  <p><strong>Description:</strong> {viewJob.description}</p>
                  <p><strong>Details:</strong> {viewJob.details_des}</p>
                  <p><strong>Qualification:</strong> {viewJob.qualification}</p>
                  <p><strong>Experience:</strong> {viewJob.experience}</p>
                  <p><strong>Location:</strong> {viewJob.location}</p>
                  <p><strong>No of Openings:</strong> {viewJob.no_of_opning}</p>
                  <p><strong>Email:</strong> {viewJob.email}</p>
                  <p><strong>Contact:</strong> {viewJob.contact}</p>
                  <p><strong>Posted by:</strong> {viewJob.name}</p>
                  {viewJob.file_attach && (
                    <p className="mt-2">
                      <strong>Attachment:</strong>{" "}
                      <a
                        href={`/${viewJob.file_attach}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View File
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
