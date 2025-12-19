import { useState, useEffect } from 'react';
import axios from '../../../../utils/axios.js';
const baseURL = import.meta.env.VITE_BACKEND_URL;
export default function OurFounders() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const response = await axios.get('/our-founders');
        setFounders(response.data);
      } catch (err) {
        setError('Failed to load founders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFounders();
  }, []);

  if (loading) {
    return (
      <section className="text-center py-16 bg-white">
        <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-12">
          Our Founders
        </h2>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="text-center py-16 bg-white">
        <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-12">
          Our Founders
        </h2>
        <p>{error}</p>
      </section>
    );
  }

  if (founders.length === 0) {
    return (
      <section className="text-center py-16 bg-white">
        <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-12">
          Our Founders
        </h2>
        <p>No founders found.</p>
      </section>
    );
  }
  return (
    <section className="text-center py-16 bg-white">
      <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-12">
        Our Founders
      </h2>

      <div className="flex flex-wrap justify-center gap-10  mx-auto px-4">
        {founders.map((founder, index) => (
          <div
            key={founder._id || index}
            className="bg-white  shadow-lg rounded-xl p-6 max-w-[400px] w-full relative"
          >
            <div className="flex justify-center mb-4 relative">
              <img
                src={`${baseURL}${founder.image}`}
                alt={founder.name}
                className="w-32 h-32 object-cover rounded-full shadow-md"
              />
            </div>

            <h3 className="text-[22px] font-bold text-[#339ca0]">{founder.name}</h3>
            <p className="font-semibold text-[17px] mb-2">{founder.desgination}</p>
            <p className="text-sm text-gray-700">{founder.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
