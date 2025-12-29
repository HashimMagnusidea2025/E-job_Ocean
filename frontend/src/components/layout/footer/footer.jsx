// import { FaWhatsapp } from "react-icons/fa";

import logo from '../../../media/logo/ejob_ocean.png';

// export default function Footer() {
//     return (
//         <footer className="bg-[#edf1f9] text-black py-10 px-6 font-[Poppins]">
//             <div className="flex justify-between items-start gap-4 flex-wrap">
//                 {/* Logo */}
//                 <div>
//                     <img src={logo} alt="eJob Ocean" className="w-36 mb-4" />
//                 </div>

//                 {/* Newsletter Form */}
//                 <div className="max-w-sm w-full">
//                     <h3 className="font-bold text-sm mb-2">Subscribe to Our Newsletter</h3>
//                     <div className="flex gap-2">
//                         <input
//                             type="email"
//                             placeholder="Enter your email"
//                             className="px-3 py-2 rounded text-black w-full text-sm"
//                         />
//                         <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded text-sm">
//                             Subscribe
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-10">

//                 {/* Logo + Connect */}
//                 <div>

//                     <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Connect</h3>
//                     <ul className="text-sm space-y-1 mt-2">
//                         <li>WhatsApp Communities</li>
//                         <li>Support</li>
//                         <li>Live Mentorship</li>
//                         <li>Social Media</li>
//                         <li>Become a mentor</li>
//                         <li >
//                             {/* Interview Prep */}
//                             <div className="mt-20">
//                                 <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Interview Prep & Soft Skills</h3>
//                                 <ul className="text-sm space-y-1 mt-2">
//                                     <li>Complete Interview MasterClass Package</li>
//                                     <li>Resume MasterClass</li>
//                                     <li>LinkedIn MasterClass</li>
//                                     <li>Personal Interview MasterClass</li>
//                                     <li>1:1 Resume Review</li>
//                                     <li>1:1 Mock Interview</li>
//                                 </ul>
//                             </div>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Placements */}
//                 <div>
//                     <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Placements</h3>
//                     <ul className="text-sm space-y-1 mt-2">
//                         <li>Get Placed (Placement Program)</li>
//                         <li>Vacancies</li>
//                         <li>Success Stories (Hall Of Fame)</li>
//                         <li>
//                             {/* Must Read */}
//                             <div className="mt-36">
//                                 <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Must Read</h3>
//                                 <ul className="text-sm space-y-1 mt-2">
//                                     <li>Blogs</li>
//                                     <li>Testimonials</li>
//                                 </ul>
//                             </div>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Free Resources */}
//                 <div>
//                     <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Free Resources</h3>
//                     <ul className="text-sm space-y-1 mt-2">
//                         <li>Decide Your Domain Free MasterClass</li>
//                         <li>Free Interview Resources</li>
//                         <li>Company Wise Interview Questions</li>
//                         <li>Exam Resources for College Students</li>
//                         <li>
//                             {/* Support */}
//                             <div className="mt-20">
//                                 <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Support</h3>
//                                 <ul className="text-sm space-y-1 mt-2">
//                                     <li>Contact Us</li>
//                                     <li>About Us</li>
//                                     <li>Terms of Use</li>
//                                     <li>Privacy Policy</li>
//                                     <li>Refund Policy</li>
//                                     <li>FAQs</li>
//                                     <li>Verify Certificate</li>
//                                 </ul>
//                             </div>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Finance Tools */}
//                 <div>
//                     <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Finance Tools Masterclasses</h3>
//                     <ul className="text-sm space-y-1 mt-2">
//                         <li>MS-Excel MasterClass</li>
//                         <li>Tableau MasterClass</li>
//                         <li>Power BI & Alteryx MasterClass</li>
//                         <li>Python and SQL MasterClass</li>
//                         <li>

//                             {/* For Corporates */}
//                             <div className="mt-32">
//                                 <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">For Corporates</h3>
//                                 <ul className="text-sm space-y-1 mt-2">
//                                     <li>Hire From Us</li>
//                                     <li>B2B Corporate Training</li>
//                                 </ul>
//                             </div>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Flagship */}
//                 <div>
//                     <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Flagship Masterclasses</h3>
//                     <ul className="text-sm space-y-1 mt-2">
//                         <li>Audit MasterClass</li>
//                         <li>IA MasterClass</li>
//                         <li>GST MasterClass</li>
//                         <li>Direct Tax MasterClass</li>
//                         <li>Transfer Pricing MasterClass</li>
//                         <li>Financial Planning & Analysis MasterClass</li>
//                         <li>Financial Modelling & Valuation MasterClass</li>
//                         <li>Management Consulting</li>
//                         <li>Articleship MasterClass</li>
//                         <li>Big 4 MasterClass for College Grads</li>
//                         <li>All Courses</li>
//                     </ul>
//                 </div>

//             </div>

//             <div className="mt-10 text-center text-sm text-black">
//                 © {new Date().getFullYear()} eJob Ocean | All Rights Reserved
//             </div>


//             <div className="fixed bottom-4 right-4 z-50">
//                 <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
//                     <FaWhatsapp className="text-green-500 bg-white rounded-full p-2 w-12 h-12 shadow-lg hover:scale-110 transition" />
//                 </a>
//             </div>
//         </footer>
//     );
// }


