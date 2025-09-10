import { FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

import Layout from "./partials/layout";
import powercolor from '../../media/jpg/power-color.jpg'
const companies = [
  {
    name: "Power Color",
    industry: "Fashion",
    location: "Albany",
    logo: powercolor,
    jobs: 2,
  },
  {
    name: "AutoSoft Dynamics",
    industry: "Information Technology",
    location: "Kennesaw",
    logo:powercolor,
    jobs: 0,
  },
  {
    name: "Web Design Studio",
    industry: "Information Technology",
    location: "Brighton",
    logo: powercolor,
    jobs: 0,
  },
  {
    name: "Web Design Studio",
    industry: "Information Technology",
    location: "Brighton",
    logo: powercolor,
    jobs: 0,
  },
];

export default function myFollowings() {
  return (

    <Layout>
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {companies.map((company, idx) => (
        <div
          key={idx}
          className="w-80 bg-white rounded-xl  shadow border p-6 text-center flex flex-col space-y-2"
        >
          <img
            src={company.logo}
            alt={`${company.name} Logo`}
            className="mx-auto w-16 h-16 object-contain rounded"
          />
          <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
          <p className="text-gray-500 text-sm">{company.industry}</p>
          <div className="flex items-center justify-center text-sm text-gray-500 gap-1">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>{company.location}</span>
          </div>







           <button
            className={`mt-3 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
              company.jobs > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-600 cursor-default"
            }`}
          >
            <FaBriefcase />
            {company.jobs} Open Jobs
          </button> 
        </div>
      ))}
    </div>
    </Layout>
  );
}
