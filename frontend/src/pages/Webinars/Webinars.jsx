import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import webinars1 from '../../media/png/webinars1.png'

const webinars = [
  {
    title: "Domains & Salaries in Finance - Live Webinar",
    date: "16 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Starting in 8:08:24",
    tag: "Live webinar",
    isUpcoming: true,
  },
  {
    title: "1:1 Resume Review - Live Webinar",
    date: "11 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Webinar conducted",
    tag: "Live webinar",
    isUpcoming: false,
  },
  {
    title: "MS Excel Live Training | By CA Archit Agarwal",
    date: "3 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Webinar conducted",
    tag: "Live webinar",
    isUpcoming: false,
  },
  {
    title: "Finance Interview Tips",
    date: "18 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Starting in 3:02:12",
    tag: "Live webinar",
    isUpcoming: true,
  },
  {
    title: "Finance Interview Tips",
    date: "18 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Starting in 3:02:12",
    tag: "Live webinar",
    isUpcoming: true,
  },
  {
    title: "Finance Interview Tips",
    date: "18 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Starting in 3:02:12",
    tag: "Live webinar",
    isUpcoming: true,
  },
  {
    title: "Finance Interview Tips",
    date: "18 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Starting in 3:02:12",
    tag: "Live webinar",
    isUpcoming: true,
  },
  {
    title: "Finance Interview Tips",
    date: "18 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Starting in 3:02:12",
    tag: "Live webinar",
    isUpcoming: true,
  },
  {
    title: "Finance Interview Tips",
    date: "18 Jul 2025 09:00 PM to 10:00 PM",
    image: webinars1,
    status: "Starting in 3:02:12",
    tag: "Live webinar",
    isUpcoming: true,
  },
];

export default function Webinarspage() {
  return (
    <div className="w-full font-[Poppins] bg-[#f7f9f8]">
      <Navbar />
      <div className="container mx-auto">

        <div className=" px-4 sm:px-6 md:px-10 py-10">
          <div className="flex justify-center items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Webinars</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Tabs */}
            <div className="lg:w-1/5 w-full">
              <div className="flex lg:flex-col gap-6 border-b lg:border-b-0 lg:border-r border-gray-300 pb-4 lg:pb-0 lg:pr-4 text-lg font-medium">
                <button className="text-gray-600 hover:text-black transition text-left">
                  Upcoming {webinars.filter((w) => w.isUpcoming).length}
                </button>
                <button className="text-gray-600 hover:text-black transition text-left">
                  Past {webinars.filter((w) => !w.isUpcoming).length}
                </button>
                <button className="text-gray-600 hover:text-black transition text-left">
                  All {webinars.length}
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="lg:w-4/5 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {webinars.map((webinar, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="relative">
                    <img src={webinar.image} alt={webinar.title} className="w-full h-52 object-cover" />
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                      {webinar.tag}
                    </span>
                    <span
                      className={`absolute bottom-2 left-2 text-white text-xs px-3 py-1 rounded ${webinar.isUpcoming
                        ? "bg-[#101828]"
                        : "bg-[#667085] opacity-90"
                        }`}
                    >
                      {webinar.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-black mb-2">{webinar.title}</h3>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                      <FaRegCalendarAlt />
                      <span>{webinar.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-black">Free</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
