import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import shubhangijain from '../../../../media/png/ca-shubhangi-jain.png'


const experts = [
    {
        name: "CA Sanat Goyal",
        experience: "10+ Years Of Experience",
        role: "Transfer Pricing Expert | Direct Taxes | FCA",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/EY_logo_2019.svg",
        ],
    },
    {
        name: "CA Shubhangi Jain",
        experience: "10+ Years Of Experience",
        role: "Strategy and Operations Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
            "https://upload.wikimedia.org/wikipedia/commons/1/1c/Deloitte_Logo.png",
        ],
    },
    {
        name: "CA Gaurav Malik",
        experience: "10+ Years Of Experience",
        role: "FP&A | Automation | PE Deal Management",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/EY_logo_2019.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
];

export default function IndustryExperts() {
    return (
        <div className="bg-[#1c1c1c] text-white py-12 px-4 font-[Poppins]">
            <div className="container mx-auto">
                <h2 className="text-[32px] font-bold mb-8">
                    Our <span className="text-[#339ca0]">Industry Experts</span>
                </h2>


            </div>
            <Swiper spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                autoplay={{
                        delay: 3000, // 3 second baad slide change hoga
                        disableOnInteraction: false, // user click kare to bhi autoplay continue rahega
                    }}
                breakpoints={{
                    640: { slidesPerView: 1.2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                    1920: { slidesPerView: 5 },
                }}

                className="relative container mx-auto"
                modules={[Navigation,Autoplay]}>
                {experts.map((expert, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-[#9e5c00] text-white border border-white rounded-xl overflow-hidden text-center pb-5 relative">
                            <img
                                src={expert.image}
                                alt={expert.name}
                                className="w-full h-[320px] object-cover"
                            />
                            <div className="h-[120px] p-4">
                                <h3 className="text-lg font-bold ">{expert.name}</h3>
                                <p className="text-sm mt-1">{expert.experience}</p>
                                <p className="text-sm">{expert.role}</p>
                            </div>
                            <div className="absolute  left-[80px] flex gap-2 bg-white px-4 py-2 rounded-md shadow">
                                {expert.logos.map((logo, i) => (
                                    <img key={i} src={logo} alt="logo" className="h-5" />
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
