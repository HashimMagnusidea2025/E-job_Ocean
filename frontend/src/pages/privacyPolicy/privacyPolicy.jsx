import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { ReactShareButton } from '../../components/ui/cards/cards.jsx';
export default function PrivacyPolicy() {
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    const fetchPrivacyPolicyContent = async () => {
      try {
        const { data } = await axios.get("/cms-content"); // get all content
        const homeData = data.find(
          (item) => item.page?.name === "Privacy-Policy"
        );
        setCmsContent(homeData);
      } catch (error) {
        console.error("Error fetching CMS content:", error);
      }
    };
    fetchPrivacyPolicyContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div>
        <ReactShareButton facebook twitter pinterest email whatsapp telegram />
      </div>
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 border-b pb-3">
          Privacy Policy
        </h1>

        <div
          className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: cmsContent?.line_1 || "<p>Loading content...</p>",
          }}
        ></div>

        <div><ReactShareButton
          facebook
          twitter
          pinterest
          email
          linkedin
          desktopClass="hidden lg:flex flex gap-2 rounded-md" /></div>

      </div>




    </div>
  );
}
