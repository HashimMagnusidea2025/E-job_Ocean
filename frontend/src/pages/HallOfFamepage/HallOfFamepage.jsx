import React from "react";
import { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import PranjalSrivastava from '../../media/jpg/PranjalSrivastava.jpeg';
import utkarshLogo from '../../media/jpg/utkarsh.jpeg';
import axios from '../../utils/axios.js'

import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { HallOfFameCards } from "../../components/ui/cards/cards";
export default function HallOfFamepage() {

    const [speakers, setSpeakers] = useState([]);

    useEffect(() => {
        const fetchActiveSpeakers = async () => {
            try {
                const { data } = await axios.get("/speakers/active");
                setSpeakers(data);
                console.log("Fetched Active Speakers:", data);
            } catch (err) {
                console.error("Error fetching active speakers:", err);
            }
        };
        fetchActiveSpeakers();
    }, []);


    return (
        <div className="container mx-auto font-[Poppins]">

            <div className=" px-4 py-10 ">
                <h1 className="text-4xl font-extrabold text-center">LIVE MENTORSHIP</h1>
                <div className="w-40 h-1 bg-black mx-auto my-2"></div>
                {/* <p className="text-center text-lg text-gray-600 mb-8">
                    Celebrating our students' achievements!
                </p> */}

                {/* Filters */}
                {/* <div className="flex flex-wrap gap-4 justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Company / Domain"
                        className="border px-4 py-2 rounded-md"
                    />
                    <select className="border px-4 py-2 rounded-md">
                        <option>Select Company</option>
                    </select>
                    <select className="border px-4 py-2 rounded-md">
                        <option>Select Domain</option>
                    </select>
                    <button className="bg-black text-white px-4 py-2 rounded-md">Filter</button>
                    <button className="bg-black text-white px-4 py-2 rounded-md">Reset</button>
                </div> */}

                {/* Cards */}
                <div className="flex flex-wrap justify-center gap-9 mt-10">
                    {speakers.length > 0 ? (
                        speakers.map((speaker, index) => (
                            <HallOfFameCards key={index} speaker={speaker} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">
                            No active speakers found
                        </p>
                    )}
                </div>

            </div>

        </div>
    );
}
