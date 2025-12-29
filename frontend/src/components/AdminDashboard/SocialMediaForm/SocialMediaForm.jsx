import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios.js"; // axios instance with baseURL
import Layout from '../../seekerDashboard/partials/layout.jsx'
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
export default function SocialMediaForm() {
    const [icons, setIcons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIcon, setEditingIcon] = useState(null);
    const [formData, setFormData] = useState({ name: '', link: '', status: 'active' });

    useEffect(() => {
        fetchIcons();
    }, []);

    const fetchIcons = async () => {
        try {
            const res = await axios.get('/social-media-icons');
            setIcons(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingIcon) {
                await axios.put(`/social-media-icons/${editingIcon._id}`, formData);
                alert('Updated successfully');
            } else {
                await axios.post('/social-media-icons', formData);
                alert('Created successfully');
            }
            setIsModalOpen(false);
            setEditingIcon(null);
            setFormData({ name: '', link: '', status: 'active' });
            fetchIcons();
        } catch (err) {
            console.error(err);
            alert('Error saving icon');
        }
    };

    const openModal = (icon = null) => {
        if (icon) {
            setEditingIcon(icon);
            setFormData({ name: icon.name, link: icon.link, status: icon.status });
        } else {
            setEditingIcon(null);
            setFormData({ name: '', link: '', status: 'active' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIcon(null);
        setFormData({ name: '', link: '', status: 'active' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this icon?')) {
            try {
                await axios.delete(`/social-media-icons/${id}`);
                alert('Deleted successfully');
                fetchIcons();
            } catch (err) {
                console.error(err);
                alert('Error deleting icon');
            }
        }
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6">Social Media Icons</h2>

                <button
                    onClick={() => openModal()}
                    className="bg-[#339ca0] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#2b8588] transition-all mb-6"
                >
                    Add New Icon
                </button>

                {icons.length > 0 ? (
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Link</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {icons.map((icon) => (
                                <tr key={icon._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{icon.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <a href={icon.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {icon.link}
                                        </a>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className={`px-2 py-1 rounded ${icon.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {icon.status}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 flex px-4 py-2">
                                        <button
                                            onClick={() => openModal(icon)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                        >
                                           <FaEdit/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(icon._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No social media icons added yet.</p>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold mb-4">{editingIcon ? 'Edit Icon' : 'Add New Icon'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Facebook"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Link</label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#339ca0]"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className="bg-[#339ca0] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#2b8588] transition-all"
                                    >
                                        {editingIcon ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
