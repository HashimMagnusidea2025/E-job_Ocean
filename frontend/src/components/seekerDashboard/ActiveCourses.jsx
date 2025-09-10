// pages/ActiveCourses.jsx
import React from "react";
import { ActiveCoursesCard } from "../cards/cards";
import webinars1 from '../../media/png/webinars1.png'
export default function ActiveCourses() {
  const courses = [
    {
      id: 1,
      title: "Thinking Bridge Placement Program",
      team: "Thinking Bridge Team",
      image: webinars1,
      tag: "FREE",
      date: "July 28, 2025",
      isUpcoming: false,
    },
    {
      id: 2,
      title: "Decide Your Domain [Demo Sessions of Every Finance Field]",
      team: "Thinking Bridge Team",
      image: webinars1,
      date: "August 5, 2025",
      isUpcoming: true,
    },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Active Courses</h2>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Search for a chapter, course or package"
          className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <ActiveCoursesCard
            key={course.id}
            image={course.image}
            tag={course.tag}
            title={course.title}
            date={course.date}
            isUpcoming={course.isUpcoming}
          />
        ))}
      </div>
    </div>
  );
}
