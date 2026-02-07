import React, { useState, useEffect } from "react";
import Layout from './partials/layout';
import axios from '../../utils/axios.js';
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function MyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndCourses = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    Swal.fire("Error", "Please login to view your courses", "error");
                    setLoading(false);
                    return;
                }

                // Fetch user details
                const userRes = await axios.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(userRes.data);

                // Fetch course registrations
                const registrationsRes = await axios.get(`/course-register`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Filter registrations for the current user by email
                const userRegistrations = registrationsRes.data.data.filter(
                    registration => registration.email === userRes.data.email
                );

                console.log("Filtered User Course Registrations:", userRegistrations);

                // Populate the course details for each registration
                const populatedRegistrations = userRegistrations.map(registration => ({
                    ...registration,
                    courseDetails: registration.courseId, // already populated
                    type: "course",
                }));


                console.log("Populated Course Registrations:", populatedRegistrations);
                setCourses(populatedRegistrations);

            } catch (err) {
                console.error("Error fetching course registrations:", err);
                Swal.fire("Error", "Failed to load your courses", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCourses();
    }, []);

    // Get course image
    const getCourseImage = (course) => {
        if (course.courseDetails?.image) {
            return `${baseURL}${course.courseDetails.image}`;
        }
        return null;
    };

    const getCourseTitle = (course) => {
        return course.courseDetails?.courseTitle || "Untitled Course";
    };


    // Get instructor name (assuming instructor field exists)
    // const getInstructorName = (course) => {
    //     if (course.type === "course" && course.courseDetails?.instructor) {
    //         return course.courseDetails.instructor.firstName + " " + course.courseDetails.instructor.lastName;
    //     }
    //     return "Instructor";
    // };

    const formatDate = (dateString) => {
        if (!dateString) return "Date not set";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Get registration status
    const getRegistrationStatus = (course) => {
        return "Registered";
    };

    const handleViewClick = (course) => {
        if (course.type === "course" && course.courseId?._id) {
            window.location.href = `/course-details/${course.courseId._id}`;
        }
    };


    if (loading) {
        return (
            <Layout>
                <div className="w-full bg-[#f6f8fd] p-6 sm:p-10 rounded shadow text-sm sm:text-base text-center">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-4">Loading your courses...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                    <p className="text-gray-600 mt-2">
                        {courses.length > 0
                            ? `You have registered for ${courses.length} course${courses.length > 1 ? 's' : ''}`
                            : "You haven't registered for any courses yet"
                        }
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Courses Yet</h3>
                        <p className="text-gray-500 mb-6">You haven't registered for any courses yet.</p>
                        <button
                            onClick={() => window.location.href = '/knowledge-base'}
                            className="bg-[#00b6bd] hover:bg-[#239da1] text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    courses.map((course, index) => (
                        <div key={course._id} className="w-full mx-auto bg-white shadow-sm border rounded-xl p-4 sm:p-6 md:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="flex-shrink-0">
                                    {/* {getCourseImage(course) ? (
                                        <img
                                            src={getCourseImage(course)}
                                            alt="Course Image"
                                            className="rounded-lg border w-full sm:w-[120px] h-[120px] object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const fallback = document.createElement('div');
                                                fallback.className = 'w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center';
                                                fallback.innerHTML = `<span class="text-blue-600 font-bold text-lg">${getInstructorName(course).charAt(0)}</span>`;
                                                e.target.parentNode.appendChild(fallback);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-[120px] h-[120px] bg-blue-100 rounded-lg border-2 border-white flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-lg">
                                                {getInstructorName(course).charAt(0)}
                                            </span>
                                        </div>
                                    )} */}
                                </div>

                                {/* Course Details */}
                                <div className="flex-1">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {getCourseTitle(course)}
                                    </h3>

                                    {/* <p className="text-sm text-gray-600 font-medium">
                                        {getInstructorName(course)}
                                    </p> */}

                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRegistrationStatus(course) === "Registered"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-blue-100 text-blue-800"
                                            }`}>
                                            {getRegistrationStatus(course)}
                                        </span>

                                        {/* {course.courseDetails?.category && (
                                            <span className="bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full text-xs">
                                                {course.courseDetails.category.categoryName}
                                            </span>
                                        )} */}
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Registered on:</span> {formatDate(course?.courseDetails?.createdAt)}
                                        </div>

                                        <div>
                                            <span className="font-medium">Email:</span> {course.email}
                                        </div>

                                        <div>
                                            <span className="font-medium">Mobile:</span> {course.mobile}
                                        </div>

                                        {course.courseDetails?.duration && (
                                            <div>
                                                <span className="font-medium">Duration:</span> {course.courseDetails.duration}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sm:self-start flex sm:flex-col gap-2">
                                <button
                                    onClick={() => handleViewClick(course)}
                                    className="w-full sm:w-auto border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-600 hover:text-white transition"
                                >
                                    VIEW COURSE
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
}