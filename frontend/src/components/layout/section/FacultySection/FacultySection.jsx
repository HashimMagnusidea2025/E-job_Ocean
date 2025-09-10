import { FaLinkedin, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import architAggarwal from '../../../../media/png/ca-archit-aggarwal.png';
import { CartView } from "../../../cards/cards";
import { useState } from "react";

export default function FacultySection() {
    const [cartShow, setCartShow] = useState(false)
    return (
        <section className="bg-[#fdf9f5] py-12 sm:py-16 text-center px-4 sm:px-6">
            {/* Section Heading */}
            <h2 className="text-2xl sm:text-3xl font-semibold mb-1 sm:mb-2">Our</h2>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#339ca0] mb-8 sm:mb-10">Experienced Faculty</h3>

            {/* Faculty Card */}
            <div className="bg-white max-w-4xl mx-auto rounded-xl shadow-md p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* Image Circle */}
                <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-[#339ca0] flex items-center justify-center overflow-hidden">
                    <img
                        src={architAggarwal}
                        alt="Pooja Sharma"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Faculty Info */}
                <div className="text-center sm:text-left">
                    <h4 className="text-xl sm:text-2xl font-semibold mb-2">Pooja Sharma</h4>

                    <div className="flex justify-center sm:justify-start items-center gap-2 mb-4">
                        <span className="bg-orange-100 text-[#339ca0] text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                            10+ yrs of Experience
                        </span>
                        <FaLinkedin className="text-gray-600 cursor-pointer text-base sm:text-lg" />
                    </div>

                    <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-xl">
                        Pooja Sharma is the Co-Founder of eJob Ocean. She is an alum of EDII Ahmedabad,
                        a leading center for Business Entrepreneurship in India. She has keen interest in
                        subjects like <span className="text-[#339ca0]">Business & Technology, Digital Marketing</span>,
                        <span className="text-[#339ca0]"> Stock Market Investing</span>.
                    </p>

                    <div>
                        <p className="text-sm sm:text-base font-semibold mb-1">Worked With</p>
                        <img src="" alt="eJob Ocean" className="h-5 sm:h-6" />
                    </div>
                </div>
            </div>

            {/* Slider Arrows */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
                <FaArrowLeft className="text-base sm:text-lg cursor-pointer text-gray-600 hover:text-orange-500" />
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <FaArrowRight className="text-base sm:text-lg cursor-pointer text-gray-600 hover:text-orange-500" />
            </div>

            {/* Register Button */}
            <div className="mt-8 sm:mt-10">
                <button onClick={()=> setCartShow(true)} className="bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-md transition">
                    Register Now @ ₹1999/- <span className="line-through ml-2 text-xs sm:text-sm text-white">₹10000</span> →
                </button>
            </div>
            {cartShow && <CartView onClose={()=> setCartShow(false)} />}

        </section>
    );
}
