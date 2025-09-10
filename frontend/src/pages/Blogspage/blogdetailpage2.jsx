import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { useEffect, useState } from "react";
import hero31 from "../../media/jpg/31.jpg";
import { IoMdTime } from "react-icons/io";
import { FaFacebookF, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // X (Twitter)
import { MdEmail, MdShare } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CommentCards } from "../../components/ui/cards/cards.jsx";

import axioss from "axios";

import { LikeButton } from "../../components/ui/button/button";



import { useParams } from "react-router";
import axios from "../../utils/axios.js";
export default function BlogDetailsPage2({ blogs }) {
    const [posts, setPosts] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const { id } = useParams();
    const type = "blogs";


    const [isLoggedIn, setIsLoggedIn] = useState(false);;
    useEffect(() => {
        const token = localStorage.getItem("token"); // ya cookies se lo
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Fetch current like count on mount
    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                const res = await axios.get(`/blogs/like/likes/${id}/${type}`);
                setLikeCount(res.data.totalCount);
            } catch (err) {
                if (err.response?.data?.message?.includes("already liked")) {
                    // Ignore silently
                    return;
                }
                console.error(err.response?.data || err.message);
            }
        };
        fetchLikeCount();
    }, [id, type]);


    useEffect(() => {
        axios.get("https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed&per_page=6&page=1")

            .then((res) => {
                setPosts(res.data);
                console.log(res.data);

            })
            .catch((err) => {
                console.error("Error fetching posts:", err);
            });
    }, []);
    // const categories = [
    //     { name: "Article", count: 22 },
    //     { name: "Interview", count: 11 },
    //     { name: "Story", count: 25 },
    //     { name: "Uncategorized", count: 1 },


    // ];


    const [postDetilas, setPostDetilas] = useState(null);
    useEffect(() => {
        axioss
            .get(`https://blog.ejobocean.com/wp-json/wp/v2/posts/${id}?_embed`)
            .then((res) => setPostDetilas(res.data))
            .catch((err) => console.error("Error fetching post:", err));
    }, [id]);

    if (!postDetilas) return <p className="p-6">Loading...</p>;




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

                    <div className="lg:col-span-2">

                        <div className="flex flex-col md:flex-row bg-white p-4 md:p-6  shadow-sm">

                            <div className="w-full md:w-1/3 bg-gray-300 border border-gray-300 aspect-[16/9] md:aspect-[4/5] rounded-xl mb-4 md:mb-0 md:mr-6 overflow-hidden">
                                {postDetilas._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                                    <img
                                        src={postDetilas._embedded["wp:featuredmedia"][0].source_url}
                                        alt={postDetilas.title.rendered}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col justify-center w-full md:w-2/3">
                                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[35px] leading-snug mb-3">
                                    <div
                                        className="prose"
                                        dangerouslySetInnerHTML={{ __html: postDetilas.title.rendered }}
                                    />
                                </h2>
                                <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{ __html: postDetilas.excerpt.rendered }}
                                />
                                {/* <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">
                                    By Nilesh Kadnor | April 1, 2025
                                </h3> */}
                            </div>

                        </div>

                        <div className=" bg-white p-6 mb-6 ">

                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <h5>{likeCount}</h5>
                                    <LikeButton
                                        blogId={postDetilas.id}
                                        type={type}
                                        setLikeCount={setLikeCount}
                                    />
                                </div>

                                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#145dbf]">
                                    <FaFacebookF /> Share
                                </a>
                                <a href="#" className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                                    <FaXTwitter />
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
                            <div className="prose max-w-none mt-6">
                                <div dangerouslySetInnerHTML={{

                                    __html: postDetilas.content.rendered
                                        .replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-800">')
                                        .replace(/<p>/g, '<p class="text-gray-700 mb-4 leading-relaxed">')
                                        .replace(/<ul>/g, '<ul class="list-disc pl-5 mb-4">')
                                        .replace(/<li>/g, '<li class="mb-2">')
                                        .replace(/<strong>/g, '<strong class="font-semibold">')
                                        .replace(/<table>/g, '<table class="w-full border-collapse border border-gray-300 mb-6">')
                                        .replace(/<thead>/g, '<thead class="bg-black text-white">')
                                        .replace(/<th>/g, '<th class="border border-gray-300 px-4 py-2 text-left ">')
                                        .replace(/<td>/g, '<td class="border border-gray-300 px-4 py-2">')
                                        .replace(/<tr>/g, '<tr class="">')
                                        .replace(/<a /g, '<a class="text-[#339ca0] text-[20px] hover:underline" ')
                                }} />
                            </div>
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
                                    {posts.map((value) => (
                                        <Link
                                            key={value.id}
                                            to={`/blogs/${value.id}`}
                                            className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition"
                                        >


                                            <img
                                                src={value._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
                                                    ?.pixwell_280x210?.source_url}
                                                alt="Author"
                                                className="h-28 w-32 rounded-md object-cover object-center"
                                            />

                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium text-gray-800 leading-snug  cursor-pointer">
                                                    <span dangerouslySetInnerHTML={{ __html: value.title.rendered }} />
                                                </p>
                                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                                    <IoMdTime className="mr-1 h-4 w-4" />
                                                    <span dangerouslySetInnerHTML={{ __html: value.date.split("T")[0] }} />
                                                </div>
                                            </div>


                                        </Link>

                                    ))}


                                </div>
                            </div>
                        </div>

                        <div className="w-full p-5">

                            <h3 className="mb-4 text-lg font-semibold text-gray-800">CATEGORIES</h3>


                            <ul className="space-y-3">
                                <li className="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">Article</span>
                                    <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">22</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">Interview</span>
                                    <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">11</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">Story</span>
                                    <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">25</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-dotted border-gray-300 pb-1">
                                    <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">Uncategorized</span>
                                    <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">1</span>
                                </li>
                            </ul>
                        </div>
                        <CommentCards
                            isLoggedIn={isLoggedIn}   /// if user login ///
                            blogId={postDetilas.id}
                            type= "blogs"
                            title="Leave a Reply"
                            des={
                                <p className="text-sm text-gray-600 mb-4">
                                    Your email address will <span className="italic">not</span> be published.
                                    Required fields are marked <span className="text-red-500">*</span>
                                </p>
                            }
                            checkbox="Save my name, email, and website in this browser for the next time I comment."
                        />


                         <div className="bg-white shadow-md rounded-2xl p-5">
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
                        </div> 
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}