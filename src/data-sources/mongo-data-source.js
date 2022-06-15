const mongoose = require("mongoose")
/**
 * 
 * @param {mongoose.Model<mongoose.Schema>} model
 * @returns {import("../global").Repository<import("../global").User>}}
 *
 */
module.exports = function MongoDataSource(model) {
    return {

        async count(filter) {
            const result = await model.countDocuments(filter)
            return result
        },

        async find(filter) {
            const result = await model.find(filter)
            return result
        },

        async findById(id) {
            const result = await model.findById(id)
            return result
        },

        async create(item) {
            await model.create(item)

        },

        async remove(id) {
            await model.findByIdAndRemove(id)
        },

        async update(id, data) {
            await model.findByIdAndUpdate(id, data)
        }
    }
}