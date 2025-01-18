const Classroom = require('./model');

class ClassroomRepository {
    async create(data) {
        return await Classroom.create(data);
    }

    async findById(id) {
        return await Classroom.findById(id).populate('schoolId', 'name');
    }

    async findAll(query = {}) {
        return await Classroom.find(query).populate('schoolId', 'name');
    }

    async findBySchool(schoolId) {
        return await Classroom.find({ schoolId }).populate('schoolId', 'name');
    }

    async update(id, data) {
        return await Classroom.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).populate('schoolId', 'name');
    }

    async delete(id) {
        return await Classroom.findByIdAndDelete(id);
    }

    async findBySchoolAndGrade(schoolId, grade) {
        return await Classroom.find({ schoolId, grade }).populate('schoolId', 'name');
    }
}

module.exports = new ClassroomRepository();
