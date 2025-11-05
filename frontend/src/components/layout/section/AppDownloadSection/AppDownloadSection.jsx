import { useState, useEffect, Suspense, lazy } from "react";
import phoneMockup from '../../../../media/logo/phone_3-.png'
import axios from '../../../../utils/axios.js'
import { BsWhatsapp } from "react-icons/bs";
import { FaTelegram } from "react-icons/fa6";
import { CiYoutube } from "react-icons/ci";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { CiTwitter } from "react-icons/ci";

export default function AppDownloadSection() {

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

  return (
    <div className="w-full bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]">
      <div className="relative h-[500px] overflow-hidden font-[Poppins]">
        {/* Ripple Circles */}
        <div className="ripple-background absolute bottom-0 left-0 z-1">
          <div className="circle xxlarge shade1"></div>
          <div className="circle xlarge shade2"></div>
          <div className="circle large shade3"></div>
          <div className="circle medium shade4"></div>
          <div className="circle small shade5"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full  h-full py-10 px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="w-full container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Phone Image */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
              <img
                src={phoneMockup}
                alt="Phone Mockup"
                className="w-64 sm:w-80 md:w-96 lg:w-[540px]"
              />
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left flex items-center justify-center gap-6 flex-col">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow">
                Download {data?.name} App
              </h2>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                <button className="bg-black text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 shadow hover:bg-gray-800 transition-all">
                  For Android
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 shadow hover:bg-gray-800 transition-all">
                  For iOS
                </button>
              </div>

              {/* Social Media Icons */}
              <div className="border-t border-white/40 pt-4">
                <p className="font-semibold mb-5 text-white text-lg pt-4">Follow Us On Social Media</p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-2xl">
                  {[BsWhatsapp, FaTelegram, CiYoutube, FaInstagramSquare, FaLinkedinIn, CiTwitter].map((Icon, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-full hover:scale-110 transition-all cursor-pointer">
                      <Icon className={`text-${['green', 'blue', 'red', 'pink', 'blue', 'sky'][idx]}-500 hover:text-white`} size={35} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





// ✅ Placement Program Section with same design



export function PlacementProgramSection() {
  return (
    <div className='container mx-auto'>
      <div className=" py-28 px-4 sm:px-6 md:px-10 font-[Poppins] overflow-hidden">

        {/* Ripple Circles */}
        <div className="ripple-background absolute inset-0 z-0">
          <div className="circle xxlarge shade1"></div>
          <div className="circle xlarge shade2"></div>
          <div className="circle large shade3"></div>
          <div className="circle medium shade4"></div>
          <div className="circle small shade5"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left: Phone Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <img
              src={phoneMockup}
              alt="Phone Mockup"
              className="w-64 sm:w-80 md:w-96 lg:w-[500px]"
            />
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col justify-center items-center lg:items-start">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow">
              Join Our Placement Program
            </h2>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <button className="bg-black text-white px-6 py-3 rounded-md shadow hover:bg-gray-800 transition-all">
                Apply Now
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-md shadow hover:bg-gray-800 transition-all">
                Know More
              </button>
            </div>

            {/* Social Media Section */}
            <div className="border-t border-white/40 pt-6 text-white w-full">
              <p className="font-semibold text-lg mb-4 text-center lg:text-left">
                Follow Us On Social Media
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-2xl">
                <div className="bg-white p-3 rounded-full hover:bg-green-600 transition-all">
                  <BsWhatsapp className="text-green-500 hover:text-white transition-transform hover:scale-110 cursor-pointer" size={30} />
                </div>
                <div className="bg-white p-3 rounded-full hover:bg-blue-500 transition-all">
                  <FaTelegram className="text-blue-400 hover:text-white transition-transform hover:scale-110 cursor-pointer" size={30} />
                </div>
                <div className="bg-white p-3 rounded-full hover:bg-red-500 transition-all">
                  <CiYoutube className="text-red-500 hover:text-white transition-transform hover:scale-110 cursor-pointer" size={30} />
                </div>
                <div className="bg-white p-3 rounded-full hover:bg-pink-500 transition-all">
                  <FaInstagramSquare className="text-pink-500 hover:text-white transition-transform hover:scale-110 cursor-pointer" size={30} />
                </div>
                <div className="bg-white p-3 rounded-full hover:bg-blue-800 transition-all">
                  <FaLinkedinIn className="text-blue-700 hover:text-white transition-transform hover:scale-110 cursor-pointer" size={30} />
                </div>
                <div className="bg-white p-3 rounded-full hover:bg-sky-500 transition-all">
                  <CiTwitter className="text-sky-400 hover:text-white transition-transform hover:scale-110 cursor-pointer" size={30} />
                </div>
              </div>

              {/* Telegram CTA */}
              <div className="pt-8 text-center lg:text-left">
                <h3 className="text-[22px] sm:text-[26px] lg:text-[28px] font-medium mb-4">
                  Get Job/Articleship Updates on Telegram
                </h3>
                <button className="text-[18px] bg-black text-white px-6 py-3 rounded-md shadow hover:bg-gray-800 transition-all">
                  Join Us On Telegram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

