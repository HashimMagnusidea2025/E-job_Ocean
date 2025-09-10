import React, { useEffect } from 'react';
import applyImage from '../../../../media/jpg/sss1.jpg';
import { FaRegCheckCircle } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';

const WhoCanApply = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 200,
        });
    }, []);

    return (
        <div className=" py-10 px-4 md:px-10">
            <div className="w-full  grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-lg overflow-hidden">

                {/* Left: Image with animation */}
                <div
                    className="w-full h-full"
                    data-aos="fade-right"
                    data-aos-delay="100"
                >
                    <img
                        src={applyImage}
                        alt="Finance Team"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right: Text with animation */}
                <div
                    className="flex flex-col justify-center p-8"
                    data-aos="fade-left"
                    data-aos-delay="400"
                >
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                        Who Can Apply
                    </h2>
                    <ul className="space-y-4 text-lg text-gray-700">
                        {[
                            'Qualified CA / CS / CMA / ACCA',
                            'CA/ACCA Aspirants',
                            'Commerce Graduates',
                            'UG / PG Students',
                            'Any Person Looking For A Job in Finance',
                        ].map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-yellow-500 mr-3 mt-1 p-1">
                                    <FaRegCheckCircle size={25} />
                                </span>
                                <span className="font-semibold">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default WhoCanApply;
