import React, { useState, useEffect } from "react";
import Layout from './partials/layout';
import axios from '../../utils/axios.js';
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function MyOneToOneSession() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndSessions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          Swal.fire("Error", "Please login to view your sessions", "error");
          setLoading(false);
          return;
        }

        // Fetch user details
        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);

        // Fetch ALL webinar registrations for this user (both webinar and one-to-one)
        const registrationsRes = await axios.get(`/registrations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        

        // Filter registrations for the current user by email
        const userRegistrations = registrationsRes.data.filter(
          registration => registration.email === userRes.data.email
        );

        console.log("Filtered User Registrations:", userRegistrations);

        // Separate webinars and one-to-one sessions
        const webinarRegistrations = userRegistrations.filter(
          reg => reg.type === "webinar" && reg.webinarId
        );

        const oneToOneRegistrations = userRegistrations.filter(
          reg => reg.type === "one_to_one" && reg.one_to_oneId
        );

        console.log("Webinar Registrations:", webinarRegistrations);
        console.log("One-to-One Registrations:", oneToOneRegistrations);

        // Use only one-to-one registrations
        const allRegistrations = oneToOneRegistrations;

        // Populate the session details for each registration
        const populatedRegistrations = await Promise.all(
          allRegistrations.map(async (registration) => {
            if (registration.type === "one_to_one" && registration.one_to_oneId) {
              try {
                const oneToOneDetails = await axios.get(
                  `/one-to-one/${registration.one_to_oneId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                return {
                  ...registration,
                  oneToOneDetails: oneToOneDetails.data,
                  type: "one_to_one"
                };
              } catch (err) {
                console.error("Error fetching one-to-one details:", err);
                return registration;
              }
            }
            return registration;
          })
        );

        console.log("Populated Registrations:", populatedRegistrations);
        setSessions(populatedRegistrations);

      } catch (err) {
        console.error("Error fetching registrations:", err);
        Swal.fire("Error", "Failed to load your sessions", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSessions();
  }, []);

  // Get session image
  const getSessionImage = (session) => {
    if (session.type === "one_to_one" && session.oneToOneDetails?.Speaker?.profileImage) {
      return `${baseURL}${session.oneToOneDetails.Speaker.profileImage}`;
    }
    return null;
  };

  // Get session title
  const getSessionTitle = (session) => {
    if (session.type === "one_to_one") {
      const expert = session.oneToOneDetails?.Speaker || session.oneToOneDetails?.Mentor;
      if (expert) {
        return `One-on-One Session with ${expert.salutation || ''} ${expert.firstName || ''} ${expert.lastName || ''}`.trim();
      }
      return "One-on-One Session";
    }
    return "Session Title Not Available";
  };

  // Get speaker name
  const getSpeakerName = (session) => {
    if (session.type === "one_to_one") {
      const expert = session.oneToOneDetails?.Speaker || session.oneToOneDetails?.Mentor;
      if (expert) {
        return `${expert.salutation || ''} ${expert.firstName || ''} ${expert.lastName || ''}`.trim();
      }
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
  const getRegistrationStatus = (session) => {
    return "Registered";
  };

  // Get session type
  const getSessionType = (session) => {
    if (session.type === "one_to_one") {
      return "One-on-One";
    }
    return "Session";
  };

  // Handle view button click
  const handleViewClick = (session) => {
    if (session.type === "one_to_one") {
      window.location.href = `/hall-of-fame`;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full bg-[#f6f8fd] p-6 sm:p-10 rounded shadow text-sm sm:text-base text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4">Loading your sessions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My One-to-One Sessions</h1>
          <p className="text-gray-600 mt-2">
            {sessions.length > 0
              ? `You have registered for ${sessions.length} session${sessions.length > 1 ? 's' : ''}`
              : "You haven't registered for any one-to-one sessions yet"
            }
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Sessions Yet</h3>
            <p className="text-gray-500 mb-6">You haven't registered for any one-to-one sessions yet.</p>
            <button
              onClick={() => window.location.href = '/one-to-one'}
              className="bg-[#00b6bd] hover:bg-[#239da1] text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Browse Sessions
            </button>
          </div>
        ) : (
          sessions.map((session, index) => (
            <div key={session._id} className="w-full mx-auto bg-white shadow-sm border rounded-xl p-4 sm:p-6 md:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-shrink-0">
                  {getSessionImage(session) ? (
                    <img
                      src={getSessionImage(session)}
                      alt="Session Image"
                      className="rounded-lg border w-full sm:w-[120px] h-[120px] object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center';
                        fallback.innerHTML = `<span class="text-blue-600 font-bold text-lg">${getSpeakerName(session).charAt(0)}</span>`;
                        e.target.parentNode.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {getSpeakerName(session).charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Session Details */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {getSessionTitle(session)}
                  </h3>

                  <p className="text-sm text-gray-600 font-medium">
                    {getSpeakerName(session)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      getRegistrationStatus(session) === "Registered"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {getRegistrationStatus(session)}
                    </span>

                    <span className="bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full text-xs">
                      {getSessionType(session)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Registered on:</span> {formatDate(session.createdAt)}
                    </div>

                    {session.selectDate && (
                      <div>
                        <span className="font-medium">Session Date:</span> {formatDate(session.selectDate)}
                      </div>
                    )}

                    {session.startTime && (
                      <div>
                        <span className="font-medium">Session Time:</span> {session.startTime}
                      </div>
                    )}

                    <div>
                      <span className="font-medium">Email:</span> {session.email}
                    </div>

                    <div>
                      <span className="font-medium">Mobile:</span> {session.mobile}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:self-start flex sm:flex-col gap-2">
                <button
                  onClick={() => handleViewClick(session)}
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