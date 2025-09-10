import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";

export default function UpgradeJobPackages() {
    return (
        <div className="w-full mx-auto md:p-4">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Upgrade Job Packages</h2>
            <div className="flex flex-wrap gap-7 justify-center sm:justify-start">

            <div className="w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-2xl font-bold text-gray-900">10</p>
                <p className="text-3xl font-bold text-gray-800 my-2">
                    INR<span className="text-black">1</span>
                </p>
                <hr className="my-4 border-gray-300" />

                <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Job Posting 10
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Job Displayed for 10 Days
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Highlights jobs on Demand
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Premium Support 24/7
                    </li>
                </ul>

                <button className="mt-6 w-full flex items-center justify-center gap-2 bg-white border border-blue-600 text-blue-600 font-semibold py-2 rounded-full hover:bg-blue-50 transition">
                    Buy Now <BsFillArrowUpRightCircleFill className="w-4 h-4" />
                </button>
            </div>
            <div className=" w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-2xl font-bold text-gray-900">10</p>
                <p className="text-3xl font-bold text-gray-800 my-2">
                    INR<span className="text-black">1</span>
                </p>
                <hr className="my-4 border-gray-300" />

                <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Job Posting 10
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Job Displayed for 10 Days
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Highlights jobs on Demand
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle /> Premium Support 24/7
                    </li>
                </ul>

                <button className="mt-6 w-full flex items-center justify-center gap-2 bg-white border border-blue-600 text-blue-600 font-semibold py-2 rounded-full hover:bg-blue-50 transition">
                    Buy Now <BsFillArrowUpRightCircleFill className="w-4 h-4" />
                </button>
            </div>
            </div>
        </div>
    );
}
