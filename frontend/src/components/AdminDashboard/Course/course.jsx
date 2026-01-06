import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import Layout from '../../seekerDashboard/partials/layout';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";
import Select from "react-select";
import Swal from 'sweetalert2';
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState('');

  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    content: '',
    RegisterStartDate: '',
    RegisterEndDate: '',
    fees: '',
    paymentType: 'free',
    duration: '',
    instructor: '',
    prerequisites: '',
    category: '',
    level: '',
    mode: '',
    address: '',
    onlineLink: '',
    capacity: '',
    status: 'active',
    image: null,
    courseFile: null,
  });

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses');
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/course-category');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setCategories([]);
    }
  };

  // Fetch speakers
  const fetchSpeakers = async () => {
    try {
      const res = await axios.get('/speakers');
      setSpeakers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch speakers', err);
      setSpeakers([]);
    }
  };

  // Fetch skills
  

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchSpeakers();
    
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], //  file object
    });
  };
  const handleCourseFileChange = (e) => {
    setFormData({
      ...formData,
      courseFile: e.target.files[0],
    });
  };

  // Submit form
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     let res;
  //     if (isEditing) {
  //       res = await axios.put(`/courses/${selectedCourse._id}`, formData);
  //     } else {
  //       res = await axios.post('/courses', formData);
  //     }
  //     if (res.data.success) {
  //       if (isEditing) {
  //         setCourses(courses.map(course => course._id === selectedCourse._id ? res.data.data : course));
  //       } else {
  //         setCourses([res.data.data, ...courses]);
  //       }
  //       setShowModal(false);
  //       setIsEditing(false);
  //       setSelectedCourse(null);
  //       setFormData({
  //         courseTitle: '',
  //         courseDescription: '',
  //         content: '',
  //         RegisterStartDate: '',
  //         RegisterEndDate: '',
  //         fees: '',
      
  //         duration: '',
  //         instructor: '',
  //         prerequisites: '',
  //         category: '',
  //         level: '',
  //         mode: '',
  //         capacity: '',

  //         status: 'active'
  //       });
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} course`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === 'image' && formData.image) {
          payload.append('image', formData.image);
        } else if (key === 'courseFile' && formData.courseFile) {
          payload.append('courseFile', formData.courseFile);
        } else {
          payload.append(key, formData[key]);
        }
      });

      let res;
      if (isEditing) {
        res = await axios.put(`/courses/${selectedCourse._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axios.post('/courses', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data.success) {
        fetchCourses();
        setShowModal(false);
        setIsEditing(false);
        setSelectedCourse(null);

        // ✅ SWEET ALERT SUCCESS
        Swal.fire({
          icon: 'success',
          title: isEditing ? 'Course Updated 🎉' : 'Course Created 🎉',
          text: isEditing
            ? 'Course has been updated successfully'
            : 'Course has been created successfully',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Something went wrong';

      // ❌ SWEET ALERT ERROR
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: msg,
      });

      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  // Delete course
  // const handleDelete = async (courseId) => {
  //   if (window.confirm('Are you sure you want to delete this course?')) {
  //     try {
  //       const res = await axios.delete(`/courses/${courseId}`);
  //       if (res.data.success) {
  //         setCourses(courses.filter(course => course._id !== courseId));
  //       }
  //     } catch (err) {
  //       setError('Failed to delete course');
  //     }
  //   }
  // };
  const handleDelete = async (courseId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This course will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`/courses/${courseId}`);
        if (res.data.success) {
          setCourses(courses.filter(course => course._id !== courseId));

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Course has been deleted.',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to delete course',
        });
      }
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Course Management
            </h1>
            <p className="text-gray-600 mt-1">Create and manage all courses</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Filter courses..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Course
            </button>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Course List</h2>
            <p className="text-sm text-gray-600 mt-1">{courses.filter(course => course.courseTitle.toLowerCase().includes(filter.toLowerCase())).length} courses available</p>
          </div>

          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first course</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Create Course
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Category</th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.filter(course => course.courseTitle.toLowerCase().includes(filter.toLowerCase())).map(course => {
                    return (
                      <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.courseTitle}</div>


                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>


                            <div className="text-xs text-gray-500 mt-1">{course.category?.CourseCategory || 'Uncategorized'}</div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${course.paymentType === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {course.paymentType === 'Paid' ? `$${course.fees}` : 'Free'}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.duration || 'N/A'}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.instructor ? `${course.instructor.salutation || ''} ${course.instructor.firstName} ${course.instructor.lastName}`.trim() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{new Date(course.RegisterStartDate).toLocaleDateString()}</div>
                            <div className="text-gray-500 text-xs">to {new Date(course.RegisterEndDate).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {course.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                          <button
                            onClick={() => {
                              setIsViewing(true);
                              setSelectedCourse(course);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setSelectedCourse(course);
                              setFormData({
                                ...course,
                                paymentType: course.paymentType || 'free',
                                category: course.category?._id || course.category,
                                instructor: course.instructor?._id || course.instructor,
                                RegisterStartDate: course.RegisterStartDate ? new Date(course.RegisterStartDate).toISOString().split('T')[0] : '',
                                RegisterEndDate: course.RegisterEndDate ? new Date(course.RegisterEndDate).toISOString().split('T')[0] : '',
                                image: null,
                                courseFile: null,
                              });
                              setShowModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isViewing ? 'View Course' : isEditing ? 'Edit Course' : 'Create New Course'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {isViewing ? 'Course details' : isEditing ? 'Update the course details below' : 'Fill in the course details below'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIsViewing(false);
                      setIsEditing(false);
                      setSelectedCourse(null);
                      setFormData({
                        courseTitle: '',
                        courseDescription: '',
                        content: '',
                        RegisterStartDate: '',
                        RegisterEndDate: '',
                        fees: '',
                        paymentType: 'free',
                        duration: '',
                        instructor: '',
                        prerequisites: '',
                        category: '',
                        level: '',
                        mode: '',
                        address: '',
                        onlineLink: '',
                        capacity: '',

                        status: 'active',
                        image: null,
                        courseFile: null,
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="p-8">
                  {isViewing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Column 1 */}
                      <div className="space-y-5">
                        {/* Course Image */}
                        {selectedCourse?.image && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                            <img src={`${baseURL}/${selectedCourse.image}`} alt="Course Image" className="w-full h-48 object-cover rounded-lg border" />
                          </div>
                        )}
                        {selectedCourse?.courseFile && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course File</label>
                            <a href={`${baseURL}/${selectedCourse.courseFile}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Course File</a>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.courseTitle || 'N/A'}</p>
                        </div>

                        {/* Course Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg whitespace-pre-wrap">{selectedCourse?.courseDescription || 'N/A'}</p>
                        </div>

                        {/* Course Content */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Course Content</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg whitespace-pre-wrap">{selectedCourse?.content || 'N/A'}</p>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.RegisterStartDate ? new Date(selectedCourse.RegisterStartDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.RegisterEndDate ? new Date(selectedCourse.RegisterEndDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>

                        {/* Payment Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.paymentType || 'Free'}</p>
                        </div>

                        {/* Fees */}
                        {selectedCourse?.paymentType === 'Paid' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course Fees</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.fees ? `$${selectedCourse.fees}` : 'N/A'}</p>
                          </div>
                        )}
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-5">
                        {/* Duration */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.duration || 'N/A'}</p>
                        </div>

                        {/* Instructor */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                            {selectedCourse?.instructor ? `${selectedCourse.instructor.salutation || ''} ${selectedCourse.instructor.firstName} ${selectedCourse.instructor.lastName}`.trim() : 'N/A'}
                          </p>
                        </div>

                        {/* Category & Level */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.category?.CourseCategory || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.level || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Mode & Capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.mode || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.capacity || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Address or Online Link based on mode */}
                        {selectedCourse?.mode === 'Offline' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.address || 'N/A'}</p>
                          </div>
                        )}
                        {selectedCourse?.mode === 'Online' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Online Link</label>
                            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.onlineLink || 'N/A'}</p>
                          </div>
                        )}

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.status || 'N/A'}</p>
                        </div>


                        {/* Prerequisites */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{selectedCourse?.prerequisites || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center text-red-800">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-5">
                          {/* Course Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Course Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="courseTitle"
                              placeholder="e.g., Advanced JavaScript Programming"
                              value={formData.courseTitle}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          {/* Course Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Course Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="courseDescription"
                              placeholder="Brief description of the course"
                              value={formData.courseDescription}
                              onChange={handleChange}
                              required
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          {/* Course Content */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Course Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="content"
                              placeholder="Detailed course content and modules"
                              value={formData.content}
                              onChange={handleChange}
                              required
                              rows="4"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          {/* Date Range */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                name="RegisterStartDate"
                                value={formData.RegisterStartDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                name="RegisterEndDate"
                                value={formData.RegisterEndDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              />
                            </div>
                          </div>
                         
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mode
                            </label>
                            <select
                              name="mode"
                              value={formData.mode}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                              <option value="">Select Mode</option>
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>

                            </select>
                          </div>
                          {formData.mode === 'Offline' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                              </label>
                              <input
                                  type="text"
                                  name="address"
                                  placeholder="Enter address"
                                  value={formData.address}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                          )}
                          {formData.mode === 'Online' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Online Link
                              </label>
                              <input
                                  type="url"
                                  name="onlineLink"
                                  placeholder="Enter online link"
                                  value={formData.onlineLink}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                          )}
                          {/* Payment Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="paymentType"
                              value={formData.paymentType}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                              <option value="free">Free</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </div>

                          {/* Fees */}
                          {formData.paymentType === 'Paid' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Fees
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <input
                                  type="number"
                                  name="fees"
                                  placeholder="0.00"
                                  value={formData.fees}
                                  onChange={handleChange}
                                  min="0"
                                  step="0.01"
                                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                              </div>
                            </div>
                          )}
                          {/* Course Image */}


                        </div>

                        {/* Column 2 */}
                        <div className="space-y-5">
                          {/* Duration */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration
                            </label>
                            <input
                              type="text"
                              name="duration"
                              placeholder="e.g., 3 months, 8 weeks"
                              value={formData.duration}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          {/* Instructor */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Instructor Name
                            </label>
                            <select
                              name="instructor"
                              value={formData.instructor}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                              <option value="">Select Instructor</option>
                              {speakers.map(speaker => (
                                <option key={speaker._id} value={speaker._id}>
                                  {`${speaker.salutation || ''} ${speaker.firstName} ${speaker.lastName}`.trim()}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Category & Level */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                              </label>
                              <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                              >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.CourseCategory}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Level
                              </label>
                              <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                              >
                                <option value="">Select Level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                          </div>

                          {/* Mode & Capacity */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Capacity
                              </label>
                              <input
                                type="number"
                                name="capacity"
                                placeholder="Max students"
                                value={formData.capacity}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                              </label>
                              <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>


                          {/* Prerequisites */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Prerequisites
                            </label>
                            <input
                              type="text"
                              name="prerequisites"
                              placeholder="e.g., Basic programming knowledge"
                              value={formData.prerequisites}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Course Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Course File
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={handleCourseFileChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          {/* Form Actions */}
                          <div className="md:col-span-2">
                            <div className="flex justify-end gap-3 pt-8 mt-6 border-t border-gray-200">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowModal(false);
                                  setIsViewing(false);
                                  setIsEditing(false);
                                  setSelectedCourse(null);
                                  setFormData({
                                    courseTitle: '',
                                    courseDescription: '',
                                    content: '',
                                    RegisterStartDate: '',
                                    RegisterEndDate: '',
                                    fees: '',
                                    paymentType: 'free',
                                    duration: '',
                                    instructor: '',
                                    prerequisites: '',
                                    category: '',
                                    level: '',
                                    mode: '',
                                    address: '',
                                    onlineLink: '',
                                    capacity: '',

                                    status: 'active',
                                    image: null,
                                    courseFile: null,
                                  });
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                {isViewing ? 'Close' : 'Cancel'}
                              </button>
                              {!isViewing && (
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                  {loading ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                      </svg>
                                      {isEditing ? 'Updating...' : 'Creating...'}
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                      </svg>
                                      {isEditing ? 'Update Course' : 'Create Course'}
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}