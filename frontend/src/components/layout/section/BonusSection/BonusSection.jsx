import React from 'react';
import image1 from '../../../../media/png/bonus-1.png';




const bonuses = [
    {
        title: '5 free Technical sessions',
        worth: '₹3000',
        img: image1,
    },
    {
        title: 'Live communication skills training',
        worth: '₹3000',
        img: image1,
    },
    {
        title: 'Mentorship from industry experts',
        worth: '₹4000',
        img: image1,
    },
    {
        title: 'Lifetime Free Placement Assistance',
        worth: '₹5000',
        img: image1,
    },
];

export default function BonusSection() {
    return (
        <section className="container mx-auto py-28 w-full font-[Poppins] " >
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10">
                Unlock Bonuses worth <span className="text-[#339ca0] font-bold">₹15,000</span> with our Program
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
                {bonuses.map((bonus, index) => (
                    <div
                        key={index}
                        className="group hover:bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] rounded-xl shadow-lg p-6 relative flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300"
                    >
                        {/* FREE Badge */}
                        <div className="absolute -top-4 -left-4 rotate-[-10deg] bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black text-white font-bold text-sm px-3 py-1 rounded shadow-md z-10">
                            FREE
                        </div>

                        {/* Image */}
                        <img src={bonus.img} alt={bonus.title} className="w-24 h-24 object-contain mb-4" />

                        {/* Title */}
                        <h3 className="text-2xl font-semibold text-black group-hover:text-white">
                            {bonus.title}
                        </h3>

                        {/* Worth */}
                        <p className="text-sm font-bold text-black mt-2 group-hover:text-white">
                            <span className="font-bold group-hover:text-white">worth</span> {bonus.worth}
                        </p>
                    </div>
                ))}
            </div>

        </section>
    );
}
