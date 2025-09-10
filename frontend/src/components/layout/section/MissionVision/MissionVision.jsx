import Mission from '../../../../media/jpg/Mission.jpg';
import workingteamoffice from '../../../../media/jpg/working-team-office.jpg';

import { FaMapPin,FaEye } from "react-icons/fa";
export default function MissionVision() {
  return (
    <div className="px-4 sm:px-6 md:px-28 py-16 bg-white ">
      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 mb-20">
        <div>
          <div className="flex items-center mb-4">
            <span className="text-[#339ca0] text-2xl mr-3"><FaMapPin /></span>
            <h2 className="text-3xl font-bold text-[#339ca0]">Our Mission</h2>
          </div>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            To provide an edge to participants through Practical Training and Applied Learning in line with the Industry expectations.
          </p>
        </div>
        <div className="w-full flex justify-center">
          <img
            src={Mission}
            alt="Teamwork"
            className="rounded-lg shadow-xl w-full max-w-md md:max-w-lg"
          />
        </div>
      </div>

      {/* Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div className="w-full flex justify-center order-1 md:order-none">
          <img
            src={workingteamoffice}
            alt="Vision"
            className="rounded-lg shadow-xl w-full max-w-md md:max-w-lg"
          />
        </div>
        <div>
          <div className="flex items-center mb-4">
            <span className="text-[#339ca0] text-2xl mr-3"><FaEye /></span>
            <h2 className="text-3xl font-bold text-[#339ca0]">Our Vision</h2>
          </div>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            To equip learners with industry-relevant skills through practical exposure and mentorship-driven learning culture.
          </p>
        </div>
      </div>
    </div>
  );
}
