import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import Layout from '../../seekerDashboard/partials/layout';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    content: '',
    RegisterStartDate: '',
    RegisterEndDate: '',
    fees: '',
    skills: '',
    duration: '',
    instructor: '',
    prerequisites: '',
    category: '',
    level: '',
    mode: '',
    capacity: '',
    certification: false
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

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (isEditing) {
        res = await axios.put(`/courses/${selectedCourse._id}`, formData);
      } else {
        res = await axios.post('/courses', formData);
      }
      if (res.data.success) {
        if (isEditing) {
          setCourses(courses.map(course => course._id === selectedCourse._id ? res.data.data : course));
        } else {
          setCourses([res.data.data, ...courses]);
        }
        setShowModal(false);
        setIsEditing(false);
        setSelectedCourse(null);
        setFormData({
          courseTitle: '',
          courseDescription: '',
          content: '',
          RegisterStartDate: '',
          RegisterEndDate: '',
          fees: '',
          skills: '',
          duration: '',
          instructor: '',
          prerequisites: '',
          category: '',
          level: '',
          mode: '',
          capacity: '',
          certification: false
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} course`);
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const res = await axios.delete(`/courses/${courseId}`);
        if (res.data.success) {
          setCourses(courses.filter(course => course._id !== courseId));
        }
      } catch (err) {
        setError('Failed to delete course');
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

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Course
          </button>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Course List</h2>
            <p className="text-sm text-gray-600 mt-1">{courses.length} courses available</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map(course => {
                    const startDate = new Date(course.RegisterStartDate);
                    const endDate = new Date(course.RegisterEndDate);
                    const today = new Date();
                    const isActive = today >= startDate && today <= endDate;
                    
                    return (
                      <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.courseTitle}</div>
                            <div className="text-xs text-gray-500 mt-1">{course.category || 'Uncategorized'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">{course.courseDescription}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${course.fees ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {course.fees ? `$${course.fees}` : 'Free'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.duration || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{startDate.toLocaleDateString()}</div>
                            <div className="text-gray-500 text-xs">to {endDate.toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setSelectedCourse(course);
                              setFormData({
                                ...course,
                                RegisterStartDate: course.RegisterStartDate ? new Date(course.RegisterStartDate).toISOString().split('T')[0] : '',
                                RegisterEndDate: course.RegisterEndDate ? new Date(course.RegisterEndDate).toISOString().split('T')[0] : '',
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
                    <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Course' : 'Create New Course'}</h2>
                    <p className="text-gray-600 mt-1">{isEditing ? 'Update the course details below' : 'Fill in the course details below'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                      setSelectedCourse(null);
                      setFormData({
                        courseTitle: '',
                        courseDescription: '',
                        content: '',
                        RegisterStartDate: '',
                        RegisterEndDate: '',
                        fees: '',
                        skills: '',
                        duration: '',
                        instructor: '',
                        prerequisites: '',
                        category: '',
                        level: '',
                        mode: '',
                        capacity: '',
                        certification: false
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="p-8">
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

                      {/* Fees */}
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
                        <input
                          type="text"
                          name="instructor"
                          placeholder="e.g., Dr. John Smith"
                          value={formData.instructor}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>

                      {/* Category & Level */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <input
                            type="text"
                            name="category"
                            placeholder="e.g., Programming, Business"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
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
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
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
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skills
                        </label>
                        <input
                          type="text"
                          name="skills"
                          placeholder="e.g., JavaScript, React, Node.js"
                          value={formData.skills}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
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

                      {/* Certification */}
                      <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            name="certification"
                            checked={formData.certification}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Certification Available</span>
                            <p className="text-xs text-gray-500 mt-1">Students will receive a certificate upon completion</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-8 mt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setIsEditing(false);
                        setSelectedCourse(null);
                        setFormData({
                          courseTitle: '',
                          courseDescription: '',
                          content: '',
                          RegisterStartDate: '',
                          RegisterEndDate: '',
                          fees: '',
                          skills: '',
                          duration: '',
                          instructor: '',
                          prerequisites: '',
                          category: '',
                          level: '',
                          mode: '',
                          capacity: '',
                          certification: false
                        });
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
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
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}