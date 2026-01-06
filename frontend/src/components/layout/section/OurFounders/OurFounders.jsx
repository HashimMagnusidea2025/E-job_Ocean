import { useState, useEffect } from "react";
import axios from "../../../../utils/axios.js";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function OurFounders() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);

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
          Our Founders
        </h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 md:px-12 py-20 bg-white">
      <h2 className="text-center text-3xl md:text-[50px] font-bold text-[#339ca0] mb-16">
        Our Founders
      </h2>

      <div className="space-y-24">
        {founders.map((founder, index) => (
          <div
            key={founder._id}
            className={`grid grid-cols-1 md:grid-cols-2 gap-7  items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
          >
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={`${baseURL}${founder.image}`}
                alt={founder.name}
                className="w-full max-w-md rounded-xl shadow-xl object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#339ca0] mb-2">
                {founder.name}
              </h3>

              <p className="text-lg font-semibold text-gray-700 mb-4">
                {founder.desgination}
              </p>

              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {founder.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
