import caarchitaggarwal from '../../media/png/ca-archit-aggarwal.png'
import Layout from './partials/layout';
import { FaBook, FaPhoneAlt, FaMobileAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPen, FaTimes, FaDownload, FaPencilAlt, FaBuilding, FaCalendarAlt, FaPlus, FaEdit, FaGraduationCap, FaSchool } from "react-icons/fa";
export default function PrintResume() {

    return (
        <>
            <Layout>
                <div className=" bg-white font-[Poppins]">
                    <div className=' flex justify-end pt-5 px-10'>
                        <button className='bg-[#0981c5] font-semibold text-white py-3 px-3 rounded'>
                            Dowonload CV
                        </button>
                    </div>


                    <div className='flex justify-center items-start p-6'>

                        <div className="w-full grid md:grid-cols-3 bg-white shadow-lg border border-gray-200">

                            <div className="bg-[#113B67] text-white p-6 space-y-6">
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        className="w-28 h-28 rounded-full border-4 border-white"
                                        src={caarchitaggarwal}
                                        alt="Profile"
                                    />

                                </div>

                                <div>
                                    <h3 className="text-lg sm:text-[30px] font-semibold mb-4">Contact Details</h3>
                                    <ul className="text-md space-y-1">
                                        <li className='flex items-center gap-2'>
                                            <span><FaPhoneAlt /></span>
                                            <span>+1234567890</span>
                                        </li>
                                        <li className='flex items-center gap-2'>
                                            <span>
                                                <FaMobileAlt /></span>
                                            <span> +12345674358</span>
                                        </li>
                                        <li className='flex items-center gap-2'>
                                            <span><FaEnvelope /></span>
                                            <span>seeker@jobsportal.com</span>
                                        </li>
                                        <li className='flex items-center gap-2'>
                                            <span><FaGlobe /></span>
                                            <span>Bagaha, Bihar, India</span>
                                        </li>
                                        <li className='flex items-center gap-2'>
                                            <span><FaMapMarkerAlt /></span>
                                            <span>Dummy Street Address 123 USA</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className=" border border-white text-white text-center py-3 rounded mt-6">
                                    <p className="text-lg sm:text-[22px] leading-tight">6 YEARS</p>
                                    <p className="text-sm font-semibold">OF EXPERIENCE</p>
                                </div>




                                <div>
                                    <h3 className="text-lg font-semibold mt-6 mb-1">Personal Details</h3>
                                    <hr className='mb-2' />
                                    <ul className="text-md space-y-1 mt-4">
                                        <li><strong>D.O.B:</strong> 6th of June 1989</li>
                                        <li><strong>Age:</strong> 36 Years</li>
                                        <li><strong>Gender:</strong> Male</li>
                                        <li><strong>Marital Status:</strong> Single</li>
                                        <li><strong>Functional Area:</strong> Engineering and IT</li>
                                        <li><strong>Industry:</strong> Advertising/PR</li>
                                        <li><strong>Current Level:</strong> Professional</li>
                                        <li><strong>Current Salary:</strong> 60,000</li>
                                        <li><strong>Expected Salary:</strong> 100,000</li>
                                        <li><strong>Nationality:</strong> American</li>

                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mt-6 mb-1">Key Skills</h3>
                                    <hr className='mb-2' />
                                    <div className="mt-2 space-y-2">
                                        <div className=" rounded-full">
                                            <div className=" h-full  rounded-full">Adobe Photoshop</div>
                                        </div>
                                        <div className=" rounded-full">
                                            <div className=" h-full  rounded-full">Adobe Illustrator
                                            </div>
                                        </div>
                                        <div className=" rounded-full">
                                            <div className=" h-full  rounded-full">HTML

                                            </div>
                                        </div>
                                        <div className=" rounded-full">
                                            <div className=" h-full  rounded-full">CSS

                                            </div>
                                        </div>
                                        <div className=" rounded-full">
                                            <div className=" h-full rounded-full">
                                                Adaptability skills

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <h2 className='w-full text-lg sm:text-[35px] font-semibold bg-[#0981c5] flex justify-center items-center  text-white py-5'>Job Seeker</h2>
                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Objective</h2>
                                    <p className="text-sm text-gray-700 mt-2">
                                        Hello! I’m Sharjeel, A Passionate UI/UX Designer and Frontend Developer with a strong technical background. I bring innovation and attention to detail to create visually stunning, user-centric designs. Proactive and disciplined, I excel in ensuring maximum accessibility and elevating customer experiences throughout the development process. Let’s redefine digital interactions together.
                                    </p>
                                </section>
                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Experience</h2>
                                    <div className="mt-2 p-3">

                                        <h3 className="font-semibold text-lg sm:text-[20px]">UI UX Designer</h3>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaMapMarkerAlt /></span>
                                            <span>Lahore - Pakistan</span>
                                        </p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaBuilding /></span>
                                            <span>Amoka Int</span>
                                        </p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaCalendarAlt /></span>
                                            <span>From 13 Dec, 2009 - 07 Feb, 2012</span>
                                        </p>
                                        <p className="text-md text-gray-700 mt-1 pl-5">This is just for testing experience details</p>
                                    </div>
                                </section>



                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Education</h2>
                                    <div className="mt-2">
                                        <h3 className="font-semibold text-lg sm:text-[20px]">Matriculation/O-Level - Matric in Science</h3>
                                        <p className="text-md text-gray-600 pl-7">2005 - Hafizabad - Pakistan</p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span>
                                            </span><FaSchool />
                                            <span>Govt School</span>
                                        </p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaBook /></span>
                                            <span> Biological Sciences, General Mathematics, Physics</span>
                                        </p>
                                    </div>
                                </section>

                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-4">Languages</h2>
                                    <div className="flex gap-4 mt-4">
                                        <span className="bg-[#113B67] text-white px-4 py-3 rounded-full text-md">Urdu (Expert)</span>
                                        <span className="bg-[#113B67] text-white px-4 py-3 rounded-full text-md">English (Expert)</span>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )

}