import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { useEffect, useState } from "react";
import hero31 from "../../media/jpg/31.jpg";
import { IoMdTime } from "react-icons/io";
import { FaFacebookF, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // X (Twitter)
import { MdEmail, MdShare } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { Link } from "react-router-dom";
import { CommentCards, ReactShareButton } from "../../components/ui/cards/cards.jsx";
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    WhatsappIcon,

    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    TwitterIcon,
    PinterestShareButton,
    PinterestIcon,
    WhatsappShareButton,

} from "react-share";
import axioss from "axios";

import { LikeButton, FacebookButton, XTwitterButton, PinterestButton, EmailButton, ShareButton, LinkedinButton } from "../../components/ui/button/button";
import { CommentList, FollowSocials, SubscribeNow, Categories, LatestPost } from "../../components/ui/cards/cards.jsx";


import { useParams } from "react-router";
import axios from "../../utils/axios.js";
export default function BlogDetailsPage2({ blogs }) {
    const [posts, setPosts] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const { id } = useParams();
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);

    const type = "blogs";

    // useEffect(() => {

    //     const fetchComments = async () => {

    //         try {
    //             console.log("BlogDetailsPage: Fetching comments for blog:", {
    //                 id,
    //                 type,
    //                 idType: typeof id
    //             });
    //             const res = await axios.get(`/comment/${id}?type=${type}`);
    //             console.log("BlogDetailsPage: Comments response:", {
    //                 count: res.data.count,
    //                 comments: res.data.comments
    //             });
    //             setComments(res.data.comments);
    //             setCommentCount(res.data.count);
    //         } catch (err) {
    //             console.error("Error fetching comments:", err);

    //         }
    //     };
    //     fetchComments();
    // }, [id, type]);



    const fetchComments = async () => {
        try {
            console.log("BlogDetailsPage: Fetching comments for blog:", {
                id,
                type,
                idType: typeof id
            });
            const res = await axios.get(`/comment/${id}?type=${type}`);
            console.log("BlogDetailsPage: Comments response:", {
                count: res.data.count,
                comments: res.data.comments
            });
            setComments(res.data.comments);
            setCommentCount(res.data.count);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    // ✅ Initial load पर comments fetch करें
    useEffect(() => {
        fetchComments();
    }, [id, type]);

    // ✅ Comment add होने के बाद refresh करने का function
    const handleCommentAdded = () => {
        console.log("Comment added, refreshing comments...");
        fetchComments(); // ✅ Comments को फिर से fetch करें
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);;
    useEffect(() => {
        const token = localStorage.getItem("token"); // ya cookies se lo
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // ✅ Fetch Like Count
    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                console.log("Fetching like count for blog:", { id, type });
                const res = await axios.get(`/blogs/like/likes/${id}/${type}`);
                console.log("Blog like count response:", res.data);
                setLikeCount(res.data.totalCount);
            } catch (err) {
                console.error(err.response?.data || err.message);
            }
        };
        fetchLikeCount();
    }, [id, type]);


    useEffect(() => {

        axios.get("https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed")

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





    // Like functionality yaha
    // ✅ Handle Like
    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");

            console.log("Sending like request for blog:", { id, type });
            const res = await axios.post(
                "/blogs/like",
                { id: id, type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Blog like response:", res.data);
            if (res.data.totalCount !== undefined) {
                setLikeCount(res.data.totalCount);
                setLiked(true);
            }
        } catch (err) {
            console.error("Blog like error:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            if (err.response?.data?.message === "Already liked") {
                alert("You've already liked this blog");
                setLiked(true);
            } else if (err.response?.status === 401) {
                // alert("Please login to like blogs");
            } else {
                alert("Failed to like blog:" + (err.response?.data?.message || err.message));
            }

        }
    };



    const shareUrl = window.location.href;


    return (
        <div className="w-full font-[Poppins] bg-gray-50">
            <Navbar />

            <div className="font-[Poppins] bg-gray-50">
                <ReactShareButton facebook twitter pinterest email whatsapp telegram />


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
                {!postDetilas ? (
                    // 🔹 Loader only for blog section
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : (
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

                                <div className="flex flex-col  w-full md:w-2/3 ">
                                    <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[35px] leading-snug mb-3">
                                        <div
                                            className="prose"
                                            dangerouslySetInnerHTML={{ __html: postDetilas.title.rendered }}
                                        />
                                    </h2>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <MdOutlineAccessTime className="text-gray-500" />
                                        <h3>
                                            {new Date(postDetilas?.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </h3>
                                    </div>



                                    {/* <div
                                        className="prose"
                                        dangerouslySetInnerHTML={{ __html: postDetilas.excerpt.rendered }}
                                    />  */}
                                    {/* <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">
                                    By Nilesh Kadnor | April 1, 2025
                                </h3> */}
                                </div>

                            </div>

                            <div className=" bg-white p-6 mb-6 ">

                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2">
                                        <LikeButton
                                            blogId={postDetilas.id}
                                            type={type}
                                            likeCount={likeCount}
                                            setLikeCount={setLikeCount}
                                            onClick={handleLike}
                                            liked={liked}
                                        />
                                    </div>

                                    <ReactShareButton
                                        facebook
                                        twitter
                                        pinterest
                                        email
                                        linkedin
                                        desktopClass="hidden lg:flex flex gap-2 rounded-md" />




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


                            </div>
                            <CommentCards
                                isLoggedIn={isLoggedIn}   /// if user login ///
                                blogId={postDetilas.id}
                                type="blogs"
                                title="Leave a Reply"
                                des={
                                    <p className="text-sm text-gray-600 mb-4">
                                        Your email address will <span className="italic">not</span> be published.
                                        Required fields are marked <span className="text-red-500">*</span>
                                    </p>
                                }
                                checkbox="Save my name, email, and website in this browser for the next time I comment."
                                onCommentAdded={handleCommentAdded} // ✅ Refresh function pass करें
                            />

                            <CommentList
                                comments={comments}
                                commentCount={commentCount}
                                setComments={setComments}
                                onCommentUpdate={fetchComments}
                            />



                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <FollowSocials />



                            <div className="bg-white shadow-md rounded-2xl p-5">
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                        LATEST POSTS
                                    </h3>

                                    <div className="flex flex-col gap-5">
                                        {posts.map((value, idss) => (
                                            <Link
                                                key={idss}
                                                to={`/blogs/${value.id}`}
                                                className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition"
                                            >
                                                <LatestPost
                                                    key={value.id}
                                                    id={value.id}
                                                    img={
                                                        value._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
                                                            ?.pixwell_280x210?.source_url
                                                    }
                                                    title={value.title.rendered}
                                                    date={value.date.split("T")[0]}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>



                            <Categories />


                            <SubscribeNow />
                        </div>
                    </div>
                )}

            </div>

            <Footer />
        </div>
    );
}