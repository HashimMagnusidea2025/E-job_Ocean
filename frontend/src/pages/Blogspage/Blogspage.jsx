import { useState, useEffect } from "react";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { BlogsPostCards } from "../../components/ui/cards/cards.jsx";

import { FaCommentAlt } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import hero31 from "../../media/jpg/31.jpg";
import { FaRegCommentDots } from "react-icons/fa";
const categories = [
    "All",
    "Articleship",
    "Big 4",
    "Top CA Firms",
    "CA Jobs",
    "Industrial Training",
    "Auditing",
];

// const blogs = [
//     {
//         id: 1,
//         category: "Big 4",
//         title: "Top 20 Transfer Pricing Interview Questions You Must Prepare For Big 4 & MNC Roles",
//         des: "Transfer pricing (TP) is one of the most sought-after and technical domains in tax. If you’re preparing for roles in Big 4s or global MNCs...",
//         image: hero31,
//         path: "/blogs"
//     },
//     {
//         id: 2,
//         category: "CA Jobs",
//         title: "Salary in FDD for CA Freshers: Real Talk About Money, Pressure & Growth",
//         des: "You’ve finally cleared your CA finals. The moment you waited years for. And now… things are going in different directions...",
//         image: hero31,
//         path: "/"
//     },
//     {
//         id: 3,
//         category: "CA Jobs",
//         title: "SAP FICO Salary for CA Freshers: What You Really Need to Know",
//         des: "So you’ve finally cleared CA. The lectures, mock tests, the stress-eating Maggi at 3 am—it’s all done. And now you’re here...",
//         image: hero31,
//     },
//     {
//         id: 4,
//         category: "Auditing",
//         title: "Financial Controller Salary as a CA: What You Deserve and What You Can Expect",
//         des: "Let’s be honest—when we hear “Financial Controller,” most of us picture a senior finance guy with decades of experience...",
//         image: hero31,
//     },
// ];

export default function BlogsPage() {

    const [posts, setPosts] = useState([]);



    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // const filteredBlogs = blogs.filter(
    //     (blog) =>
    //         (selectedCategory === "All" || blog.category === selectedCategory) &&
    //         blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    // );


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


    



    return (
        <div className="w-full font-[Poppins] bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black ">
            <Navbar />


            {/* Hero Section */}
            <section className="container mx-auto text-white text-center py-28">
                <h2 className="text-3xl md:text-[50px] font-extrabold tracking-wide">
                    E-JOB OCEAN BLOGS
                </h2>
                <p className="mt-4 text-base md:text-lg text-gray-300">
                    Discover the latest articles and updates in various fields.
                </p>
            </section>

            {/* Blog Section */}
            <div className="w-full bg-white">
                <section className="container mx-auto py-12 px-4 ">


                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 items-center">

                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-md text-sm ${selectedCategory === cat
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-700 border border-gray-300"
                                    }`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search Blog..."
                            className="ml-auto border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold mb-6">All Blog Posts</h2>

                    {/* Blog Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {posts.map((value) => (
                            <BlogsPostCards
                                key={value.id}
                                id={value.id}
                                img={
                                    value._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
                                        ?.pixwell_280x210?.source_url
                                }
                                title={<span dangerouslySetInnerHTML={{ __html: value.title.rendered }} />}
                                description={value.excerpt.rendered}


                                button="Read More"
                            />
                        ))}

                        {/* {filteredBlogs.map((blog) => (
                            <BlogsPostCards
                                key={blog.id}
                                img={blog.image}
                                title={blog.title}
                                description={blog.des}
                                button="Read More"
                            />
                        ))} */}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
