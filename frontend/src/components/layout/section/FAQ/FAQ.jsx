import React, { useState,useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";




import AOS from "aos";
import "aos/dist/aos.css";

const faqs = [
    { question: "What is the Big 4 MasterClass?", answer: "The Big 4 MasterClass is a comprehensive program..." },
    { question: "Who is this MasterClass for?", answer: "This MasterClass is for anyone interested in..." },
    { question: "Is this MasterClass live or recorded?", answer: "It is a combination of both live and recorded content." },
    { question: "What support do I get after the course?", answer: "You will receive post-course mentorship and resources." },
    { question: "Will this help me get placed?", answer: "Yes, we provide placement assistance and guidance." },
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };
    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    return (
        <div className="flex flex-col items-center py-20 px-4">
            <h2
                className="text-[44px] font-semibold text-[#339ca0] mb-10"
                data-aos="fade-up">
                FAQs
            </h2>

            <div className="w-full max-w-3xl space-y-5" data-aos="fade-up" data-aos-delay="200">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`hover:bg-[#339ca0] hover:text-white rounded-lg overflow-hidden py-3 shadow-sm transition-all duration-300 ${activeIndex === index
                            ? "bg-[#339ca0] text-white"
                            : "bg-white"
                            }`}>
                        <button
                            className="w-full text-left px-6 py-4 flex justify-between items-center font-medium"
                            onClick={() => toggle(index)}>
                            {faq.question}
                            <span className="text-xl transform transition-transform duration-300">
                                {activeIndex === index ? <FaArrowUp /> : <FaArrowDown />}
                            </span>
                        </button>
                        {activeIndex === index && (
                            <div className="px-6 pb-5 text-sm">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
