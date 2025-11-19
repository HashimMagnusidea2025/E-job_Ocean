import { useNavigate } from "react-router-dom";
import he from "he";
import axios from '../../../utils/axios.js'
import { CommentButton } from "../button/button";
import { ViewButton } from "../button/button";
import { useState, useEffect } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoMdTime } from "react-icons/io";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { LikeButton } from "../button/button";
import axioss from 'axios';
import { FaRegCalendarAlt } from "react-icons/fa";
import RegisterModal from "../../../pages/Webinars/RegisterModal.jsx";
import { FaLinkedin } from "react-icons/fa";
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
import noImage from '../../../media/png/no.png';
import EmojiPicker from "emoji-picker-react";
import Swal from "sweetalert2";
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    TwitterIcon,
    PinterestShareButton,
    PinterestIcon,
    WhatsappShareButton,
    FacebookShareCount,
    PinterestShareCount,

} from "react-share";

export const BlogsPostCards = ({ id, img, title, description, button, type, Commentbtn = false, Viewbtn = false, category, slug }) => {
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(0);

    // Handle read more click // 
    const handleReadMore = async () => {
        try {

            await axios.post(`/blogs/like/view/${id}`);

            navigate(`/blogs/${slug}`);
        } catch (err) {
            console.error("Error incrementing view:", err);
            //   // navigate even if API fails (optional)
            //   navigate(`/blogs/${id}`);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                console.log("BlogsPostCards: Fetching comments for", { id, type });

                // Add full URL for debugging
                const url = `/comment/${id}?type=${type}`;
                console.log("Full API URL:", url);
                const res = await axios.get(url);
                console.log("BlogsPostCards: Full response:", res);
                console.log("BlogsPostCards: Response data:", res.data);
                console.log("BlogsPostCards: Count value:", res.data.count);
                console.log("BlogsPostCards: Comments response", res.data);
                setCommentCount(res.data.count);
                console.log(commentCount.data);

                console.log(res.data);

            } catch (err) {
                console.error("Error fetching comments:", err);
            }
        };
        fetchComments();
    }, [id, type]);



    return (
        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition flex flex-col" onClick={handleReadMore}>

            <div className=" relative">

                <img
                    src={img || noImage}
                    alt={title}
                    className="rounded-md w-full sm:h-32 h-50 md:h-64 object-cover object-center mb-3"
                />
                {category && (
                    <span className="absolute bottom-4 left-2 bg-[#20AEB2] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {category}
                    </span>
                )}
            </div>

            <h3 className="text-sm font-semibold text-gray-800 mb-2">{title}</h3>

            <div
                className="text-sm text-gray-600 mb-4 line-clamp-6"
                dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="flex items-center mt-auto pt-3 justify-between">

                <button
                    onClick={handleReadMore}
                    className="bg-black text-white text-xs px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
                >
                    {button}
                </button>

                <div className="flex gap-4">

                    {Commentbtn && (
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                            {/* ✅ Pass commentCount prop */}
                            <CommentButton blogId={id} type={type} commentCount={commentCount} />
                        </div>
                    )}


                    {Viewbtn && (
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <ViewButton blogId={id} />
                        </div>
                    )}
                </div>
            </div>

        </div>

    );
};





