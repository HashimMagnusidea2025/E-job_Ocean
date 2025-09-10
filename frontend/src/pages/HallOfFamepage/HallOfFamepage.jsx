import React from "react";
import { FaLinkedin } from "react-icons/fa";
import PranjalSrivastava from '../../media/jpg/PranjalSrivastava.jpeg';
import utkarshLogo from '../../media/jpg/utkarsh.jpeg';

import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";

export default function HallOfFamepage() {
    const students = [
        {
            name: "Tijil Madaan",
            course: "Power BI & Alteryx Master Class, SQL & Python MasterClass",
            role: "Intern | Marketing & Finance",
            companyLogo: utkarshLogo,
            linkedin: "#",
            image: PranjalSrivastava,
        },
        {
            name: "Pranjal Srivastava",
            course: "Free Master Class",
            role: "Article Trainee | Audit & Assurance ",
            companyLogo: utkarshLogo,
            linkedin: "#",
            image: PranjalSrivastava,
        },
        {
            name: "Nikhil Goel",
            course: "Free Career Masterclass",
            role: "Credit Manager | Credit Risk Analysis",
            companyLogo: utkarshLogo,
            linkedin: "#",
            image: PranjalSrivastava,
        },
        {
            name: "Rishik Bandopadhyay",
            course: "Audit Master Class, GST Masterclass, Direct Tax, Interview Masterclass, MS-Excel MasterClass",
            role: "Business Analyst | Corporate Finance",
            companyLogo: utkarshLogo,
            linkedin: "#",
            image: PranjalSrivastava,
        },
        {
            name: "Rishik Bandopadhyay",
            course: "Audit Master Class, GST Masterclass, Direct Tax, Interview Masterclass, MS-Excel MasterClass",
            role: "Business Analyst | Corporate Finance",
            companyLogo: utkarshLogo,
            linkedin: "#",
            image: PranjalSrivastava,
        },
    ];

    return (
        <div className="container mx-auto font-[Poppins]">
           



                <div className=" px-4 py-10 ">
                    <h1 className="text-4xl font-extrabold text-center">HALL OF FAME</h1>
                    <div className="w-40 h-1 bg-black mx-auto my-2"></div>
                    <p className="text-center text-lg text-gray-600 mb-8">
                        Celebrating our students' achievements!
                    </p>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                        <input
                            type="text"
                            placeholder="Company / Domain"
                            className="border px-4 py-2 rounded-md"
                        />
                        <select className="border px-4 py-2 rounded-md">
                            <option>Select Company</option>
                        </select>
                        <select className="border px-4 py-2 rounded-md">
                            <option>Select Domain</option>
                        </select>
                        <button className="bg-black text-white px-4 py-2 rounded-md">Filter</button>
                        <button className="bg-black text-white px-4 py-2 rounded-md">Reset</button>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-wrap justify-center gap-9">
                        {students.map((student, index) => (
                            <div key={index} className="w-72  bg-white rounded-xl shadow-lg overflow-hidden justify-center flex items-center flex-col">
                                <img src={student.image} alt={student.name} className="w-full h-64 object-cover rounded-lg" />
                                <h3 className="font-semibold text-[15px] mt-3">{student.name}</h3>
                                <div className="flex">
                                    <p className="text-sm mt-1 ">
                                        <span className="font-bold text-[12px]">Course :</span>{student.course}
                                    </p>
                                </div>

                                <p className="text-sm mt-2 text-gray-700">
                                    <span className="text-yellow-600 text-lg mr-1">👨‍💼</span>{student.role}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <p className="text-[14px] font-medium">Selected In</p>
                                    <img src={student.companyLogo} alt="Company Logo" className="h-6" />
                                </div>
                                <a
                                    href={student.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[14px] mt-2 text-blue-700 font-semibold flex items-center gap-1"
                                >
                                    Connect On Linkedin <FaLinkedin size={18} />
                                </a>
                            </div>
                        ))}
                    </div>

                </div>
           
        </div>
    );
}
