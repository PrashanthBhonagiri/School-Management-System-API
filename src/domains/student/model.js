const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    admissionNumber: {
        type: String,
        required: true,
        unique: true
    },
    guardianInfo: {
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        contact: {
            phone: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        }
    },
    academicInfo: {
        grade: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true
        },
        rollNumber: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'transferred', 'graduated'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Compound index for unique roll number per class
studentSchema.index({ 
    schoolId: 1, 
    classroomId: 1, 
    'academicInfo.rollNumber': 1 
}, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
