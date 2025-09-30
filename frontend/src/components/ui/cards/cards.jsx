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

export const BlogsPostCards = ({ id, img, title, description, button, type, Commentbtn = false, Viewbtn = false }) => {
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(0);

    // Handle read more click // 
    const handleReadMore = async () => {
        try {

            await axios.post(`/blogs/like/view/${id}`);

            navigate(`/blogs/${id}`);
        } catch (err) {
            console.error("Error incrementing view:", err);
            //   // navigate even if API fails (optional)
            //   navigate(`/blogs/${id}`);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/comment/${id}?type=${type}`);
                setCommentCount(res.data.count);
                console.log(res.data);

            } catch (err) {
                console.error("Error fetching comments:", err);
            }
        };
        fetchComments();
    }, [id, type]);



    return (
        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition flex flex-col">
            <img
                src={img}
                alt={title}
                className="rounded-md w-full sm:h-32 h-50 md:h-64 object-cover object-center mb-3"
            />

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
                            <CommentButton blogId={id} type={type} />
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




export const CommentCards = ({ title, des, checkbox, button, isLoggedIn, blogId, type, }) => {

    const [form, setForm] = useState({ name: "", email: "", comment: "", otp: "", type });
    const [commentId, setCommentId] = useState(null);
    const [step, setStep] = useState('form')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            if (isLoggedIn) {
                await axios.post('/comment/post',
                    { comment: form.comment, id: blogId, type },
                    { withCredentials: true }

                );
                //  form reset //
                setForm({ name: "", email: "", comment: "", otp: "", type });
                alert("✅ Comment posted successfully");
            } else {
                const res = await axios.post("/comment/request-otp", {
                    name: form.name,
                    email: form.email,
                    comment: form.comment,
                    id: blogId,
                    type
                });
                setCommentId(res.data.commentId,);
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
            alert("✅ Comment verified and posted!");
            setStep("form");
            setForm({ name: "", email: "", comment: "", otp: "" });
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
                        <textarea
                            name="comment"
                            placeholder="Leave Your Comment"
                            rows="5"
                            className="w-full rounded-lg border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.comment}
                            onChange={handleChange}
                            required
                        />

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



export const CommentList = ({ comments, commentCount, setComments }) => {

    const handleCommentLike = async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "/comment/like",
                { commentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update frontend state
            setComments(prev =>
                prev.map(c =>
                    c._id === commentId
                        ? { ...c, likesCount: res.data.likesCount, likedByUser: true }
                        : c
                )
            );
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
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
                <ul className="space-y-2">
                    {comments.map((c) => (
                        <li
                            key={c._id}
                            className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition"
                        >
                            {/*  Avatar  */}
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                                {(c.user?.name || c.name || "G").charAt(0).toUpperCase()}
                            </div>

                            {/*  Comment Content  */}

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-medium text-gray-800">
                                        {c.user?.name || c.name || "Guest User"}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </span>

                                </div>
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

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {c.comment}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
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
                    href="#"
                    className="flex gap-4 px-4 py-2 bg-[#1877F2] hover:bg-[#145DBF] text-white rounded-lg text-center"
                >
                    <FaFacebook size={25} />
                    <span>Facebook</span>
                </a>
                <a
                    href="#"
                    className="flex gap-4 px-4 py-2 bg-[#1DA1F2] hover:bg-[#0d8ddb] text-white rounded-lg text-center"
                >
                    <FaTwitter size={25} />
                    <span>Twitter</span>
                </a>
                <a
                    href="#"
                    className="flex gap-4 px-4 py-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-lg text-center"
                >
                    <FaInstagram size={25} />
                    <span>Instagram</span>
                </a>
                <a
                    href="#"
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

    useEffect(() => {
        axioss
            .get("https://blog.ejobocean.com/wp-json/wp/v2/categories")
            .then((res) => {
                const apiCategories = res.data.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                    count: cat.count,
                }));

                setCategories([{ id: 0, name: "All", count: null }, ...apiCategories]);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

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
    const baseURL = "http://localhost:5000";
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
                        onClick={() => navigate(`/webinars/${webinar._id}`)}
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
    const fullName = `${speaker.salutation ? speaker.salutation + " " : ""}${speaker.firstName} ${speaker.lastName}`;
    const handleClick = () => {
        

        navigate(`/hall-of-fame/${speaker._id}`); // navigate to details page
    };
    return (
        <div onClick={handleClick} className="w-72 bg-white rounded-xl shadow-lg overflow-hidden justify-center flex items-center flex-col">

            <img
                src={speaker.profilePic ? `http://localhost:5000/${speaker.profilePic}` : "/default-avatar.png"}
                alt={fullName}
                className="w-full h-64 object-cover rounded-lg"
            />


            <h3 className="font-semibold text-[15px] mt-3">{fullName}</h3>


            <div className="flex">
                <p className="text-sm mt-1">
                    <span className="font-bold text-[12px]">Course / Qualification :</span> {speaker.qualification || "N/A"}
                </p>
            </div>


            <p className="text-sm mt-2 text-gray-700">
                <span className="text-yellow-600 text-lg mr-1">👨‍💼</span>Intern | Marketing & Finance
            </p>


            <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-[14px] font-medium">Selected In</p>
                <img src="/static-company-logo.png" alt="Company Logo" className="h-6" />
            </div>


            <a
                href={speaker.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] mt-2 text-blue-700 font-semibold flex items-center gap-1"
            >
                Connect On Linkedin <FaLinkedin size={18} />
            </a>
            <span className="flex gap-10 my-2">
                <button target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition" >
                    Linkedin
                </button>

                <button className="px-4 py-1 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                    Book Now
                </button>
            </span>

        </div>
    );
};

