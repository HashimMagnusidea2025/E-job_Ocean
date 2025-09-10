import {
  FaVideo,
  FaBriefcase,
  FaPencilAlt,
  FaBookOpen,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function KeyHighlights() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div className="w-full px-4 flex justify-center font-[Poppins] bg-[#f7f9f8] py-16">
      <div
        className="bg-white border border-[#f1e9dd] rounded-2xl p-6 sm:p-8 w-full max-w-[920px] shadow-md"
        data-aos="zoom-in"
        data-aos-duration="1000"
      >
        <h2
          className="text-center text-3xl sm:text-4xl md:text-[44px] font-semibold mb-10 leading-tight"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          Key <span className="text-[#339ca0]">Highlights</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-left text-[#090A47]">
          <div
            className="flex items-start gap-4"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <FaVideo className="text-[#339ca0] mt-1" size={30} />
            <div>
              <h4 className="font-semibold text-xl sm:text-2xl leading-snug">
                25+ Hours
              </h4>
              <p className="text-sm sm:text-base mt-1 text-[#333]">
                Video Lectures to target Big 4s
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4"
            data-aos="fade-left"
            data-aos-delay="100"
            data-aos-duration="1000"
          >
            <FaBriefcase className="text-[#339ca0] mt-1" size={30} />
            <div>
              <h4 className="font-semibold text-xl sm:text-2xl leading-snug">
                30+ Resources
              </h4>
              <p className="text-sm sm:text-base mt-1 text-[#333]">
                Interview & LinkedIn Resources
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4"
            data-aos="fade-right"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <FaPencilAlt className="text-[#339ca0] mt-1" size={30} />
            <div>
              <h4 className="font-semibold text-xl sm:text-2xl leading-snug">
                Technical Training
              </h4>
              <p className="text-sm sm:text-base mt-1 text-[#333]">
                Finance, Auditing & Excel Training
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4"
            data-aos="fade-left"
            data-aos-delay="300"
            data-aos-duration="1000"
          >
            <FaBookOpen className="text-[#339ca0] mt-1" size={30} />
            <div>
              <h4 className="font-semibold text-xl sm:text-2xl leading-snug">
                Interview Training
              </h4>
              <p className="text-sm sm:text-base mt-1 text-[#333]">
                Resume & Personal Interviews Mock Trainings
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4"
            data-aos="fade-right"
            data-aos-delay="400"
            data-aos-duration="1000"
          >
            <FaBook className="text-[#339ca0] mt-1" size={30} />
            <div>
              <h4 className="font-semibold text-xl sm:text-2xl leading-snug">
                Revision Booklet
              </h4>
              <p className="text-sm sm:text-base mt-1 text-[#333]">
                Revision Booklet For Interviews
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4"
            data-aos="fade-left"
            data-aos-delay="500"
            data-aos-duration="1000"
          >
            <FaCheckCircle className="text-[#339ca0] mt-1" size={30} />
            <div>
              <h4 className="font-semibold text-xl sm:text-2xl leading-snug">
                Placement Assistance
              </h4>
              <p className="text-sm sm:text-base mt-1 text-[#333]">
                Get Free Placement Assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
