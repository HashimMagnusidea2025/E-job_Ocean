import React, { useState, useRef, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiMessageSquare, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function FloatingFAB() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const openWhatsApp = () => {
        window.open("https://chat.whatsapp.com/DDwHG9jRtyqAQrzWs5un7q", "_blank", "noopener,noreferrer");
    };
    const goToContact = () => {
        navigate("/contact");
        setOpen(false);
    };
    return (
        <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
            {/* options container */}
            <div className="flex flex-col items-end gap-3 mb-2">
                {/* WhatsApp option (icon circle + sliding label) */}
                <div className={`flex items-center gap-3 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"} transition-all duration-300`}>
                    <button
                        onClick={openWhatsApp}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transform transition-transform duration-150"
                        aria-label="Open WhatsApp community"
                    >
                        <FaWhatsapp className="w-6 h-6" />
                    </button>
                </div>
                {/* Contact option (icon circle + sliding label) */}
                <div className={`flex items-center gap-3 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"} transition-all duration-300`}>
                    <button
                        onClick={goToContact}
                        className="w-12 h-12 rounded-full bg-white text-[#006B6B] flex items-center justify-center shadow-lg border border-slate-200 hover:scale-105 transform transition-transform duration-150"
                        aria-label="Contact us"
                    >
                        <FiPhone className="w-6 h-6" />
                    </button>
                </div>
            </div>
            {/* main FAB */}
            <button
                onClick={() => setOpen((s) => !s)}
                className={`w-14 h-14 rounded-full bg-gradient-to-br from-[#008080] to-[#006B6B] text-white flex items-center justify-center shadow-2xl transform transition-all duration-300 ${open ? "scale-95" : "scale-100"}`}
                aria-expanded={open}
                aria-label="Open actions"
            >
                <FiMessageSquare className="w-6 h-6" />
            </button>
        </div>
    );
}