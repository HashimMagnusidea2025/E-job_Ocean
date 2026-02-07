import { useEffect, useState } from "react";
import axios from "../../../../utils/axios.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import noImg from '../../../../media/png/no-image.png'; // fallback image

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function MeetOurTeam() {
  const [team, setTeam] = useState([]);

  // Fetch team data from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get("/meet-our-team/status");
        setTeam(res.data);
      } catch (err) {
        console.error("Failed to fetch team:", err);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="w-full bg-white py-12 px-4 font-[Poppins]">
      <div className="max-w-[1920px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[40px] font-bold">
            <span className="text-[#339ca0]">Meet Our Team</span>
          </h2>
        </div>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1920: { slidesPerView: 4 },
          }}
          modules={[Navigation]}
          className="relative"
        >
          {team.length > 0 ? (
            team.map((member) => (
              <SwiperSlide key={member._id}>
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-[300px] mx-auto">
                  <div className="relative">
                    <img
                      src={member.image ? `${baseURL}${member.image}` : noImg}
                      alt={member.name}
                      className="w-full h-64 object-cover rounded-t-xl"
                    />
                    {/* Status Badge */}
                    {/* <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        member.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {member.status}
                    </span> */}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{member.name}</h3>
                    {/* <p className="text-gray-600 text-sm mb-2">{member.text}</p> */}
                    <p className="text-gray-500 italic text-sm line-clamp-2">
                      <span className="inline-block mr-1">❝</span>
                      {member.text}
                      <span className="inline-block ml-1">❞</span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="h-[300px] flex items-center justify-center text-gray-500 text-lg border border-gray-300 rounded-lg w-[300px] mx-auto">
                No team members found
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
}
