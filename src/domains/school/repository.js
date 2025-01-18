const School = require('./model');

class SchoolRepository {
    async create(data) {
        return await School.create(data);
    }

    async findById(id) {
        return await School.findById(id).populate('adminIds', 'email role');
    }

    async findAll(query = {}) {
        return await School.find(query).populate('adminIds', 'email role');
    }

    async update(id, data) {
        return await School.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).populate('adminIds', 'email role');
    }

    async delete(id) {
        return await School.findByIdAndDelete(id);
    }

    async findByAdminId(adminId) {
        return await School.find({ adminIds: adminId });
    }
}

module.exports = new SchoolRepository();
