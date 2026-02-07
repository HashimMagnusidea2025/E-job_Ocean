import React, { useState, useEffect } from "react";
import Layout from './partials/layout';
import axios from '../../utils/axios.js';
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function MyWebinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndWebinars = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          Swal.fire("Error", "Please login to view your webinars", "error");
          setLoading(false);
          return;
        }

        // Fetch user details
        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);

        // Fetch webinar registrations for this user
        const registrationsRes = await axios.get(`/registrations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        

        // Filter registrations for the current user by email
        const userRegistrations = registrationsRes.data.filter(
          registration => registration.email === userRes.data.email
        );

        console.log("Filtered User Registrations:", userRegistrations);

        // Filter only webinar registrations
        const webinarRegistrations = userRegistrations.filter(
          reg => reg.type === "webinar" && reg.webinarId
        );

        console.log("Webinar Registrations:", webinarRegistrations);

        // Use only webinar registrations
        const allRegistrations = webinarRegistrations;

        // Populate the webinar details for each registration
        const populatedRegistrations = allRegistrations.map((registration) => {
          if (registration.type === "webinar" && registration.webinarId) {
            return {
              ...registration,
              webinarDetails: registration.webinarId,
              type: "webinar"
            };
          }
          return registration;
        });

        console.log("Populated Registrations:", populatedRegistrations);
        setWebinars(populatedRegistrations);

      } catch (err) {
        console.error("Error fetching registrations:", err);
        Swal.fire("Error", "Failed to load your webinars", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndWebinars();
  }, []);

  // Get webinar image
  const getWebinarImage = (webinar) => {
    if (webinar.type === "webinar" && webinar.webinarDetails?.WebinarImage) {
      return `${baseURL}${webinar.webinarDetails.WebinarImage}`;
    }
    return null;
  };

  // Get webinar title
  const getWebinarTitle = (webinar) => {
    if (webinar.type === "webinar") {
      return webinar.webinarId?.WebinarTitle;
    }
  };

  // Get speaker name
  const getSpeakerName = (webinar) => {
    if (webinar.type === "webinar" && webinar.webinarDetails?.Speakers && webinar.webinarDetails.Speakers.length > 0) {
      const speakers = webinar.webinarDetails.Speakers
        .map(speaker => `${speaker.salutation || ''} ${speaker.firstName || ''} ${speaker.lastName || ''}`.trim())
        .filter(name => name.length > 0);
      return speakers.length > 0 ? speakers.join(', ') : "Speaker";
    }
    return "Speaker";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get registration status
  const getRegistrationStatus = (webinar) => {
    return "Registered";
  };

  // Get session type
  const getSessionType = (webinar) => {
    if (webinar.type === "webinar") {
      return webinar.webinarId?.WebinarType;
    }

  };

  // Handle view button click
  const handleViewClick = (webinar) => {
    if (webinar.type === "webinar") {
      window.location.href = `/webinars/${webinar.webinarId?.WebinarSlug}`;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full bg-[#f6f8fd] p-6 sm:p-10 rounded shadow text-sm sm:text-base text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4">Loading your webinars...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Webinars</h1>
          <p className="text-gray-600 mt-2">
            {webinars.length > 0
              ? `You have registered for ${webinars.length} webinar${webinars.length > 1 ? 's' : ''}`
              : "You haven't registered for any webinars yet"
            }
          </p>
        </div>

        {webinars.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Webinars Yet</h3>
            <p className="text-gray-500 mb-6">You haven't registered for any webinars yet.</p>
            <button
              onClick={() => window.location.href = '/webinars'}
              className="bg-[#00b6bd] hover:bg-[#239da1] text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Browse Webinars
            </button>
          </div>
        ) : (
          webinars.map((webinar, index) => (
            <div key={webinar._id} className="w-full mx-auto bg-white shadow-sm border rounded-xl p-4 sm:p-6 md:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-shrink-0">
                  {getWebinarImage(webinar) ? (
                    <img
                      src={getWebinarImage(webinar)}
                      alt="Session Image"
                      className="rounded-lg border w-full sm:w-[120px] h-[120px] object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center';
                        fallback.innerHTML = `<span class="text-blue-600 font-bold text-lg">${getSpeakerName(webinar).charAt(0)}</span>`;
                        e.target.parentNode.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {getSpeakerName(webinar).charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Session Details */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {getWebinarTitle(webinar)}
                  </h3>

                  <p className="text-sm text-gray-600 font-medium">
                    {getSpeakerName(webinar)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRegistrationStatus(webinar) === "Registered"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                      }`}>
                      {getRegistrationStatus(webinar)}
                    </span>

                    <span className="bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full text-xs">
                      {getSessionType(webinar)}
                    </span>

                    {webinar.type === "webinar" && webinar.webinarDetails?.WebinarMode && (
                      <span className="bg-purple-100 text-purple-800 font-medium px-2 py-0.5 rounded-full text-xs">
                        {webinar.webinarDetails.WebinarMode}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Registered on:</span> {formatDate(webinar.createdAt)}
                    </div>

                    {webinar.selectDate && (
                      <div>
                        <span className="font-medium">Session Date:</span> {formatDate(webinar.selectDate)}
                      </div>
                    )}

                    {webinar.startTime && (
                      <div>
                        <span className="font-medium">Session Time:</span>{" "}
                        {new Date(webinar.startTime).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    )}


                    <div>
                      <span className="font-medium">Email:</span> {webinar.email}
                    </div>

                    <div>
                      <span className="font-medium">Mobile:</span> {webinar.mobile}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:self-start flex sm:flex-col gap-2">
                <button
                  onClick={() => handleViewClick(webinar)}
                  className="w-full sm:w-auto border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-600 hover:text-white transition"
                >
                  VIEW SESSION
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}