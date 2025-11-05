import React from "react";
import {
  FaUserGraduate,
  FaHandshake,
  FaUsers,
  FaSearch,
} from "react-icons/fa";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import axios from '../../../../utils/axios.js';
import { useState, useEffect, Suspense, lazy } from "react";
export default function StatsSection() {

  const [data, setData] = useState()
  const fetchCompanydata = async () => {
    try {
      const response = await axios.get('/general-settings'); // backend endpoint
      console.log("✅ Full Response:", response);              // logs full Axios response object
      console.log("✅ Data Received:", response.data);          // logs only your actual data

      setData(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch company logo:", error);
    }
  };

  useEffect(() => {
    fetchCompanydata();
  }, []);

  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    {
      icon: <FaUserGraduate size={60} />,
      count: 17000,
      suffix: "+",
      label: "Learners",
    },
    {
      icon: <FaHandshake size={60} />,
      count: 1000,
      suffix: "+",
      label: "Placements",
    },
    {
      icon: <FaUsers size={60} />,
      count: 500,
      suffix: "+",
      label: "Vacancies",
    },
    {
      icon: <FaSearch size={60} />,
      count: 30,
      suffix: "+",
      label: "Recruiters",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Top Heading */}
      <div className="container mx-auto py-20">
        <h2 className="text-center text-3xl sm:text-4xl font-semibold text-[#339ca0] mb-10">
          Become Industry-Ready With Applied Learning.
        </h2>
      </div>

      {/* Background Section */}
      <div className="font-[Poppins] overflow-hidden relative bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]">
        <section className="container mx-auto py-20">
          {/* Background Circles */}
          <ul className="circles">
            {Array.from({ length: 100 }).map((_, i) => (
              <li key={i}></li>
            ))}
          </ul>

          {/* Main Content */}
          <div className="relative z-10 container mx-auto px-4" ref={ref}>
            {/* Subheading */}
            <div className="text-white mb-10 max-w-3xl mx-auto text-center">
              <h3 className="text-[34px] sm:text-[50px] font-semibold  mb-2">
                About {data?.name}
              </h3>
              <p className="text-sm sm:text-base text-white">
                We believe in the power of learning & are committed to offering
                training courses that are thorough, practical and aligned to
                industry dynamics.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-white w-36 sm:w-40 md:w-48"
                >
                  <div className="mb-2">{item.icon}</div>
                  <h3 className="text-2xl font-bold">
                    {inView ? (
                      <CountUp
                        start={0}
                        end={item.count}
                        duration={2}
                        separator=","
                        suffix={item.suffix}
                      />
                    ) : (
                      "0" + item.suffix
                    )}
                  </h3>
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
