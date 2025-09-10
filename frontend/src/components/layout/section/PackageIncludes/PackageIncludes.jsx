import React from "react";

import kqYzMdirecttaxmasterclass from '../../../../media/png/kqYzMdirecttaxmasterclass.png'


const packages = [
  {
    title: "Stat Audit MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "Internal Audit MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "Direct Tax MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "GST MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "Transfer Pricing MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "FP&A and Data Modelling MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "Financial Modelling MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "Management Consulting",
    img: kqYzMdirecttaxmasterclass,
  },
  {
    title: "IND AS & IFRS MasterClass",
    img: kqYzMdirecttaxmasterclass,
  },
];

export default function PackageIncludes() {
  return (
    <div className="bg-white py-12 px-4 text-center">
      <h2 className="text-[47.2px] font-bold text-[#339ca0] mb-8">
        Package Includes
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-md overflow-hidden shadow-sm"
          >
            <img
              src={pkg.img}
              alt={pkg.title}
              className="w-full h-auto object-cover"
            />
            <div className="text-[18px] text-left px-3 py-2 font-semibold">
              {pkg.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
