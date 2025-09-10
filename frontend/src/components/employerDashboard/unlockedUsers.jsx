import { FaMapMarkerAlt } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import noImage from "../../media/png/no-image.png";
import Layout from "../seekerDashboard/partials/layout";

export default function UnlockedUsers() {
    const seekers = [
        {
            name: "Sharjeel Anjum",
            profession: "Information Technology",
            experience: "Experienced Professional",
            location: "Islamabad",
            image: noImage,
        },
        {
            name: "Job Seeker",
            profession: "Engineering and Information Technology",
            experience: "Experienced Professional",
            location: "Bagaha",
            image: noImage,
        },
        {
            name: "Sharjeel Anjum",
            profession: "Information Technology",
            experience: "Experienced Professional",
            location: "Islamabad",
            image: noImage,
        },
    ];

    return (
        <Layout>
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Unlocked Seekers</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {seekers.map((seeker, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center"
                        >
                            <img
                                src={seeker.image || noImage}
                                alt={seeker.name}
                                className="w-20 h-20 rounded-full object-cover shadow-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-900">{seeker.name}</h3>
                            <p className="text-sm text-gray-600">{seeker.profession}</p>
                            <div className="flex items-center text-sm text-blue-600 mt-2 gap-2">
                                <BsGraphUpArrow /> {seeker.experience}
                            </div>
                            <div className="flex items-center text-sm text-blue-600 mt-1 gap-2">
                                <FaMapMarkerAlt /> {seeker.location}
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
