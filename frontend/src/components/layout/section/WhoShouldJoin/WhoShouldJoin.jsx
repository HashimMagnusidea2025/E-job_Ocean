import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import whoimgdesk from "../../../../media/png/who-img-desk.png"; // replace with your image path
import { useState } from "react";
import { CartView } from "../../../cards/cards";
export default function WhoShouldJoin() {

    const [showCart, setShowCart]= useState(false);


    return (
        <div className=" mx-auto px-4 py-12">
            <h2 className="text-[44px] font-semibold text-center">Who should</h2>
            <h3 className="text-[44px] font-semibold text-center text-[#339ca0] mb-8">Join:</h3>

            <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center px-8 py-16 max-w-5xl mx-auto">
                <ul className="space-y-4 text-sm md:text-base text-gray-800 list-none">
                    <li className="flex items-start font-semibold">
                        <FaCheckCircle className="text-[#339ca0] mr-3 mt-1 border border-black rounded-full p-[2px]" size={22} />
                        Chartered Accountants
                    </li>
                    <li className="flex items-start font-semibold">
                        <FaCheckCircle className="text-[#339ca0] mr-3 mt-1 border border-black rounded-full p-[2px]" size={22} />
                        Commerce Graduates
                    </li>
                    <li className="flex items-start font-semibold">
                        <FaCheckCircle className="text-[#339ca0] mr-3 mt-1 border border-black rounded-full p-[2px]" size={22} />
                        CA Aspirants & Semi Qualified CAs
                    </li>
                    <li className="flex items-start font-semibold">
                        <FaCheckCircle className="text-[#339ca0] mr-3 mt-1 border border-black rounded-full p-[2px]" size={22} />
                        ACCA Aspirants & ACCA Professionals
                    </li>
                    <li className="flex items-start font-semibold">
                        <FaCheckCircle className="text-[#339ca0] mr-3 mt-1 border border-black rounded-full p-[2px]" size={22} />
                        CMA Aspirants Who Want to Start Career in Big 4
                    </li>
                    <li className="flex items-start font-semibold">
                        <FaCheckCircle className="text-[#339ca0] mr-3 mt-1 border border-black rounded-full p-[2px]" size={22} />
                        Any person looking to start a career in Big 4
                    </li>
                </ul>

                <img
                    src={whoimgdesk}
                    alt="students"
                    className="w-[370px] rounded-lg mt-8 md:mt-0 md:ml-8"
                />
            </div>

            <div className="text-center mt-8">
                <button onClick={()=> setShowCart(true)} className="mt-6 bg-black text-white px-6 py-3 rounded-full text-md transition">
                    Register Now @ ₹1999/-
                    <span className="line-through ml-2 text-sm text-white">₹10000</span> →
                </button>
            </div>
            {showCart && <CartView onClose={()=>setShowCart(false)}/>}
        </div>
    );
}
