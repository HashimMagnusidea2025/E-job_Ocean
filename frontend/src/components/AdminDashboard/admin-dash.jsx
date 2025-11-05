import React, { useEffect, useState } from "react";
import Layout from "../seekerDashboard/partials/layout";
import { FaCalendarAlt, FaUser, FaUsers } from "react-icons/fa";
import axios from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";

export default function AdminDash() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        webinarCount: 0,
        webinarRegistrationCount: 0,
        SessionRegistrationCount: 0,
        speakerCount: 0,
        caFresherCount: 0,
    });

    // Fetch all counts
    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const [webinarsRes, speakersRes, caFresherRes, webinarRegisterRes, sessionRegiserRes] = await Promise.all([
                axios.get("/webinars"),
                axios.get("/speakers"),
                axios.get('/CA-Fresher'),
                axios.get('/registrations/webinar'),
                axios.get('/registrations/one-to-one')

            ]);
            console.log(caFresherRes);

            setStats({
                webinarCount: webinarsRes.data.length,
                webinarRegistrationCount: webinarRegisterRes.data.length, // You can replace this with API later
                SessionRegistrationCount: sessionRegiserRes.data.length,
                speakerCount: speakersRes.data.length,
                caFresherCount: caFresherRes.data.data.length, // same here (placeholder)
            });


        } catch (err) {
            console.error("Error fetching counts:", err);
        }
    };

    const cards = [
        {
            label: "Webinar",
            value: stats.webinarCount,
            icon: <FaCalendarAlt className="text-blue-400 text-3xl" />,
            bgColor: "bg-blue-100",
            onClick: () => navigate("/admin-dashboard/add-webinar"), // 👈 navigate on click
        },
        {
            label: "Webinar Registration",
            value: stats.webinarRegistrationCount,
            icon: <FaUser className="text-green-400 text-3xl" />,
            bgColor: "bg-green-100",
            onClick: () => navigate("/admin-dashboard/webinar-registration-list"), // 👈 navigate on click


        },
        {
            label: "Session Registration",
            value: stats.SessionRegistrationCount,
            icon: <FaUser className="text-yellow-400 text-3xl" />,
            bgColor: "bg-yellow-100",
            onClick: () => navigate("/admin-dashboard/one-to-one-registration-list"), // 👈 navigate on click


        },
        {
            label: "Speakers",
            value: stats.speakerCount,
            icon: <FaUsers className="text-orange-400 text-3xl" />,
            bgColor: "bg-orange-100",
            onClick: () => navigate("/admin-dashboard/add-speakers"), // 👈 navigate on click
        },
        {
            label: "CA Freshers",
            value: stats.caFresherCount,
            icon: <FaUsers className="text-red-500 text-3xl" />,
            bgColor: "bg-red-100",
            onClick: () => navigate("/admin-dashboard/ca-fresher-list"), // 👈 navigate on click
        },
    ];

    return (
        <Layout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        <span
                            onClick={() => navigate("/")}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Home
                        </span>{" "}
                        / Dashboard
                    </p>

                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {cards.map((item, index) => (
                        <div
                            key={index}
                            onClick={item.onClick}
                            className={` flex flex-col gap-2 bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                        >
                            <p className="text-gray-600 font-bold text-[16px]">
                                {item.label} | All
                            </p>

                            <div className="text-right flex items-center gap-4">
                                <div className={`p-3 rounded-full ${item.bgColor}`}>
                                    {item.icon}
                                </div>
                                <p className="text-2xl font-bold text-blue-700">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="text-center text-sm text-gray-600 border-t pt-4 mt-8">
                    <p>
                        © Copyright <b>@2025</b>. All Rights Reserved
                    </p>
                    <p>
                        Designed by{" "}
                        <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                            Magnus Ideas Pvt. Ltd.
                        </span>
                    </p>
                </footer>
            </div>
        </Layout>
    );
}
