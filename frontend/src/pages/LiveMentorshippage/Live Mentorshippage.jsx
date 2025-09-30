import React from "react";

import NikhilGreybg from '../../media/jpg/Nikhil-Grey-bg.jpg';



const mentors = [
    {
        name: "Chirag Kagzi",
        title: "Indirect Tax Expert | GST Consultant | FCA",
        experience: "GST | Tax & Regulatory Services | 8 years+ Experience",
        companies: "Deloitte | Airtel | Baker Tilly DHC",
        image: NikhilGreybg, // replace with actual image path
        linkedin: "#",
    },
    {
        name: "Nikhil Dhingra",
        title: "Risk Consultant | Internal Audit Expert | FCA",
        experience:
            "Compliance Specialist | Managing Internal Audits | SOX Compliances | Data Privacy",
        companies: "Rio Tinto | EY",
        image: NikhilGreybg,
        linkedin: "#",
    },
    {
        name: "Sanat Goyal",
        title: "Transfer Pricing Expert | Direct Taxes | FCA",
        experience:
            '"International Taxation | Transfer Pricing | Advisory and Compliance"',
        companies: "Practice | EY",
        image: NikhilGreybg,
        linkedin: "#",
    },
    {
        name: "Sanat Goyal",
        title: "Transfer Pricing Expert | Direct Taxes | FCA",
        experience:
            '"International Taxation | Transfer Pricing | Advisory and Compliance"',
        companies: "Practice | EY",
        image: NikhilGreybg,
        linkedin: "#",
    },
    {
        name: "Sanat Goyal",
        title: "Transfer Pricing Expert | Direct Taxes | FCA",
        experience:
            '"International Taxation | Transfer Pricing | Advisory and Compliance"',
        companies: "Practice | EY",
        image: NikhilGreybg,
        linkedin: "#",
    },
];

export default function LiveMentorShipPage() {
    return (

        <div className="w-full container mx-auto ">

            <div className="flex flex-wrap gap-4 justify-center  pt-20">
                <input
                    type="text"
                    placeholder="Search By Domain, company"
                    className="border px-10 py-2 rounded-md"
                />
                <select className="border px-12 py-2 rounded-md">
                    <option >All  Company</option>
                </select>
                <select className="border px-12 py-2 rounded-md">
                    <option>All Domain</option>
                </select>
                <select className="border px-12 py-2 rounded-md">
                    <option>All Pleacement preps</option>
                </select>
                <button className="bg-black text-white px-4 py-2 rounded-md">Filter</button>
                <button className="bg-black text-white px-4 py-2 rounded-md">Reset</button>
            </div>


            <div className="py-10 px-4 flex flex-wrap gap-16 justify-center ">

                {mentors.map((mentor, idx) => (
                    <div
                        key={idx}
                        className="w-[380px] bg-white shadow-md border rounded-md overflow-hidden flex flex-col"
                    >
                        <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="h-[320px] object-cover w-full"
                        />
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold text-[#339ca0]">
                                {mentor.name}
                            </h3>
                            <p className="text-sm mt-1 text-[#222] flex items-center gap-2">
                                <span>👤</span> {mentor.title}
                            </p>
                            <p className="text-sm mt-1 text-[#444] flex items-center gap-2">
                                <span>💼</span> {mentor.experience}
                            </p>
                            <p className="text-sm mt-1 text-[#444] flex items-center gap-2">
                                <span>🏢</span> {mentor.companies}
                            </p>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 border-t">
                            <a
                                href={mentor.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-700 text-white px-4 py-1 rounded"
                            >
                                Linkedin
                            </a>
                            <button className="bg-black text-white px-4 py-1 rounded flex items-center gap-1">
                                <span>🛎️</span> Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
