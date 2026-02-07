import { useState, useEffect } from "react";
import axios from "../../../../utils/axios.js";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function OurFounders() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const res = await axios.get("/our-founders");
        setFounders(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFounders();
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-6">
          Our Founder
        </h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 md:px-12 py-20 bg-white">
      <h2 className="text-center text-3xl md:text-[50px] font-bold text-[#339ca0] mb-16">
        Our Founder
      </h2>

      <div className="space-y-24">
        {founders.map((founder, index) => {
          const isExpanded = expanded === founder._id;
          const shortText = founder.description.slice(0, 220);

          return (
            <div
              key={founder._id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center`}
            >
              {/* Image */}
              <div
                className={`flex justify-center ${
                  index % 2 !== 0 ? "md:order-2" : ""
                }`}
              >
                <img
                  src={`${baseURL}${founder.image}`}
                  alt={founder.name}
                  className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-[#339ca0]">
                  {founder.name}
                </h3>

                <p className="text-lg font-semibold text-gray-600">
                  {founder.desgination}
                </p>

                {/* Description Card */}
                <div className="bg-gray-50 border-l-4 border-[#339ca0] p-5 rounded-xl shadow-sm">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    {isExpanded
                      ? founder.description
                      : `${shortText}${founder.description.length > 220 ? "..." : ""}`}
                  </p>

                  {founder.description.length > 220 && (
                    <button
                      onClick={() =>
                        setExpanded(isExpanded ? null : founder._id)
                      }
                      className="mt-3 text-[#339ca0] font-semibold hover:underline"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
