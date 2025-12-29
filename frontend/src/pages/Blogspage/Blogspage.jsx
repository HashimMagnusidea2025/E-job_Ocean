import { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { BlogsPostCards } from "../../components/ui/cards/cards.jsx";

import { FaCommentAlt } from "react-icons/fa";
import axios from "axios";

import axioss from '../../utils/axios.js'
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import hero31 from "../../media/jpg/31.jpg";
import { FaRegCommentDots } from "react-icons/fa";



export default function BlogsPage() {
    const POSTS_PER_PAGE = 8;
    const [posts, setPosts] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    const [data, setData] = useState()
    const fetchCompanydata = async () => {
        try {
            const response = await axioss.get('/general-settings'); // backend endpoint
            // logs full Axios response object
            console.log("✅ Data Received:", response.data);          // logs only your actual data

            setData(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch company logo:", error);
        }
    };

    useEffect(() => {
        fetchCompanydata();
    }, []);


    useEffect(() => {
        axios
            .get("https://blog.ejobocean.com/wp-json/wp/v2/categories")
            .then((res) => {

                const apiCategories = res.data.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                }));
                setCategories([{ id: 0, name: "All" }, ...apiCategories]);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // const fetchPosts = async (page = 1) => {
    //     setLoading(true);
    //     try {
    //         const res = await axios.get("https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed", {
    //             params: {
    //                 _embed: true,
    //                 per_page: POSTS_PER_PAGE,
    //                 page,
    //                 categories: selectedCategory !== "All" ? selectedCategory : undefined,
    //             },
    //         });

    //         setPosts(res.data);
    //         setTotalPages(parseInt(res.headers["x-wp-totalpages"] || "1", 10));
    //     } catch (err) {
    //         console.error("Error fetching posts:", err);
    //     }
    //     setLoading(false);
    // };

    const fetchPosts = async (page = 1) => {
        setLoading(true);
        setPosts(null); // 🟢 clear old posts instantly so loader shows immediately
        try {
            let url = "https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed";


            const params = {
                _embed: true,
                per_page: selectedCategory === "All" ? POSTS_PER_PAGE : 100, // 🧠 fetch more when filtering
                page: selectedCategory === "All" ? page : 1, // category filter ignores pagination
            };

            // 🟢 Pass category ID instead of name
            const categoryObj = categories.find((cat) => cat.name === selectedCategory);
            if (selectedCategory !== "All" && categoryObj) {
                params.categories = categoryObj.id;
            }

            const res = await axios.get(url, { params });
            setPosts(res.data);
            setTotalPages(
                parseInt(res.headers["x-wp-totalpages"] || "1", 10)
            );
        } catch (err) {
            console.error("Error fetching posts:", err);
            setPosts([]); // 🟢 empty array = trigger “No blogs found”
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage, selectedCategory]);




    // useEffect(() => {
    //     axios.get("https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed")

    //         .then((res) => {
    //             setPosts(res.data);
    //             console.log(res.data);
    //         })
    //         .catch((err) => {
    //             console.error("Error fetching posts:", err);
    //         });
    // }, []);


    const filteredPosts = posts?.filter((post) => {
        const title = post.title?.rendered?.toLowerCase() || "";
        const description = post.excerpt?.rendered?.toLowerCase() || "";


        const categoryMatch =
            selectedCategory === "All" ||
            post._embedded?.["wp:term"]?.[0]?.some(
                (cat) => cat.name === selectedCategory || cat.description === selectedCategory
            );

        const searchMatch =
            title.includes(searchQuery.toLowerCase()) ||
            description.includes(searchQuery.toLowerCase());

        return categoryMatch && searchMatch;
    });




    return (
        <div className="w-full font-[Poppins] bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black ">
            <Navbar />


            {/* Hero Section */}

            <section className="container mx-auto text-white text-center py-28">
                <h2 className="text-3xl md:text-[50px] font-extrabold tracking-wide">
                    {data?.name} Blogs
                </h2>
                <p className="mt-4 text-base md:text-lg text-gray-300">
                    Discover the latest articles and updates in various fields.
                </p>
            </section>


            <div className="w-full bg-white">
                <section className="container mx-auto py-12 px-4">



                    <div className="flex flex-wrap gap-2 mb-6 items-center justify-center">

                        <div className="flex flex-wrap gap-2 mb-6 items-center">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`px-4 py-2 rounded-md text-sm ${selectedCategory === cat.name
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-700 border border-gray-300"
                                        }`}
                                    onClick={() => {
                                        setSelectedCategory(cat.name)
                                        setCurrentPage(1);
                                    }
                                    }

                                >
                                    {cat.name}
                                </button>
                            ))}


                        </div>


                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search Blog..."
                            className="ml-auto border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <h2 className="text-2xl font-semibold mb-6">All Blog Posts</h2>



                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            // 🟢 Show loader while loading
                            <div className="col-span-full flex justify-center items-center h-64">
                                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                            </div>
                        ) : !posts || filteredPosts.length === 0 ? (
                            // 🟢 Show “no blogs” message if no data
                            <p className="col-span-full text-center text-gray-600">
                                No blogs found matching your search.
                            </p>
                        ) : (
                            // 🟢 Show posts normally
                            filteredPosts.map((value) => (
                                <BlogsPostCards
                                    key={value.id}
                                    id={value.id}
                                    img={
                                        value._embedded?.["wp:featuredmedia"]?.[0]
                                            ?.media_details?.sizes?.pixwell_280x210?.source_url
                                    }
                                    title={
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: value.title.rendered,
                                            }}
                                        />
                                    }
                                    description={value.excerpt.rendered}
                                    button="Read More"
                                    type="blogs"
                                    Commentbtn={true}
                                    Viewbtn={true}
                                    category={value._embedded?.["wp:term"]?.[0]?.[0]?.name}
                                    slug={value.slug}
                                />
                            ))
                        )}
                    </div>


                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-10 gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            <span className="text-gray-700 font-semibold">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}

                </section>
            </div>

            <Footer />
        </div>
    );
}
