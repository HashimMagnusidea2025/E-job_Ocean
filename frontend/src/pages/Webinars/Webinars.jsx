import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { WebinarCardsList, HallOfFameCards } from "../../components/ui/cards/cards";
import axios from "../../utils/axios.js";
const baseURL = import.meta.env.VITE_BACKEND_URL;
export default function WebinarspageList({ webinar }) {
  const [webinars, setWebinars] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [speakers, setSpeakers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRegisterClick = (webinar) => {
    console.log("User clicked register for webinar:", webinar);
  };


  //  Fetch Active Speakers 
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const { data } = await axios.get("/speakers/active");
        setSpeakers(data);
        console.log("Fetched Speakers:", data);
      } catch (error) {
        console.error("Failed to fetch speakers:", error);
      }
    };
    fetchSpeakers();
  }, []);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const { data } = await axios.get("/webinars/active");
        // Ensure all dates are valid
        const validData = data.map((w) => ({
          ...w,
          WebinarStartDateTime: new Date(w.WebinarStartDateTime),
          WebinarEndDateTime: new Date(w.WebinarEndDateTime),
        }));
        setWebinars(validData);
        console.log(validData);

      } catch (err) {
        console.error("Error fetching webinars:", err);
      }
    };
    fetchWebinars();
  }, []);

  // const getWebinarImage = (webinar) => {
  //   // Multiple speakers → WebinarImage
  //   if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
  //     return `${baseURL}${webinar.WebinarImage}`;
  //   }

  //   // Single speaker → Speaker profilePic
  //   if (
  //     webinar.Speakers &&
  //     webinar.Speakers.length === 1 &&
  //     webinar.Speakers[0].profilePic
  //   ) {
  //     return `${baseURL}/${webinar.Speakers[0].profilePic}`;
  //   }

  //   // Fallback image
  //   return "/default-webinar.png";
  // };

  const getWebinarImage = (webinar) => {
    // ✅ CASE 1: Multiple speakers → WebinarImage
    if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
      return `${baseURL}${webinar.WebinarImage}`;
    }

    // ✅ CASE 2: Single speaker (NEW structure)
    if (
      webinar.Speakers &&
      webinar.Speakers.length === 1 &&
      webinar.Speakers[0]?.profilePic
    ) {
      return `${baseURL}/${webinar.Speakers[0].profilePic}`;
    }

    // ✅ CASE 3: Single speaker (OLD structure)
    if (webinar.Speaker?.profilePic) {
      return `${baseURL}/${webinar.Speaker.profilePic}`;
    }

    // ✅ FALLBACK
    return "/default-webinar.png";
  };


  const now = new Date();

  // const filteredWebinars = webinars.filter((webinar) => {
  //   const start = new Date(webinar.WebinarStartDateTime);
  //   const end = new Date(webinar.WebinarEndDateTime);

  //   if (activeTab === "upcoming") {
  //     return start >= now; // upcoming
  //   } else if (activeTab === "past") {
  //     return end < now; // past
  //   } else if (activeTab === "Speaker") {
  //     return end < now; // past
  //   } else {
  //     return true; // all
  //   }
  // });

  // ✅ Filter webinars only if not in Speaker tab
  let filteredWebinars = webinars.filter((webinar) => {
    if (activeTab === "upcoming") {
      return new Date(webinar.WebinarStartDateTime) >= now;
    } else if (activeTab === "past") {
      return new Date(webinar.WebinarEndDateTime) < now;
    } else if (activeTab === "all") {
      return true;
    } else {
      return false; // don't show webinars in Speaker tab
    }
  });

  // Apply search filter for webinars
  filteredWebinars = filteredWebinars.filter((webinar) => {
    if (!searchTerm) return true;
    const title = webinar.WebinarTitle?.toLowerCase() || '';
    const speakers = webinar.Speakers?.map(s => s.name?.toLowerCase()).join(' ') || '';
    return title.includes(searchTerm.toLowerCase()) || speakers.includes(searchTerm.toLowerCase());
  });

  // Filter speakers based on search
  const filteredSpeakers = speakers.filter((speaker) => {
    if (!searchTerm) return true;
    const name = `${speaker.firstName || ''} ${speaker.lastName || ''}`.toLowerCase().trim();
    return name.includes(searchTerm.toLowerCase());
  });

  // Sort only for "all" tab
  if (activeTab === "all") {
    filteredWebinars.sort((a, b) => {
      const aEnd = new Date(a.WebinarEndDateTime);
      const bEnd = new Date(b.WebinarEndDateTime);

      // Upcoming webinars first (end > now)
      const aIsUpcoming = aEnd >= now;
      const bIsUpcoming = bEnd >= now;

      if (aIsUpcoming && !bIsUpcoming) return -1; // a comes first
      if (!aIsUpcoming && bIsUpcoming) return 1;  // b comes first
      return new Date(a.WebinarStartDateTime) - new Date(b.WebinarStartDateTime); // then sort by start time
    });
  }


  return (
    <div className="w-full font-[Poppins] bg-[#f7f9f8]">
      <Navbar />
      <div className="container mx-auto">

        <div className="px-4 sm:px-6 md:px-10 py-10">

          <div className="flex justify-end">
            <input
              type="text"
              placeholder={activeTab === "Speaker" ? "Search speakers..." : "Search webinars..."}
              className="w-64 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          <div className="flex justify-center items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {activeTab === "Speaker" ? "Speakers" : "Webinars"}
            </h2>

          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Tabs */}
            <div className="lg:w-1/5 w-full">
              <div className="flex lg:flex-col gap-6 border-b lg:border-b-0 lg:border-r border-gray-300 pb-4 lg:pb-0 lg:pr-4 text-lg font-medium">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`text-left transition ${activeTab === "upcoming"
                    ? "text-black font-bold"
                    : "text-gray-600 hover:text-black"
                    }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`text-left transition ${activeTab === "past"
                    ? "text-black font-bold"
                    : "text-gray-600 hover:text-black"
                    }`}
                >
                  Past
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`text-left transition ${activeTab === "all"
                    ? "text-black font-bold"
                    : "text-gray-600 hover:text-black"
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("Speaker")}
                  className={`text-left transition ${activeTab === "Speaker"
                    ? "text-black font-bold"
                    : "text-gray-600 hover:text-black"
                    }`}
                >
                  Speaker
                </button>
              </div>
            </div>

            {/* Cards */}
            {/* <div className="lg:w-4/5 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWebinars.length > 0 ? (
                filteredWebinars.map((webinar) => (
                  <WebinarCardsList key={webinar._id} webinar={webinar}
                    onRegisterClick={handleRegisterClick} />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">
                  No webinars found
                </p>
              )}
            </div> */}
            <div className="lg:w-4/5 w-full">
              {activeTab === "Speaker" ? (
                //  SPEAKER VIEW
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center ">
                  {filteredSpeakers.length > 0 ? (
                    filteredSpeakers.map((speaker, index) => (
                      <HallOfFameCards key={index} speaker={speaker} />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 col-span-full">
                      No active speakers found
                    </p>
                  )}
                </div>
              ) : (
                //  WEBINAR VIEW
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredWebinars.length > 0 ? (
                    filteredWebinars.map((webinar) => (
                      <WebinarCardsList
                        key={webinar._id}
                        webinar={webinar}
                        image={getWebinarImage(webinar)}   // ✅ yahan image pass
                        onRegisterClick={handleRegisterClick}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full text-center">
                      No webinars found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
