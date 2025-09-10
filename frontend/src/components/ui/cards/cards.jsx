import { useNavigate } from "react-router-dom";
import he from "he";
import axios from '../../../utils/axios.js'
import { CommentButton } from "../button/button";
import { ViewButton } from "../button/button";
import { useState, useEffect } from "react";
export const BlogsPostCards = ({ id, img, title, description, button, Commentbtn, Viewbtn }) => {
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(0);

    // Handle read more click
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
                const res = await axios.get(`/comment/${id}?type=blogs`);
                setCommentCount(res.data.count);
            } catch (err) {
                console.error("Error fetching comments:", err);
            }
        };
        fetchComments();
    }, [id]);



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

                    <div className="flex items-center gap-1 text-gray-600 text-sm">

                        <CommentButton />

                        <span className="font-medium">{commentCount}</span>
                    </div>


                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <button className="flex items-center gap-1 hover:text-green-600 transition">
                            <ViewButton blogId={id} />
                        </button>

                    </div>
                </div>
            </div>

        </div>

    );
};




export const CommentCards = ({ title, des, checkbox, button, isLoggedIn, blogId, type, ...rest }) => {

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
