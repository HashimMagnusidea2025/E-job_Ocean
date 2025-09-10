import { FaMapMarkerAlt, FaSuitcase } from "react-icons/fa";

import noImg from '../../media/png/no-image.png';
import Layout from "./partials/layout";
export default function MyFevoriteJob() {
    return (
        <Layout>
            <div className="p-4">
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <div className="max-w-xs w-full hover:border-blue-500 bg-white border shadow-md rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <FaSuitcase className="text-gray-400" />
                            <span>Internship</span>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                            Ingeniero de Producc...
                        </h3>

                        <p className="text-gray-700">
                            <strong>Salary:</strong> <span className="font-bold text-black">0 - 0</span>
                        </p>

                        <div className="flex items-center text-blue-600 gap-1">
                            <FaMapMarkerAlt className="text-blue-500" />
                            <span className="font-semibold">Apache Junction</span>
                        </div>

                        {/* Date & Company */}
                        <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs">Jun 18, 2025</p>
                                <p className="text-gray-700 font-medium">Media Wave</p>
                            </div>
                            <img
                                src={noImg}
                                alt="Company Logo"
                                className="w-10 h-10 object-contain rounded-full"
                            />
                        </div>

                        {/* Remove Button */}
                        <button className="bg-red-600 text-white w-full py-2 rounded-md font-semibold hover:bg-red-700 transition">
                            ✖ Remove
                        </button>
                    </div>
                    <div className="max-w-xs w-full bg-white border shadow-md rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <FaSuitcase className="text-gray-400" />
                            <span>Internship</span>
                        </div>


                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                            Ingeniero de Producc...
                        </h3>


                        <p className="text-gray-700">
                            <strong>Salary:</strong> <span className="font-bold text-black">0 - 0</span>
                        </p>


                        <div className="flex items-center text-blue-600 gap-1">
                            <FaMapMarkerAlt className="text-blue-500" />
                            <span className="font-semibold">Apache Junction</span>
                        </div>

                        {/* Date & Company */}
                        <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs">Jun 18, 2025</p>
                                <p className="text-gray-700 font-medium">Media Wave</p>
                            </div>
                            <img
                                src={noImg}
                                alt="Company Logo"
                                className="w-10 h-10 object-contain rounded-full"
                            />
                        </div>

                        {/* Remove Button */}
                        <button className="bg-red-600 text-white w-full py-2 rounded-md font-semibold hover:bg-red-700 transition">
                            ✖ Remove
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
