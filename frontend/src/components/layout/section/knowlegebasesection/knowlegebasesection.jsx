import React, { useEffect, useState } from "react";
import axios from "../../../../utils/axios.js"; // ✅ same axios jo project me use ho
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useNavigate } from "react-router-dom";
export default function KnowlegeBaseSection() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/knowlege-base");
        if (res.data?.success) {
          setData(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  //  TEMP DEBUG (important)
  console.log("Knowledge Base Data:", data);

  if (!data.length) {
    return null; // ya loader
  }

  return (
    <div className="container mx-auto my-20 px-4">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#339ca0] text-center sm:text-left">
          Knowledge Base
        </h2>

        <button
          onClick={() => navigate("/knowledge-base")}
          className="mx-auto sm:mx-0 w-fit
      bg-gradient-to-r from-[#339ca0] to-black text-white
      px-4 sm:px-5 py-2
      rounded-lg font-medium
      text-base sm:text-lg
      transition-all duration-300
      hover:scale-105 hover:shadow-lg"
        >
          View All →
        </button>
      </div>


      {/* Slider */}
      <Splide
        options={{
          perPage: 3,
          gap: "1rem",
          arrows: true,
          pagination: true,
          breakpoints: {
            1024: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
      >
        {data.map((item, index) => (
          <SplideSlide key={index}>
            <div className="h-full bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {item.description}
              </p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
