import React, { useState } from 'react';
import applyImage from '../../../../media/jpg/sss1.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import FAQ from '../../../../media/png/FAQ.avif';


const faqs = [
  {
    question: 'WHAT IS THE COST OF JOINING THIS PLACEMENT PROGRAM?',
    answer: 'The cost details will be shared upon inquiry or during the application process.',
  },
  {
    question: 'WHO CAN JOIN THIS PLACEMENT PROGRAM?',
    answer: 'Anyone from finance or commerce background such as CA, CS, CMA, ACCA aspirants or graduates.',
  },
  {
    question: 'HOW TO APPLY FOR THE VACANCY?',
    answer: 'You can apply through our official portal or contact our support team for the process.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 200,
      once: true,
    });
  }, []);

  return (
    <div className="bg-white py-12 px-4 md:px-16 font-[Poppins]">

      <div className="flex justify-center items-center text-center " data-aos="fade-up" data-aos-delay="900">
        <h2 className="text-[#339ca0] text-[2.8rem]">
          Join Our WhatsApp Community for Jobs/Articleship Updates & Important Resources
        </h2>
      </div>

      <div className='pt-4' data-aos="fade-up" data-aos-delay="1000">
        <p className='text-[15px]'>
          Get Updates for: Latest Job/Articleship opportunities in Big 4s & Top Firms, Important Resources for Interview Preparation, Updates from the Finance World
        </p>
      </div>

      <div className='flex justify-center items-center text-center pt-10' data-aos="fade-up" data-aos-delay="1100">
        <button onClick={() =>
          window.open(
            "https://chat.whatsapp.com/DDwHG9jRtyqAQrzWs5un7q",
            "_blank"
          )
        } className='text-[24px] font-semibold bg-gradient-to-r from-[#339ca0] to-black text-white py-2 px-8 rounded-md'>
          JOIN WHATSAPP COMMUNITY
        </button>
      </div>
    </div>
  );
};


export default FAQSection;