export const BlogsCategoryCards = ({ blogs = [] }) => {
    if (!blogs.length)
        return <p className="text-center text-gray-500">No posts available.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {blogs.map((blog) => {
                const image =
                    blog._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.pixwell_370x250?.source_url ||
                    "https://via.placeholder.com/400x300";
                const title = blog.title.rendered;
                const category = blog._embedded?.["wp:term"]?.[0]?.[0]?.name
                const excerpt = blog.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 100) + "…";

                return (
                    <Link to={`/blogs/${blog.slug}`}>
                        <div
                            key={blog.id}
                            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-64 object-cover object-center rounded-t-lg"
                                />

                                <div className="absolute bottom-3 left-3">
                                    {category && (
                                        <span className="absolute bottom-4 left-2 bg-[#20AEB2] text-white text-xs font-medium px-3 py-1 rounded-full">
                                            {category}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-5">
                                <h2
                                    className="text-lg font-semibold text-gray-800 mb-2"
                                    dangerouslySetInnerHTML={{ __html: title }}
                                />

                                <p className="text-gray-600 text-sm mb-3" dangerouslySetInnerHTML={{ __html: excerpt }} />
                                {/* <p className="text-sm text-gray-500 mb-4">by ejobocean</p> */}
                                <button
                                    className="bg-black text-white text-xs px-4 py-2 rounded-md hover:bg-gray-800 transition inline-block"
                                >
                                    READ MORE →
                                </button>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};







export const CommentCards = ({ title, des, checkbox, button, isLoggedIn, blogId, type, onCommentAdded }) => {
    console.log("CommentCards: Received props", { blogId, type, isLoggedIn });
    const [form, setForm] = useState({ name: "", email: "", comment: "", otp: "", type });
    const [commentId, setCommentId] = useState(null);
    const [step, setStep] = useState('form')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

    };

    const handleEmojiClick = (emojiData) => {
        setForm((prev) => ({ ...prev, comment: prev.comment + emojiData.emoji }));
    };

    // const handleSubmit = async (e) => {

    //     e.preventDefault();
    //     try {

    //         if (isLoggedIn) {
    //             await axios.post('/comment/post',
    //                 { comment: form.comment, id: blogId, type },
    //                 { withCredentials: true }

    //             );
    //             //  form reset //
    //             setForm({ name: "", email: "", comment: "", otp: "", type });
    //             alert("✅ Comment posted successfully");
    //         } else {
    //             const res = await axios.post("/comment/request-otp", {
    //                 name: form.name,
    //                 email: form.email,
    //                 comment: form.comment,
    //                 id: blogId,
    //                 type
    //             });
    //             setCommentId(res.data.commentId,);
    //             setStep("otp");
    //         }
    //     } catch (err) {
    //         alert("❌ " + err.response?.data?.msg || "Something went wrong");
    //     }

    // }


    // const handleVerify = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await axios.post("/comment/verify-otp", { commentId, otp: form.otp });
    //         alert("✅ Comment verified and posted!");
    //         setStep("form");
    //         setForm({ name: "", email: "", comment: "", otp: "" });
    //     } catch (err) {
    //         alert("❌ " + (err.response?.data?.msg || "Invalid OTP"));
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoggedIn) {
                await axios.post('/comment/post',
                    { comment: form.comment, id: blogId, type },
                    { withCredentials: true }
                );
                // ✅ Form reset और parent को notify करें
                setForm({ name: "", email: "", comment: "", otp: "", type });
                if (onCommentAdded) {
                    onCommentAdded(); // ✅ Parent component को notify करें
                }

            } else {
                const res = await axios.post("/comment/request-otp", {
                    name: form.name,
                    email: form.email,
                    comment: form.comment,
                    id: blogId,
                    type
                });
                setCommentId(res.data.commentId);
                setStep("otp");
            }
        } catch (err) {
            alert("❌ " + err.response?.data?.msg || "Something went wrong");
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/comment/verify-otp", { commentId, otp: form.otp });

            // ✅ OTP verify होने के बाद refresh करें
            setStep("form");
            setForm({ name: "", email: "", comment: "", otp: "" });
            if (onCommentAdded) {
                onCommentAdded(); // ✅ Parent component को notify करें
            }
            // alert("✅ Comment verified and posted!");
        } catch (err) {
            alert("❌ " + (err.response?.data?.msg || "Invalid OTP"));
        }
    };
    return (
        <>
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    {title || "Leave a Reply"}
                </h3>
                {des}

                {step === "form" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Comment textarea */}
                        <div className="relative">
                            <textarea
                                name="comment"
                                placeholder="Leave Your Comment 😊"
                                rows="5"
                                className="w-full rounded-lg border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.comment}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker((prev) => !prev)}
                                className="absolute bottom-3 right-3 text-2xl"
                            >
                                😊
                            </button>

                            {showEmojiPicker && (
                                <div className="absolute bottom-12 right-0 z-50">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>


                        {/* Guest user inputs */}
                        {!isLoggedIn && (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className="w-full rounded-full border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full rounded-full border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="saveInfo" className="w-4 h-4" />
                                    <label htmlFor="saveInfo" className="text-sm text-gray-700">
                                        {checkbox}
                                    </label>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
                        >
                            {isLoggedIn ? "Post Comment" : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* OTP Step */}
                {step === "otp" && (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            className="w-full rounded-lg border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={form.otp}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}
            </div>

        </>
    )

}



export const CommentList = ({ comments, commentCount, setComments, onCommentUpdate }) => {

    const [visibleCount, setVisibleCount] = useState(2); // 👈 Show 4 initially
    // const handleCommentLike = async (commentId) => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const res = await axios.post(
    //             "/comment/like",
    //             { commentId },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         // Update frontend state
    //         setComments(prev =>
    //             prev.map(c =>
    //                 c._id === commentId
    //                     ? { ...c, likesCount: res.data.likesCount, likedByUser: true }
    //                     : c
    //             )
    //         );

    //         // ✅ Notify parent component about the update
    //         if (onCommentUpdate) {
    //             onCommentUpdate();
    //         }
    //     } catch (err) {
    //         console.error(err.response?.data || err.message);
    //     }
    // };
    const handleCommentLike = async (commentId) => {
        const token = localStorage.getItem("token");

        // ✅ Logged-in user
        if (token) {
            try {
                const res = await axios.post(
                    "/comment/like",
                    { commentId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setComments(prev =>
                    prev.map(c =>
                        c._id === commentId
                            ? { ...c, likesCount: res.data.likesCount, likedByUser: true }
                            : c
                    )
                );

                if (onCommentUpdate) onCommentUpdate();
            } catch (err) {
                console.error(err.response?.data || err.message);
            }
            return;
        }

        // ✅ Guest user — localStorage + frontend
        const guestLikes = JSON.parse(localStorage.getItem("guestLikes") || "[]");
        if (!guestLikes.includes(commentId)) {
            localStorage.setItem("guestLikes", JSON.stringify([...guestLikes, commentId]));

            setComments(prev =>
                prev.map(c =>
                    c._id === commentId
                        ? { ...c, likesCount: c.likesCount + 1, likedByUser: true }
                        : c
                )
            );
        }
    };

    // 👇 Slice comments based on visibleCount
    const visibleComments = comments.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3); // 👈 Increase by 4 on each click
    };
    return (
        <div className="bg-white p-6 mt-6 rounded-2xl shadow-sm border">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
                {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
            </h3>

            {comments.length === 0 ? (
                <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                </p>
            ) : (
                <>
                    <ul className="space-y-2">
                        {visibleComments.map((c) => (
                            <li
                                key={c._id}
                                className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition"
                            >
                                {/* Avatar */}
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                                    {(c.user?.firstName?.[0] ||
                                        c.user?.name?.[0] ||
                                        c.name?.[0] ||
                                        "G").toUpperCase()}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-gray-800">
                                            {c.user
                                                ? `${c.user.firstName || ""} ${c.user.lastName || ""}`.trim() ||
                                                c.user.name ||
                                                "Guest User"
                                                : c.name || "Guest User"}
                                        </p>
                                        <span className="text-xs text-gray-400">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {c.comment}
                                        </p>

                                        <button
                                            onClick={() => handleCommentLike(c._id)}
                                            disabled={c.likedByUser}
                                            className={`flex items-center gap-2 text-sm ${c.likedByUser
                                                ? "text-blue-600"
                                                : "text-gray-600 hover:text-blue-600"
                                                }`}
                                        >
                                            {c.likedByUser ? <AiFillLike size={16} /> : <AiOutlineLike size={16} />}
                                            <span>{c.likesCount}</span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* 👇 Load More Button */}
                    {visibleCount < comments.length && (
                        <div className="text-end mt-4">
                            <button
                                onClick={handleLoadMore}
                                className="px-3 py-1  text-black rounded-lg  transition"
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}



export const FollowSocials = () => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-4">Follow Socials</h3>
            <div className="flex flex-col space-y-3">
                <a
                    href="  https://www.facebook.com/people/ejoboceancom/100063704361932/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 px-4 py-2 bg-[#1877F2] hover:bg-[#145DBF] text-white rounded-lg text-center"
                >
                    <FaFacebook size={25} />
                    <span>Facebook</span>
                </a>
                <a
                    href="https://x.com/EjobOcean?s=08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 px-4 py-2 bg-[#1DA1F2] hover:bg-[#0d8ddb] text-white rounded-lg text-center"
                >
                    <FaTwitter size={25} />
                    <span>Twitter</span>
                </a>
                <a
                    href="https://www.instagram.com/ejobocean/?igshid=z4e662ypb7im"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 px-4 py-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-lg text-center"
                >
                    <FaInstagram size={25} />
                    <span>Instagram</span>
                </a>
                <a
                    href="https://t.me/ejoboceanllp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 px-4 py-2 bg-[#0088cc] hover:bg-[#006b99] text-white rounded-lg text-center"
                >
                    <FaTelegram size={25} />
                    <span>Telegram</span>
                </a>
            </div>
        </div>
    );
};


export const SubscribeNow = () => {

    return (
        <>

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
        </>
    )
}


export const Categories = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axioss
            .get("https://blog.ejobocean.com/wp-json/wp/v2/categories")
            .then((res) => {
                const apiCategories = res.data.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug, // ✅ add slug

                    count: cat.count,
                }));

                setCategories([{ id: 0, name: "All", slug: "all", count: null }, ...apiCategories]);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);


    //     const handleCategoryClick = (categoryName) => {
    //     navigate(`/blogs?category=${encodeURIComponent(categoryName)}`);
    //   };
    return (
        <div className="w-full p-5 bg-white shadow-md rounded-2xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">CATEGORIES</h3>

            {categories.length === 0 ? (
                <p className="text-gray-500">Loading categories...</p>
            ) : (
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className="flex items-center justify-between border-b border-dotted border-gray-300 pb-1"
                            // onClick={() => navigate(`/blogs/category/${cat.id}`)}
                            onClick={() => navigate(`/blogs/category/${cat.slug}`)} // ✅ use slug
                        >
                            <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">
                                {cat.name}
                            </span>
                            {cat.count !== null && (
                                <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
                                    {cat.count}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const LatestPost = ({ id, img, title, date }) => {
    return (
        <>
            <img
                src={img}
                alt="Author"
                className="h-28 w-32 rounded-md object-cover object-center"
            />

            <div className="flex flex-col">

                <p className="text-sm font-medium text-gray-800 leading-snug cursor-pointer">
                    <span dangerouslySetInnerHTML={{ __html: title }} />
                </p>


                <div className="mt-2 flex items-center text-xs text-gray-500">
                    <IoMdTime className="mr-1 h-4 w-4" />
                    <span dangerouslySetInnerHTML={{ __html: date }} />
                </div>
            </div>
        </>
    );
};







export const ReactShareButton = ({
    facebook = false,
    twitter = false,
    pinterest = false,
    email = false,
    whatsapp = false,
    telegram = false,
    linkedin = false,
    desktopClass,
    mobileClass = "lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-md z-50 p-1",
}) => {
    const shareUrl = window.location.href;


    const finalDesktopClass = desktopClass
        ? desktopClass
        : "hidden lg:flex fixed left-1 top-1/2 -translate-y-1/2 flex-col z-50";

    return (
        <>
            {/* Desktop / Laptop */}

            <div className={finalDesktopClass}>

                <FacebookShareCount url={shareUrl}>
                    {(shareCount) => (
                        <span className="myShareCountWrapper">{shareCount ?? 0}</span>
                    )}
                </FacebookShareCount>


                {facebook && (
                    <FacebookShareButton url={shareUrl}>
                        <FacebookIcon size={50} box />
                    </FacebookShareButton>
                )}

                {twitter && (
                    <TwitterShareButton url={shareUrl}>
                        <TwitterIcon size={50} box />
                    </TwitterShareButton>
                )}
                {pinterest && (
                    <PinterestShareButton url={shareUrl}>
                        <PinterestIcon size={50} box />
                    </PinterestShareButton>
                )}

                {email && (
                    <EmailShareButton url={shareUrl}>
                        <EmailIcon size={50} box />
                    </EmailShareButton>
                )}
                {whatsapp && (
                    <WhatsappShareButton url={shareUrl}>
                        <WhatsappIcon size={50} box />
                    </WhatsappShareButton>
                )}

                {telegram && (
                    <TelegramShareButton url={shareUrl}>
                        <TelegramIcon size={50} box />
                    </TelegramShareButton>
                )}
                {linkedin && (
                    <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={50} box />
                    </LinkedinShareButton>
                )}
            </div>

            {/* Mobile / Tablet */}
            <div className={mobileClass}>
                <div className="flex justify-around items-center py-1">
                    {facebook && (
                        <FacebookShareButton url={shareUrl}>
                            <FacebookIcon size={40} box />
                        </FacebookShareButton>
                    )}

                    {twitter && (
                        <TwitterShareButton url={shareUrl}>
                            <TwitterIcon size={40} box />
                        </TwitterShareButton>
                    )}
                    {pinterest && (
                        <PinterestShareButton url={shareUrl}>
                            <PinterestIcon size={40} box />
                        </PinterestShareButton>
                    )}

                    {email && (
                        <EmailShareButton url={shareUrl}>
                            <EmailIcon size={40} box />
                        </EmailShareButton>
                    )}
                    {whatsapp && (
                        <WhatsappShareButton url={shareUrl}>
                            <WhatsappIcon size={40} box />
                        </WhatsappShareButton>
                    )}

                    {telegram && (
                        <TelegramShareButton url={shareUrl}>
                            <TelegramIcon size={40} box />
                        </TelegramShareButton>
                    )}
                    {linkedin && (
                        <LinkedinShareButton url={shareUrl}>
                            <LinkedinIcon size={40} box />
                        </LinkedinShareButton>
                    )}
                </div>
            </div>
        </>
    );
};




export const WebinarCardsList = ({ webinar, onRegisterClick }) => {
    const start = new Date(webinar.WebinarStartDateTime);
    const end = new Date(webinar.WebinarEndDateTime);
    const now = new Date(); // current time




    const isUpcoming = start > now; // true if webinar hasn't ended yet
    const [isModalOpen, setIsModalOpen] = useState(false);
    const capitalizeFirst = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    const navigate = useNavigate();


    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
                {/* Speaker Banner Image */}
                {webinar.Speaker && (
                    <img
                        src={
                            webinar.Speaker?.profilePic
                                ? `${baseURL}/${webinar.Speaker.profilePic}`
                                : "/default-avatar.png"
                        }
                        alt="Speaker"
                        className="w-full h-52 object-contain bg-gray-100"
                    />
                )}


                {/* Webinar Type Badge */}
                {webinar.WebinarType && (
                    <div className={`ribbon ${webinar.WebinarType.toLowerCase() === 'paid' ? 'ribbon-green' : 'ribbon-red'}`}>
                        <span>{capitalizeFirst(webinar.WebinarType)}</span>
                    </div>
                )}

            </div>

            <div className="p-5">
                {/* Speaker Info */}
                {webinar.Speaker && (
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={
                                webinar.Speaker.profilePic
                                    ? `${baseURL}/${webinar.Speaker.profilePic}`
                                    : "/default-avatar.png"
                            }
                            alt="Speaker"
                            className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                        <span className="text-sm font-medium text-gray-900">
                            {capitalizeFirst(webinar.Speaker.salutation)}
                            {capitalizeFirst(webinar.Speaker.firstName)}{" "}

                            {capitalizeFirst(webinar.Speaker.lastName)}

                        </span>
                    </div>
                )}

                {/* Webinar Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {capitalizeFirst(webinar.WebinarTitle)}
                </h3>

                {/* Date & Time */}
                <div className="text-sm text-gray-600 flex items-center gap-2 mb-3 border-l-4 border-red-600 pl-3">
                    <FaRegCalendarAlt className="text-red-600" />
                    <span>
                        {start.toLocaleString()} - {end.toLocaleTimeString()}
                    </span>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
                        {capitalizeFirst(webinar.WebinarMode)}

                    </h3>
                </div>

                {/* Action Button */}
                <div className="flex gap-4">
                    {isUpcoming && (
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                if (onRegisterClick) onRegisterClick(webinar);
                            }}
                            className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Register
                        </button>
                    )}

                    <RegisterModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        webinarId={webinar._id}
                        webinarType={webinar.WebinarType}
                    />
                    <button
                        onClick={() => navigate(`/webinars/${webinar.WebinarSlug}`)}
                        className="w-full bg-[#101828] text-white text-sm py-2.5 rounded-lg font-medium hover:bg-[#1d2939] transition"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>

    );
};











export const HallOfFameCards = ({ speaker }) => {

    const navigate = useNavigate();
    // ✅ Determine if it's Speaker or Mentor
    // const isMentor = speaker.sessions && speaker.sessions.length > 0;
    // const userType = isMentor ? 'mentor' : 'speaker';


    // const fullName = `${speaker.salutation ? speaker.salutation + " " : ""}${speaker.firstName} ${speaker.lastName}`;

    // ✅ Better Mentor Detection
    const isMentor =
        speaker.hasOwnProperty("profilePicture") ||
        speaker.hasOwnProperty("sessionCount") ||
        (Array.isArray(speaker.sessions) && speaker.sessions !== undefined);

    const userType = isMentor ? "mentor" : "speaker";
    const fullName = `${speaker.salutation ? speaker.salutation + " " : ""}${speaker.firstName} ${speaker.lastName}`;

    // ✅ Correct image source based on user type
    const getImageSource = () => {
        if (isMentor) {
            // Mentor ke liye profilePicture use karein
            return speaker.profilePicture ? `${baseURL}/${speaker.profilePicture}` : "/default-avatar.png";
        } else {
            // Speaker ke liye profilePic use karein
            return speaker.profilePic ? `${baseURL}/${speaker.profilePic}` : "/default-avatar.png";
        }
    };

    const imageUrl = getImageSource();
    const handleClick = () => {

        navigate(`/hall-of-fame/${speaker._id}`); // navigate to details page
    };
    return (
        <div onClick={handleClick} className="w-72 bg-white rounded-xl shadow-lg overflow-hidden justify-center flex items-center flex-col">


            <img
                src={imageUrl}
                alt={fullName}
                className="w-full h-48 object-contain"
            />

            {/* <img
                src={imageUrl}
                alt={fullName}
                className="w-full h-48 object-cover object-top"
            /> */}


            <h3 className="font-semibold text-[15px] mt-3">{fullName}</h3>


            <div className="flex">
                <p className="text-sm mt-1">
                    <span className="font-bold text-[12px]">Course / Qualification :</span> {speaker.qualification || "N/A"}
                </p>
            </div>


            <p className="text-sm mt-2 text-gray-700 line-clamp-3 px-2">
                <span className="text-yellow-600 text-lg mr-1">👨‍💼</span>
                {speaker.introduction || "No introduction available."}
            </p>



            {/* <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-[14px] font-medium">Selected In</p>
                <img src={noImage} alt="Company Logo" className="h-6" />
            </div> */}


            {/* <a
                href={speaker.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] mt-2 text-blue-700 font-semibold flex items-center gap-1"
            >
                Connect On Linkedin <FaLinkedin size={18} />
            </a> */}
            <span className="flex gap-10 my-2">
                {/* <button onClick={() => window.open(speaker.linkedin || "#", "_blank")}
                    
                    className="px-4 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition" >
                    Linkedin
                </button> */}

                <button className="px-4 py-1 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                    Book Now
                </button>
            </span>

        </div>
    );
};










export const JobApplicationForm = ({ jobId, closeModal, initialData = {} }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        country: "",
        state: "",
        city: "",
        resume: null,
        ...initialData,
    });
    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDropdown, setLoadingDropdown] = useState({
        countries: false,
        states: false,
        cities: false,
    });

    useEffect(() => {
        const loadCountries = async () => {
            setLoadingDropdown(prev => ({ ...prev, countries: true }));
            try {
                const response = await axios.get("/country");
                setCountries(response.data.country || []);
            } catch (error) { console.error(error); }
            finally { setLoadingDropdown(prev => ({ ...prev, countries: false })); }
        };
        loadCountries();
    }, []);

    useEffect(() => {
        const loadStates = async () => {
            if (!formData.country) {
                setStates([]);
                setFormData(prev => ({ ...prev, state: "", city: "" }));
                return;
            }
            setLoadingDropdown(prev => ({ ...prev, states: true }));
            try {
                const response = await axios.get(`/state/country/${formData.country}`);
                setStates(response.data.data || []);
            } catch (error) { console.error(error); setStates([]); }
            finally { setLoadingDropdown(prev => ({ ...prev, states: false })); }
        };
        loadStates();
    }, [formData.country]);

    useEffect(() => {
        const loadCities = async () => {
            if (!formData.state) {
                setCities([]);
                setFormData(prev => ({ ...prev, city: "" }));
                return;
            }
            setLoadingDropdown(prev => ({ ...prev, cities: true }));
            try {
                const response = await axios.get(`/city/state/${formData.state}`);
                setCities(response.data.data || []);
            } catch (error) { console.error(error); setCities([]); }
            finally { setLoadingDropdown(prev => ({ ...prev, cities: false })); }
        };
        loadCities();
    }, [formData.state]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "mobile") {
            // ✅ Sirf numbers allow karein aur maximum 10 digits
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        }
        else if (name === "resume") {
            setFormData(prev => ({ ...prev, resume: files[0] }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                ...(name === "country" ? { state: "", city: "" } : {}),
                ...(name === "state" ? { city: "" } : {})
            }));
        }
        // clear the error message when user starts typing
        setErrors(prev => ({ ...prev, [name]: "" }));
    };


    // ✅ Validation before submit
    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        // Mobile validation - exactly 10 digits
        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile number must be exactly 10 digits.";
        }
        if (!formData.country) newErrors.country = "Please select a country.";
        if (!formData.state) newErrors.state = "Please select a state.";
        if (!formData.city) newErrors.city = "Please select a city.";
        if (!formData.resume) newErrors.resume = "Please upload your resume.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        // if (!formData.resume) {
        //     return Swal.fire({
        //         icon: "warning",
        //         title: "Resume Required",
        //         text: "Please upload your resume before submitting.",
        //     });
        // }
        if (!validateForm()) return;
        const submissionData = new FormData();
        for (let key in formData) {
            submissionData.append(key, formData[key]);
        }
        submissionData.append("jobId", jobId);

        try {
            const response = await axios.post("/job-register", submissionData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Application submitted successfully!",
                confirmButtonColor: "#339ca0",
            });
            closeModal();
        } catch (err) {
            console.error(err.response?.data || err);
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: err.response?.data?.message || "Failed to submit application.",
            });
        }
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium mb-1">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter First Name"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"

                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter Last Name"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"

                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"

                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Mobile Number</label>
                <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter Mobile Number"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Location Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Country {loadingDropdown.countries && "(Loading...)"}
                    </label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        disabled={loadingDropdown.countries}
                    >
                        <option value="">-- Select Country --</option>
                        {countries.map((country) => (
                            <option key={country._id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        State {loadingDropdown.states && "(Loading...)"}
                    </label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        disabled={!formData.country || loadingDropdown.states}
                    >
                        <option value="">-- Select State --</option>
                        {states.map((state) => (
                            <option key={state._id} value={state.id}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        City {loadingDropdown.cities && "(Loading...)"}
                    </label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        disabled={!formData.state || loadingDropdown.cities}
                    >
                        <option value="">-- Select City --</option>
                        {cities.map((city) => (
                            <option key={city._id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Upload Resume</label>
                <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                />
                {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
            </div>

            <button
                type="submit"
                className="bg-[#339ca0] text-white py-2 rounded hover:opacity-90 transition font-medium mt-2"
            >
                Submit Application
            </button>
        </form>
    );
}



export const TestimonialCard = ({ img, title, name, companyimg }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-3  sm:flex-row items-center gap-4 max-w-[450px] w-full">
            <div className="flex flex-col sm:flex-row gap-4">
                <img
                    src={img}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover"
                />
                <p className="italic text-[#6b4b3e] text-sm leading-relaxed">
                    <span className="text-2xl text-[#662C03CC] font-serif">“</span>
                    {title}
                    <span className="text-2xl text-[#ff8000] font-serif">”</span>
                </p>
            </div>


            {/* Middle: Quote Text */}
            <div className="flex-1 text-center sm:text-left">


                {/* Bottom: Button + Name + Logo */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                    <button className="bg-[#ff8000] hover:bg-[#e46f00] text-white font-semibold px-4 py-1 rounded-lg flex items-center gap-2 text-sm">
                        Watch Now <span className="text-lg">▶</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{name}</span>
                        <img
                            src={companyimg}
                            alt="Company Logo"
                            className="h-5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};




