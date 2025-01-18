const Student = require('./model');

class StudentRepository {
    async create(data) {
        return await Student.create(data);
    }

    async findById(id) {
        return await Student.findById(id)
            .populate('schoolId', 'name')
            .populate('classroomId', 'name grade section');
    }

    async findAll(query = {}) {
        return await Student.find(query)
            .populate('schoolId', 'name')
            .populate('classroomId', 'name grade section');
    }

    async findBySchool(schoolId) {
        return await Student.find({ schoolId })
            .populate('schoolId', 'name')
            .populate('classroomId', 'name grade section');
    }

    async findByClassroom(classroomId) {
        return await Student.find({ classroomId })
            .populate('schoolId', 'name')
            .populate('classroomId', 'name grade section');
    }

    async update(id, data) {
        return await Student.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        )
        .populate('schoolId', 'name')
        .populate('classroomId', 'name grade section');
    }

    async delete(id) {
        return await Student.findByIdAndDelete(id);
    }

    async generateAdmissionNumber(schoolId) {
        const currentYear = new Date().getFullYear();
        const lastStudent = await Student.findOne({ schoolId })
            .sort({ admissionNumber: -1 })
            .limit(1);

        if (!lastStudent) {
            return `${currentYear}0001`;
        }

        const lastNumber = parseInt(lastStudent.admissionNumber.slice(-4));
        return `${currentYear}${String(lastNumber + 1).padStart(4, '0')}`;
    }
}

module.exports = new StudentRepository();
