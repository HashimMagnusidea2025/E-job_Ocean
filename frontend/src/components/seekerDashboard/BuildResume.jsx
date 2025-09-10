import DataTable from "react-data-table-component";

import { FaPen, FaTimes, FaDownload, FaPencilAlt, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaPlus, FaEdit, FaGraduationCap, FaSchool } from "react-icons/fa";
import Layout from "./partials/layout";

const data = [
    {
        id: 1,
        title: "My Resume1",
        isDefault: "Default",
        date: "2025-03-09 06:19:47",
    },


];

const columns = [
    {
        name: "CV Title",
        selector: row => row.title,
        sortable: true,
        cell: row => (
            <span className="text-blue-600 hover:underline cursor-pointer">{row.title}</span>
        ),
    },
    {
        name: "Default CV",
        selector: row => row.isDefault,
        sortable: true,
    },
    {
        name: "Date",
        selector: row => row.date,
        sortable: true,
    },
    {
        name: "Action",
        cell: row => (
            <div className="space-x-3 text-xl">
                <button className=""><FaDownload /></button>
                <button className="text-gray-600 hover:text-gray-800"><FaPencilAlt /></button>
                <button className="text-red-600 hover:text-red-800"><FaTimes /></button>
            </div>
        ),
    },
];


const skills = [
    { name: "Adobe Photoshop", experience: "14 Years" },
    { name: "Adobe Illustrator", experience: "9 years" },
    { name: "HTML", experience: "14 Years" },
    { name: "CSS", experience: "13 Years" },
    { name: "Adaptability skills", experience: "8 years" },
];


export default function BuildResume() {
    return (
        <>
            <Layout>

                <div className="w-full bg-[f6f8fd]  rounded shadow text-sm sm:text-base">
                    <h2 className="text-xl sm:text-[32px] font-semibold mb-10 text-center">
                        Build Your Resume
                    </h2>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg sm:text-[30px] font-semibold text-gray-800">Attached CV</h2>
                            <button className="text-blue-600 text-xl hover:text-blue-800">+</button>
                        </div>

                        <div className="overflow-x-auto bg-white p-4 rounded shadow">
                            <DataTable
                                columns={columns}
                                data={data}
                                // pagination
                                responsive
                                highlightOnHover
                                striped
                                customStyles={{
                                    headCells: {
                                        style: {
                                            fontWeight: 'bold',
                                            backgroundColor: '#f3f4f6',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    {/*  Experience */}
                    <div className="pt-10">
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 w-full relative">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">Experience</h2>
                                <FaPlus className="textx-blue-500 cursor-pointer" />
                            </div>


                            <div className="relative pl-6">
                                <div className="absolute left-0 top-2 w-3 h-3 bg-gray-300 rounded-full"></div>


                                <h3 className="text-md sm:text-[20px] font-bold text-gray-800">UI UX Designer</h3>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2 ">
                                    <FaMapMarkerAlt />
                                    <span>Lahore - Pakistan</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaBuilding />
                                    <span>Amoka Int</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaCalendarAlt />
                                    <span>
                                        From <strong>13 Dec, 2009</strong> - <strong>07 Feb, 2012</strong>
                                    </span>
                                </div>

                                <p className="text-md text-gray-700 mt-2">
                                    This is just for testing experience details
                                </p>
                            </div>


                            <div className="absolute top-20 right-6 flex gap-3">
                                <FaEdit className=" cursor-pointer text-md" size={20} />
                                <FaTimes className="text-red-500 cursor-pointer" size={20} />
                            </div>
                        </div>
                    </div>

                    {/*  Education*/}

                    <div className="pt-10">
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 w-full relative">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">Education</h2>
                                <FaPlus className="textx-blue-500 cursor-pointer" />
                            </div>


                            <div className="relative pl-6">
                                <div className="absolute left-0 top-2 w-3 h-3 bg-gray-300 rounded-full"></div>


                                <h3 className="text-md sm:text-[20px] font-bold text-gray-800">Matriculation/O-Level - Matric in Science</h3>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2 ">

                                    <span>2005 - Hafizabad - Pakistan</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaGraduationCap />
                                    <span>Matric</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaMapMarkerAlt />
                                    <span>
                                        Hafizabad - Pakistan
                                    </span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaSchool />
                                    <span>
                                        Govt School
                                    </span>
                                </div>
                            </div>


                            <div className="absolute top-20 right-6 flex gap-3">
                                <FaEdit className=" cursor-pointer" size={20} />
                                <FaTimes className="text-red-500 cursor-pointer" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="pt-6">
                        <div className="w-full mx-auto mt-10 border rounded-lg shadow bg-white">
                            {/* Header */}
                            <div className="p-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Skills</h2>
                                <button className="text-blue-500 text-2xl font-bold hover:text-blue-700">+</button>
                            </div>

                            {/* Skill List */}
                            <div className="divide-y">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-between items-center px-4 py-3 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                            }`}
                                    >
                                        <div className="flex-1 font-semibold">{skill.name}</div>
                                        <div className="flex-1">{skill.experience}</div>
                                        <div className="flex gap-4">
                                            <FaPen className="text-sm cursor-pointer text-black hover:text-blue-600" />
                                            <FaTimes className="text-sm cursor-pointer text-red-500 hover:text-red-700" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Languages */}

                    <div>
                        <div className="w-full mx-auto mt-10 border rounded-lg shadow bg-white">
                            {/* Header */}
                            <div className="p-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Languages</h2>
                                <button className="text-blue-500 text-2xl font-bold hover:text-blue-700">+</button>
                            </div>
                            <div className="divide-y">

                                <div
                                    className={`bg-gray-100 flex justify-between items-center px-4 py-3 
                                        `}>
                                    <div className="flex-1 font-semibold">Urdu</div>
                                    <div className="flex-1">Expert</div>
                                    <div className="flex gap-4">
                                        <FaPen className="text-sm cursor-pointer text-black hover:text-blue-600" />
                                        <FaTimes className="text-sm cursor-pointer text-red-500 hover:text-red-700" />
                                    </div>
                                </div>
                                <div

                                    className="flex justify-between items-center px-4 py-3">
                                    <div className="flex-1 font-semibold">English</div>
                                    <div className="flex-1">Expert</div>
                                    <div className="flex gap-4">
                                        <FaPen className="text-sm cursor-pointer text-black hover:text-blue-600" />
                                        <FaTimes className="text-sm cursor-pointer text-red-500 hover:text-red-700" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                </div>
            </Layout>
        </>
    )
}