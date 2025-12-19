

import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({

    courseTitle: {
        type: String,
        required: true,
        trim: true,
    },
    courseDescription: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    RegisterStartDate: {
        type: Date,
        required: true,
    },
    RegisterEndDate: {
        type: Date,
        required: true,
    },
    fees: {
        type: Number,
        min: 0,
    },
    skills: {
        type: String,
    },
    duration: {
        type: String,
    },
    instructor: {
        type: String,
    },
    prerequisites: {
        type: String,
    },
    category: {
        type: String,
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    mode: {
        type: String,
        enum: ['Online', 'Offline', 'Hybrid'],
    },
    capacity: {
        type: Number,
        min: 1,
    },
    certification: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }

}, { timestamps: true });

const CourseSchemaModel = mongoose.model('Course', CourseSchema);

export default CourseSchemaModel;