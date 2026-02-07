import {
  FaBookOpen,
  FaTools,
  FaChalkboardTeacher,
  FaBriefcase,
} from "react-icons/fa";
import Resumeamico from "../../../../media/png/Resume-amico.svg";
import { motion } from "framer-motion";
export default function WhoWeAre() {
  return (
    <section className="relative bg-[#0f0f0f] text-white py-8 px-4 font-[Poppins] overflow-hidden">

      {/* BACKGROUND EFFECT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#339ca0]/20 rounded-full blur-3xl"></div>

      <div className="max-w-[1300px] mx-auto relative z-10">

        {/* HEADING */}
        <div className="text-center ">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Who <span className="text-[#339ca0]">We Are</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            A modern finance learning platform focused on skills, mentorship,
            and real-world career outcomes.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

          {/* LEFT CARDS */}
          <div className="space-y-8">
            <FeatureCard
              icon={<FaBookOpen />}
              title="One-Stop Learning Platform For Finance"
              
            />
            <FeatureCard
              icon={<FaTools />}
              title="Hands-on Training for Practical Skills"
             
            />
          </div>

          {/* CENTER IMAGE */}
          <div className="flex justify-center">
            <img
              src={Resumeamico}
              alt="Resume Illustration"
              className="w-full max-w-sm drop-shadow-2xl"
            />
          </div>

          {/* RIGHT CARDS */}
          <div className="space-y-8">
            <FeatureCard
              icon={<FaChalkboardTeacher />}
              title="Mentorship from Industry Expert"
            
            />
            <FeatureCard
              icon={<FaBriefcase />}
              title="Placement in Leading Firms & MNCs"
              
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* FEATURE CARD COMPONENT */
// const FeatureCard = ({ icon, title, desc }) => {
//   return (
//     <div className="group bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-[#339ca0]/50 hover:-translate-y-1 transition-all duration-300 shadow-lg">
//       <div className="flex items-start gap-4">
//         <div className="text-[#339ca0] text-2xl mt-1">
//           {icon}
//         </div>
//         <div>
//           <h4 className="font-semibold text-lg mb-1">
//             {title}
//           </h4>
        
//         </div>
//       </div>
//     </div>
//   );
// };


const FeatureCard = ({ icon, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.06 }}
    transition={{ duration: 0.6 }}
    className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-lg"
  >
    <div className="flex items-center gap-4">
      <div className="text-[#339ca0] text-2xl">{icon}</div>
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
  </motion.div>
);