import { FaMapMarkerAlt } from "react-icons/fa";
import noImage from "../../media/png/no-image.png";
import Layout from "../seekerDashboard/partials/layout";

export default function CompanyFollowers() {
    const followers = [
        {
            name: "Tech Corp Pvt Ltd",
            industry: "Information Technology",
            location: "Lahore",
            image: noImage,
        },
        {
            name: "Creative Minds Inc",
            industry: "Marketing & Advertising",
            location: "Mumbai",
            image: noImage,
        },
        {
            name: "Future Solutions",
            industry: "Software Development",
            location: "Dubai",
            image: noImage,
        },
    ];

    return (
        <Layout>
            <div className="md:p-8">
                <h2 className="text-xl text-center sm:text-[30px] font-semibold text-gray-800 mb-6 pt-2">Company Followers</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                    {followers.map((company, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center"
                        >
                            <img
                                src={company.image || noImage}
                                alt={company.name}
                                className="w-20 h-20 rounded-full object-cover shadow-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-900 text-center">{company.name}</h3>
                            <p className="text-sm text-gray-600 text-center">{company.industry}</p>
                            <div className="flex items-center text-sm text-blue-600 mt-2 gap-2">
                                <FaMapMarkerAlt /> {company.location}
                            </div>
                            <button className="mt-4 bg-blue-600 text-white text-sm font-medium py-2 px-5 rounded-full hover:bg-blue-700 transition">
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
