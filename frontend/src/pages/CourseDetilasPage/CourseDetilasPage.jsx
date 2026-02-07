import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import Swal from "sweetalert2";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [similarCourses, setSimilarCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState("");
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    pinCode: "",
    country: "",
    state: "",
    city: "",

  });

  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchCourse();
    fetchSimilarCourses();
  }, [id]);

  useEffect(() => {
    axios.get("/country").then((res) => setCountries(res.data.country));
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        pinCode: "",
        country: "",
        state: "",
        city: "",

      });
      setErrors({});
      setPostOffices([]);
      setSelectedPostOffice("");
    }
  }, [isModalOpen]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/courses/${id}`);
      console.log(res.data);

      if (res.data.success) {
        setCourse(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCourses = async () => {
    try {
      const res = await axios.get("/courses");
      if (res.data.success) {
        setSimilarCourses(
          res.data.data.filter((c) => c._id !== id).slice(0, 4)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookNow = () => setIsModalOpen(true);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "mobile") {
      // Only digits and max 10
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData({ ...formData, [id]: value });
      }
    } else if (id === "pinCode") {
      // PIN code change - only numbers and max 6 digits
      const pinValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, [id]: pinValue });

      // Auto-fetch when 6 digits entered
      if (pinValue.length === 6) {
        fetchPostOfficeByPincode(pinValue);
      } else {
        // Reset if PIN code is incomplete
        setPostOffices([]);
        setSelectedPostOffice("");
        setFormData(prev => ({
          ...prev,
          state: "",
          city: ""
        }));
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }

    // Clear error when typing
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Fetch post office data by pincode
  const fetchPostOfficeByPincode = async (pincode) => {
    setLoadingPincode(true);
    try {
      const response = await axios.get(`/post-offices/pincode/${pincode}`);

      if (response.data && response.data.length > 0) {
        const offices = response.data;
        setPostOffices(offices);

        // Auto-fill state and city from the first post office
        const firstOffice = offices[0];
        setFormData(prev => ({
          ...prev,
          state: firstOffice.statename,
          city: firstOffice.RelatedSuboffice || firstOffice.Districtname
        }));

        // Auto-set country as India
        // const india = countries.find(country =>
        //     country.name.toLowerCase().includes("india")
        // );
        // if (india) {
        //     setFormData(prev => ({ ...prev, country: india.id }));
        // }
      }
    } catch (error) {
      console.error("Error fetching post office data:", error);

      Swal.fire({
        icon: "error",
        title: "PIN Code Not Found",
        text: "Please enter a valid 6-digit PIN code",
        timer: 3000,
        showConfirmButton: false
      });

      setPostOffices([]);
      setSelectedPostOffice("");
      setFormData(prev => ({
        ...prev,
        state: "",
        city: ""
      }));
    } finally {
      setLoadingPincode(false);
    }
  };

  // Handle post office selection
  const handlePostOfficeChange = (e) => {
    const officeName = e.target.value;
    setSelectedPostOffice(officeName);

    // If user selects a specific post office, update city accordingly
    if (officeName) {
      const selectedOffice = postOffices.find(office => office.officename === officeName);
      if (selectedOffice) {
        setFormData(prev => ({
          ...prev,
          city: selectedOffice.RelatedSuboffice || selectedOffice.Districtname
        }));
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN Code is required";
    } else if (formData.pinCode.length !== 6) {
      newErrors.pinCode = "PIN Code must be 6 digits";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true); // 🟢 Start loader
    try {
      // Use correct course ID
      const courseId = id;

      console.log("Submitting registration for course:", {
        courseId,
        formData
      });

      const { data } = await axios.post(`/course-register/`, {
        ...formData,
        courseId: courseId,
        type: "course",
        selectedPostOffice: selectedPostOffice || (postOffices[0]?.officename || "")
      });

      const paymentType = (course.paymentType || "").toLowerCase();

      if (paymentType === "free") {
        await Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: `You have successfully registered for the course. Confirmation email has been sent to your email.`,
          confirmButtonColor: "#2563eb",
        });
        // Reset form and close modal
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          pinCode: "",
          country: "",
          state: "",
          city: "",

        });
        setErrors({});
        setIsModalOpen(false);
      } else if (paymentType === "paid") {
        console.log("Form email before navigate:", formData.email);
        if (!formData.email) {
          Swal.fire({
            icon: "error",
            title: "Email missing",
            text: "Please enter your email before proceeding to payment.",
          });
          return;
        }

        navigate(`/course-receipt/${courseId}?registrationId=${data.Registration._id}&email=${formData.email}&type=${data.Registration.type}`);

        // Optional: reset form here too
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          pinCode: "",
          country: "",
          state: "",
          city: "",

        });
        setErrors({});
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
    finally {
      setSubmitting(false); //  Stop loader
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-600">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white">
      {/* Hero Banner Section */}
      <div className="relative bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 lg:py-18">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm mb-8">
              <Link to="/" className="hover:text-blue-200 transition">Home</Link>


              <span className="text-blue-300">/</span>
              <span className="text-blue-200">{course.courseTitle}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Course Info */}
              <div className="space-y-8">
                {/* Course Title */}
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  {course.courseTitle}
                </h1>


                {course.courseDescription && (
                  <p className="text-xl text-blue-100 leading-relaxed">
                    {course.courseDescription}
                  </p>
                )}



                {/* Course Stats */}
                <div className="flex flex-wrap gap-8 pt-4">
                  {course.duration && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-200">Duration</p>
                        <p className="font-semibold">{course.duration}</p>
                      </div>
                    </div>
                  )}

                  {course.level && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-200">Level</p>
                        <p className="font-semibold">{course.level}</p>
                      </div>
                    </div>
                  )}

                  {course?.category?.CourseCategory && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-200">Category</p>
                        <p className="font-semibold">{course?.category?.CourseCategory}</p>
                      </div>
                    </div>
                  )}
                  {course.mode && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-200">Mode</p>
                        <p className="font-semibold">{course.mode}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-6 lg:px-20">
                  <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-4 flex flex-col gap-6">

                    {/* PRICE */}
                    <div className="text-center">
                      <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                        Course Fee
                      </p>

                      <div className="flex justify-center items-end gap-1">
                        {course.paymentType === "free" ? (
                          <span className="text-4xl font-extrabold text-green-600">
                            Free
                          </span>
                        ) : (
                          <>
                            <span className="text-xl font-semibold text-gray-500">₹</span>
                            <span className="text-2xl font-extrabold text-gray-900">
                              {course.fees}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <button onClick={handleBookNow} className="w-full py-3 rounded-xl font-semibold text-base text-white
                    bg-gradient-to-r from-blue-600 to-indigo-600
                   hover:from-blue-700 hover:to-indigo-700
                    transition-all duration-300
                    shadow-md hover:shadow-lg active:scale-[0.98]">
                      Book Now
                    </button>

                  </div>
                </div>

              </div>


              <div className="space-y-8">
                {/* Course Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={`${baseURL}/${course.image}`}
                    alt={course.courseTitle}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {course.courseFile && (
                  <div
                    className="
                   bg-white border border-gray-200 rounded-2xl p-6
                     flex items-center justify-between
                    shadow-sm
                    transition-shadow duration-300
                    hover:shadow-lg
                    animate-float
                    "
                  >

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center text-xl">
                        📄
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          Course Brochure
                        </p>
                        <p className="text-sm text-gray-500">
                          Detailed syllabus & structure
                        </p>
                      </div>
                    </div>


                    <a
                      href={`${baseURL}/${course.courseFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                      px-5 py-2.5 text-sm font-semibold text-white rounded-lg
                      bg-gradient-to-r from-blue-600 to-indigo-600
                    hover:from-blue-700 hover:to-indigo-700
                      transition
                      "
                    >
                      View PDF
                    </a>

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Enrollment CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with this course
          </p>
          <button onClick={handleBookNow} className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl">
            Book Now - {course.paymentType === "free" ? "Free Access" : `₹${course.fees}`}
          </button>

        </div>

        {/* Similar Courses */}
        {similarCourses.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Explore Related Courses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCourses.map((item) => (
                <Link
                  to={`/course-details/${item._id}`}
                  key={item._id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`${baseURL}/${item.image}`}
                      alt={item.courseTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      {item.level && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
                          {item.level}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {item.courseTitle}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.courseDescription}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {item.paymentType === "free" ? "Free" : `₹${item.fees}`}
                      </span>
                      <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* <div className="text-center mt-8">
              <Link
                to="/courses"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
              >
                View All Courses
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div> */}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative animate-fadeIn">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Register for Course
              </h2>

              {course && (
                <div className="text-center mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Course:</span>{" "}
                    <b>{course.courseTitle}</b>
                  </p>
                  {course.paymentType && (
                    <p className={`text-sm font-bold mt-1 ${course.paymentType === 'Free' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                      {course.paymentType} Course
                    </p>
                  )}
                  {course.fees && (
                    <p className='text-sm font-bold mt-1'
                    >
                      Fees : ₹ {course.fees}
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>

                {/* Email */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.mobile ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>


                {/* Country (Auto-set to India from PIN code) */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: Number(e.target.value) })}
                    className={`w-full border rounded-lg px-3 py-2 ${errors.country ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    <option value="">-- Select Country --</option>
                    {countries.map((country) => (
                      <option key={country._id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                {/* PIN Code with loading */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${errors.pinCode ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                      placeholder="Enter 6-digit PIN Code"
                      maxLength={6}
                    />
                    {loadingPincode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                </div>



                {/* State (Auto-filled from PIN Code) */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    readOnly
                    className={`w-full border rounded-lg px-3 py-2 bg-gray-50 ${errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="State will auto-fill from PIN Code"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                {/* City (Auto-filled from PIN Code) */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    readOnly
                    className={`w-full border rounded-lg px-3 py-2 bg-gray-50 ${errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="City will auto-fill from PIN Code"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>



                {/* Submit Button */}
                <div className="col-span-1 md:col-span-2 mt-4 flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 justify-center"
                    disabled={loadingPincode || submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Registering...</span>
                      </>
                    ) : loadingPincode ? (
                      "Loading Location..."
                    ) : (
                      `Register for Course`
                    )}
                  </button>

                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}