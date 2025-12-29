import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { BlogsPostCards } from "../../../ui/cards/cards";
export default function HallOfFrameSlider() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed", {
                    params: {
                        _embed: true,
                        per_page: 8,
                    },
                });
                setPosts(res.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto text-center font-[Poppins]">

            <div className="flex justify-center mb-10 px-28">
                <h2 className="text-2xl md:text-4xl r font-bold text-[#339ca0]">Latest Blogs</h2>
                
            </div>

            <div >
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 2500 }}
                        loop={posts.length > 4}
                        className="blogs-swiper"
                    >
                        {posts.map((post) => (
                            <SwiperSlide key={post.id}>
                                <BlogsPostCards
                                    id={post.id}
                                    img={
                                        post._embedded?.["wp:featuredmedia"]?.[0]
                                            ?.media_details?.sizes?.pixwell_280x210?.source_url
                                    }
                                    title={
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: post.title.rendered,
                                            }}
                                        />
                                    }
                                    description={post.excerpt.rendered}
                                    button="Read More"
                                    type="blogs"
                                    Commentbtn={true}
                                    Viewbtn={true}
                                    category={post._embedded?.["wp:term"]?.[0]?.[0]?.name}
                                    slug={post.slug}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
}
