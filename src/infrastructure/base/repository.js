class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async findById(id, populate = []) {
        try {
            let query = this.model.findById(id);
            query = this.handlePopulate(query, populate);
            return await query;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async findOne(conditions, populate = []) {
        try {
            let query = this.model.findOne(conditions);
            query = this.handlePopulate(query, populate);
            return await query;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async findAll(options = {}) {
        try {
            const {
                conditions = {},
                populate = [],
                sort = { createdAt: -1 },
                page = 1,
                limit = 10
            } = options;

            let query = this.model.find(conditions);
            query = this.handlePopulate(query, populate);
            
            const total = await this.model.countDocuments(conditions);
            const pages = Math.ceil(total / limit);
            
            query = query
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);

            const results = await query;

            return {
                data: results,
                pagination: {
                    total,
                    pages,
                    page,
                    limit
                }
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                data,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handlePopulate(query, populate) {
        if (populate && populate.length > 0) {
            populate.forEach(field => {
                query = query.populate(field);
            });
        }
        return query;
    }

    handleError(error) {
        // Custom error handling logic
        return error;
    }
}

module.exports = BaseRepository;
