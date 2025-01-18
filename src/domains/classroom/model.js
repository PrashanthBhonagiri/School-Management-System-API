const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    grade: {
        type: String,
        required: true,
        trim: true
    },
    section: {
        type: String,
        required: true,
        trim: true
    },
    teacher: {
        name: String,
        email: String,
        phone: String
    },
    resources: [{
        type: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

classroomSchema.index({ schoolId: 1, grade: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Classroom', classroomSchema);