import { FaWhatsapp } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../utils/axios.js';
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
export default function Footer() {


    const [companyLogo, setCompanyLogo] = useState(null);
    const [companyData, setCompanyData] = useState(); // default

    const fetchCompanyLogo = async () => {
        try {
            const response = await axios.get('/general-settings'); // ya aapke backend endpoint
            if (response.data && response.data.logo) {
                setCompanyLogo(`${baseURL}${response.data.logo}`);
                setCompanyData(response.data);


            }
        } catch (error) {
            console.error("Failed to fetch company logo:", error);
            setCompanyLogo(null);
        }
    };
    useEffect(() => {
        fetchCompanyLogo();
    }, []);

    return (
        <footer className="w-full bg-[#edf1f9]">
            <div className='container mx-auto  text-black py-10 px-6 font-[Poppins]'>


                <div className="flex justify-between items-start gap-4 flex-wrap">
                    {/* Logo */}
                    <div>
                        <Link to="/">
                            <img
                                src={companyLogo || '/media/logo/ejob_ocean.png'}
                                alt="Company Logo"
                                className="h-8"
                            />
                        </Link>
                    </div>

                    {/* Newsletter Form */}
                    {/* <div className="max-w-sm w-full">
                        <h3 className="font-bold text-sm mb-2">Subscribe to Our Newsletter</h3>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-3 py-2 rounded text-black w-full text-sm"
                            />
                            <button className="bg-[#339ca0] hover:bg-black text-white px-3 rounded text-sm">
                                Subscribe
                            </button>
                        </div>
                    </div> */}
                </div>
                <div className="pt-10 max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6 ">

                    {/* Logo + Connect */}
                    <div>

                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Connect</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li>WhatsApp Communities</li>
                            <li>Support</li>
                            <li>Live Mentorship</li>
                            <li>Social Media</li>
                            <li>Become a mentor</li>
                        </ul>
                    </div>

                    {/* Placements */}
                    {/* <div>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Placements</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li>Get Placed (Placement Program)</li>
                            <li>Vacancies</li>
                            <li>Success Stories (Hall Of Fame)</li>
                        </ul>
                    </div> */}

                    {/* Free Resources */}
                    <div>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Free Resources</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li>Decide Your Domain Free MasterClass</li>
                            <li>Free Interview Resources</li>
                            <li>Company Wise Interview Questions</li>
                            <li>Exam Resources for College Students</li>
                        </ul>
                    </div>

                    {/* Finance Tools */}
                    {/* <div>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Finance Tools Masterclasses</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li>MS-Excel MasterClass</li>
                            <li>Tableau MasterClass</li>
                            <li>Power BI & Alteryx MasterClass</li>
                            <li>Python and SQL MasterClass</li>
                        </ul>
                    </div> */}

                    {/* Flagship */}
                    {/* <div className='gridspan-row'>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Flagship Masterclasses</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li>Audit MasterClass</li>
                            <li>IA MasterClass</li>
                            <li>GST MasterClass</li>
                            <li>Direct Tax MasterClass</li>
                            <li>Transfer Pricing MasterClass</li>
                            <li>Financial Planning & Analysis MasterClass</li>
                            <li>Financial Modelling & Valuation MasterClass</li>
                            <li>Management Consulting</li>
                            <li>Articleship MasterClass</li>
                            <li>Big 4 MasterClass for College Grads</li>
                            <li>All Courses</li>
                        </ul>
                    </div> */}

                    {/* Newsletter */}


                    {/* Interview Prep */}
                    {/* <div>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Interview Prep & Soft Skills</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li>Complete Interview MasterClass Package</li>
                            <li>Resume MasterClass</li>
                            <li>LinkedIn MasterClass</li>
                            <li>Personal Interview MasterClass</li>
                            <li>1:1 Resume Review</li>
                            <li>1:1 Mock Interview</li>
                        </ul>
                    </div> */}

                  
                    <div>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Must Read</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li><a href="/blogs">Blogs</a></li>
                            <li>Testimonials</li>
                        </ul>
                    </div>

                    
                    <div>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">Support</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li><a href="/contact">Contact Us</a></li>
                            <li> <a href="/about-us">About Us</a></li>
                            <li><a href="/terms-conditions">Terms & Conditions</a></li>
                            <li><a href="/privacy-policy">Privacy Policy</a></li>
                            <li>Refund Policy</li>
                            <li>FAQs</li>
                            <li>Verify Certificate</li>
                        </ul>
                    </div>

                    {/* For Corporates */}
                    <div>
                        <h3 className="font-bold uppercase text-sm border-b-2 border-red-500 inline-block mb-2">For Corporates</h3>
                        <ul className="text-sm space-y-3 mt-2">
                            <li>Hire From Us</li>
                            <li>B2B Corporate Training</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} {companyData?.companyName} | All Rights Reserved
                </div>

                {/* Floating WhatsApp Icon (optional) */}
                {/* <div className="fixed bottom-4 right-4 z-50">
                <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="text-green-500 bg-white rounded-full p-2 w-12 h-12 shadow-lg hover:scale-110 transition" />
                </a>
            </div> */}
            </div>
        </footer>
    );
}

