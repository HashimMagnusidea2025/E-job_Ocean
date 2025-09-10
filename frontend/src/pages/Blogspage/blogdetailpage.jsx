import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";

import hero31 from "../../media/jpg/31.jpg";
import { IoMdTime } from "react-icons/io";
import { FaFacebookF, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // X (Twitter)
import { MdEmail, MdShare } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from "react-icons/fa";
import caarchitaggarwal from '../../media/png/ca-archit-aggarwal.png';

import CASharma from '../../media/png/CA-Sharma.png';
import CAA from '../../media/jpg/CA-A.jpg';
import CA2 from '../../media/jpg/CA-2.jpg'


export default function BlogDetailsPage() {

    const categories = [
        { name: "Article", count: 22 },
        { name: "Interview", count: 11 },
        { name: "Story", count: 25 },
        { name: "Uncategorized", count: 1 },
    ];
    return (
        <div className="w-full font-[Poppins] bg-gray-50">
            <Navbar />

            <div className="font-[Poppins] bg-gray-50">
                {/* Hero Section */}

                {/* <div className="relative h-[60vh] w-full">
                    <img
                        src={hero31}
                        alt="Blog Hero"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
                        <span className="bg-green-500 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            Article
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-3xl">
                            The Future is Outsourced: Job Opportunities in India's Accounting
                            Outsourcing Industry
                        </h1>
                        <p className="mt-3 text-sm md:text-base">
                            By Kirty Khandelwal | April 1, 2025
                        </p>
                    </div>
                </div> */}

                <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2">


                        <div className="relative h-[60vh] w-full">
                            <img
                                src={CA2}
                                alt="Blog Hero"
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60"></div>
                            <div className="relative z-10 flex flex-col justify-end items-center h-full text-center text-white px-4">
                                <span className="bg-green-500 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                                    Article
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold leading-snug max-w-3xl mb-5">
                                    The Future is Outsourced: Job Opportunities in India's Accounting
                                    Outsourcing Industry
                                </h1>
                                <p className="mb-4 text-sm md:text-base">
                                    By Kirty Khandelwal | April 1, 2025
                                </p>
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                            <div className="flex flex-wrap gap-3">
                                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#145dbf]">
                                    <FaFacebookF /> Share
                                </a>
                                <a href="#" className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                                    <FaXTwitter /> Tweet
                                </a>
                                <a href="#" className="flex items-center gap-2 px-6 py-2 bg-[#E60023] text-white rounded-md hover:bg-[#b3001b]">
                                    <FaPinterestP /> Pin
                                </a>
                                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                    <MdEmail />
                                </a>
                                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-[#6cc644] text-white rounded-md hover:bg-[#57a436]">
                                    <MdShare />
                                </a>
                                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-md hover:bg-[#005983]">
                                    <FaLinkedinIn />
                                </a>
                            </div>
                            <h2 className="text-xl font-semibold mb-4 mt-5">
                                The Future is Outsourced: Job Opportunities in India's Accounting
                                Outsourcing Industry
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                India's role in the global accounting outsourcing landscape is
                                evolving...
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                At the heart of this growth story lies India's core advantages...
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Looking ahead, the outlook for accounting outsourcing remains
                                promising...
                            </p>
                            

                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                Leave a Reply
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Your email address will <span className="italic">not</span> be published.
                                Required fields are marked <span className="text-red-500">*</span>
                            </p>

                            <form className="space-y-4">
                                <textarea
                                    placeholder="Leave Your Comment"
                                    rows="5"
                                    className="w-full rounded-lg border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>

                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full rounded-full border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="saveInfo" className="w-4 h-4" />
                                    <label htmlFor="saveInfo" className="text-sm text-gray-700">
                                        Save my name, email, and website in this browser for the next time I comment.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
                                >
                                    Post Comment
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white shadow-md rounded-2xl p-5">
                            <h3 className="text-lg font-semibold mb-4">Follow Socials</h3>
                            <div className="flex flex-col space-y-3">
                                <a href="#" className="flex gap-4 px-4 py-2 bg-[#1877F2] hover:bg-[#145DBF] text-white rounded-lg text-center">
                                    <span>
                                        <FaFacebook size={25} />
                                    </span>
                                    <span>
                                        Facebook
                                    </span>
                                </a>
                                <a href="#" className="flex gap-4 px-4 py-2 bg-[#1DA1F2] hover:bg-[#0d8ddb] text-white rounded-lg text-center">
                                    <span >
                                        <FaTwitter size={25} />
                                    </span>
                                    <span>
                                        Twitter
                                    </span>
                                </a>
                                <a href="#" className="flex gap-4 px-4 py-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-lg text-center">
                                    <span>
                                        <FaInstagram size={25} />
                                    </span>
                                    <span>
                                        Instagram
                                    </span>
                                </a>
                                <a href="#" className="flex gap-4 px-4 py-2 bg-[#0088cc] hover:bg-[#006b99] text-white rounded-lg text-center">
                                    <span>
                                        <FaTelegram size={25} />
                                    </span>
                                    <span>
                                        Telegram
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-5">
                            <div >
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                    LATEST POSTS
                                </h3>

                                <div className=" flex flex-col gap-5">
                                    <div className="flex items-start gap-3 rounded-lg  bg-white p-3 shadow-sm hover:shadow-md transition">
                                        <img
                                            src={caarchitaggarwal}
                                            alt="Author"
                                            className="h-20 w-20 rounded-md object-cover"
                                        />


                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-gray-800 leading-snug  cursor-pointer">
                                                Career Outlook: Taxation & Litigation for Young CAs by CA Rajendra Sharma
                                            </p>
                                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                                <IoMdTime className="mr-1 h-4 w-4" />
                                                <span>July 8, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-lg  bg-white p-3 shadow-sm hover:shadow-md transition">
                                        <img
                                            src={caarchitaggarwal}
                                            alt="Author"
                                            className="h-20 w-20 rounded-md object-cover"
                                        />


                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-gray-800 leading-snug  cursor-pointer">
                                                Career Outlook: Taxation & Litigation for Young CAs by CA Rajendra Sharma
                                            </p>
                                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                                <IoMdTime className="mr-1 h-4 w-4" />
                                                <span>July 8, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full p-5">

                            <h3 class="mb-4 text-lg font-semibold text-gray-800">CATEGORIES</h3>


                            <ul class="space-y-3">
                                <li class="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span class="text-gray-700 hover:text-indigo-600 cursor-pointer">Article</span>
                                    <span class="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">22</span>
                                </li>
                                <li class="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span class="text-gray-700 hover:text-indigo-600 cursor-pointer">Interview</span>
                                    <span class="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">11</span>
                                </li>
                                <li class="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span class="text-gray-700 hover:text-indigo-600 cursor-pointer">Story</span>
                                    <span class="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">25</span>
                                </li>
                                <li class="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span class="text-gray-700 hover:text-indigo-600 cursor-pointer">Uncategorized</span>
                                    <span class="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">1</span>
                                </li>
                            </ul>
                        </div>


                        {/* <div className="bg-white shadow-md rounded-2xl p-5">
                            <h3 className="text-lg font-semibold mb-4">Subscribe Now</h3>
                            <input
                                type="name"
                                placeholder="Your name"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            />
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            />
                            <button className="w-full bg-green-600 text-white py-2 rounded-lg">
                                Subscribe
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}