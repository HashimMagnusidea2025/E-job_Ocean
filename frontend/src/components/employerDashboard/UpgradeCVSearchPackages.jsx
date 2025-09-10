import { FaCheckCircle } from "react-icons/fa";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

export default function UpgradeCVSearchPackages() {
    const packages = [
        {
            title: "10",
            price: "1",
            currency: "INR",
            features: [
                "Applicant CV Views 10",
                "CV View Access 30 Days",
                "Highlights jobs on Demand",
                "Premium Support 24/7",
            ],
        },
        {
            title: "10",
            price: "1",
            currency: "INR",
            features: [
                "Job Posting 10",
                "Job Displayed for 10 Days",
                "Highlights jobs on Demand",
                "Premium Support 24/7",
            ],
        },
    ];

    return (
        <div className="w-full mx-auto p-4">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
                Upgrade CV Search Packages
            </h2>
            <div className="flex flex-wrap gap-7 justify-center sm:justify-start">
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className="w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                    >
                        <p className="text-2xl font-bold text-gray-900">{pkg.title}</p>
                        <p className="text-3xl font-bold text-gray-800 my-2">
                            {pkg.currency}
                            <span className="text-black">{pkg.price}</span>
                        </p>
                        <hr className="my-4 border-gray-300" />

                        <ul className="space-y-3 text-sm text-gray-700">
                            {pkg.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <FaCheckCircle className="text-blue-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="mt-6 w-full flex items-center justify-center gap-2 bg-white border border-blue-600 text-blue-600 font-semibold py-2 rounded-full hover:bg-blue-50 transition">
                            Buy Now <BsFillArrowUpRightCircleFill className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
