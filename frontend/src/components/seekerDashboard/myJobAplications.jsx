import React, { useState, useEffect } from "react";
import Layout from './partials/layout';
import axios from '../../utils/axios.js';
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function MyJobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user data and applications
  useEffect(() => {
    const fetchUserAndApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          Swal.fire("Error", "Please login to view your applications", "error");
          setLoading(false);
          return;
        }

        // Fetch user data
        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);

        // Fetch user's job applications using email
        const applicationsRes = await axios.get(`/job-register/user/applications?email=${userRes.data.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Applications API Response:", applicationsRes.data);

        if (applicationsRes.data.success) {
          setApplications(applicationsRes.data.registrations);

          // Debug: Check skills data
          applicationsRes.data.registrations.forEach((app, index) => {
            console.log(`Application ${index} skills:`, app.jobId?.skills);
          });
        }

      } catch (err) {
        console.error("Error fetching applications:", err);
        Swal.fire("Error", "Failed to load your applications", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndApplications();
  }, []);

  // Get company logo
  const getCompanyLogo = (application) => {
    if (application.jobId?.companyId?.company?.employerLogo) {
      return `${baseURL}${application.jobId.companyId.company.employerLogo}`;
    }
    return null;
  };

  // Get company name
  const getCompanyName = (application) => {
    return application.jobId?.companyId?.company?.name || "Company";
  };

  // Get job title
  const getJobTitle = (application) => {
    return application.jobId?.jobTitle || "Job Title Not Available";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get application status
  const getApplicationStatus = (application) => {
    return "Under Review";
  };

  // ✅ FIXED: Get skills with proper handling
  const getSkills = (application) => {
    const skills = application.jobId?.skills || [];
    console.log("Processing skills for application:", skills);

    return skills.map(skill => {
      // Agar skill object hai aur usme name property hai
      if (typeof skill === 'object' && skill.name) {
        return skill.name;
      }
      // Agar skill string hai
      else if (typeof skill === 'string') {
        return skill;
      }
      // Agar skill object hai but name nahi hai
      else if (typeof skill === 'object') {
        return JSON.stringify(skill); // Fallback
      }
      return "Unknown Skill";
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full bg-[#f6f8fd] p-6 sm:p-10 rounded shadow text-sm sm:text-base text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4">Loading your applications...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Job Applications</h1>
          <p className="text-gray-600 mt-2">
            {applications.length > 0
              ? `You have applied for ${applications.length} job${applications.length > 1 ? 's' : ''}`
              : "You haven't applied to any jobs yet"
            }
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Yet</h3>
            <p className="text-gray-500 mb-6">You haven't applied to any jobs yet.</p>
            <button
              onClick={() => window.location.href = '/placement-program'}
              className="bg-[#00b6bd] hover:bg-[#239da1] text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          applications.map((application, index) => {
            const skills = getSkills(application);

            return (
              <div key={application._id} className="w-full mx-auto bg-white shadow-sm border rounded-xl p-4 sm:p-6 md:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Left Section */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    {getCompanyLogo(application) ? (
                      <img
                        src={getCompanyLogo(application)}
                        alt="Company Logo"
                        className="rounded-lg border w-full sm:w-[120px] h-[120px] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center';
                          fallback.innerHTML = `<span class="text-blue-600 font-bold text-lg">${getCompanyName(application).charAt(0)}</span>`;
                          e.target.parentNode.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className="w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {getCompanyName(application).charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {getJobTitle(application)}
                    </h3>

                    <p className="text-sm text-gray-600 font-medium">
                      {getCompanyName(application)}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatus(application) === "Under Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : getApplicationStatus(application) === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : getApplicationStatus(application) === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}>
                        {getApplicationStatus(application)}
                      </span>

                      {application.jobId?.jobType?.name && (
                        <span className="bg-gray-100 text-gray-800 font-medium px-2 py-0.5 rounded-full text-xs">
                          {application.jobId.jobType.name}
                        </span>
                      )}

                      {application.jobId?.jobShift?.name && (
                        <span className="bg-purple-100 text-purple-800 font-medium px-2 py-0.5 rounded-full text-xs">
                          {application.jobId.jobShift.name}
                        </span>
                      )}
                    </div>

                    {/* Application Details */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Applied on:</span> {formatDate(application.createdAt)}
                      </div>
                      {/* <div>
                        <span className="font-medium">Application ID:</span> {application._id.slice(-8)}
                      </div> */}
                      <div>
                        <span className="font-medium">Email:</span> {application.email}
                      </div>
                      <div>
                        <span className="font-medium">Mobile:</span> {application.mobile}
                      </div>
                    </div>

                    {/* ✅ FIXED: Skills Section */}
                    {skills.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700">Required Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skills.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 4 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              +{skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="sm:self-start flex sm:flex-col gap-2">
                  <button
                    onClick={() => {
                      window.location.href = `/job-details/${application.jobId?._id}`;
                    }}
                    className="w-full sm:w-auto border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-600 hover:text-white transition"
                  >
                    VIEW JOB
                  </button>

                  <button
                    onClick={() => {
                      Swal.fire({
                        title: "Withdraw Application?",
                        text: "Are you sure you want to withdraw this application?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, withdraw it!"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // Implement withdrawal logic here
                          Swal.fire("Withdrawn!", "Your application has been withdrawn.", "success");
                        }
                      });
                    }}
                    className="w-full sm:w-auto border border-red-600 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-600 hover:text-white transition"
                  >
                    WITHDRAW
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}