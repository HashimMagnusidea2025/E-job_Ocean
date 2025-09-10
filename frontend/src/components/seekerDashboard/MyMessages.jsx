import { FaPaperPlane } from "react-icons/fa";
import caarchitaggarwal from '../../media/png/ca-archit-aggarwal.png';
import Layout from "./partials/layout";
export default function MyMessages() {
    const messages = [
        { sender: "other", text: "iikii", time: "1 week ago" },
        { sender: "you", text: "heelo", time: "1 week ago" },
        { sender: "you", text: "no", time: "1 week ago" },
        { sender: "other", text: "Hello", time: "6 days ago" },
        { sender: "other", text: "Hello", time: "6 days ago" },
    ];

    return (
  
            <div className="w-full h-[600px] p-4 mx-auto flex shadow border rounded-md overflow-hidden">


                <div className="w-1/4 bg-gray-100 border-r">
                    <div className="p-4 border-b font-semibold text-lg">Seeker Messages</div>
                    <div className="flex items-center justify-between px-4 py-3 hover:bg-white cursor-pointer">
                        <div className="flex items-center gap-2">
                            <img
                                src={caarchitaggarwal}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border"
                            />
                            <span>Multimedia Design</span>
                        </div>

                        <span className="text-blue-600 font-medium text-sm">0</span>

                    </div>
                </div>


                <div className="w-3/4 bg-gray-50 flex flex-col justify-between" style={{ backgroundImage: "url(https://www.transparenttextures.com/patterns/cubes.png)" }}>

                    <div className="p-4 space-y-4 overflow-y-auto h-full">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === "other" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-xs ${msg.sender === "other" ? "bg-blue-600 text-white" : "bg-white text-gray-800"} px-4 py-2 rounded-lg shadow relative`}>
                                    <p>{msg.text}</p>
                                    <span className="text-[10px] absolute bottom-[-16px] right-1 text-gray-500">{msg.time}</span>
                                </div>
                                {msg.sender === "other" && (
                                    <img
                                        src={caarchitaggarwal}
                                        alt="You"
                                        className="w-8 h-8 rounded-full ml-2 self-end"
                                    />
                                )}
                                {msg.sender === "you" && (
                                    <img
                                        src={caarchitaggarwal}
                                        alt="Other"
                                        className="w-8 h-8 rounded-full mr-2 self-end"
                                    />
                                )}
                            </div>
                        ))}
                    </div>


                    <div className="bg-white border-t p-3">
                        <div className="flex items-center bg-gray-100 rounded-md px-3">
                            <input
                                type="text"
                                placeholder="Type Your Message here.."
                                className="flex-1 p-2 bg-transparent outline-none text-sm"
                            />
                            <button className="text-white bg-blue-600 p-2 rounded-md hover:bg-blue-700">
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
       
    );
}
