/**
 * 
 * @param {import("sequelize").ModelCtor<import("sequelize").Model>} model
 * @returns {import("../typedefs").Repository}
 */
module.exports = function PGDataSource(model) {
    return {
        async count(filter) {
            const result = await model.count({ where: filter })
            return result
        },
        async find(filter) {
            const result = await model.findAll({ where: filter })
            return result
        },

        async findById(id) {
            const result = await model.findByPk(id)
            return result

        },
        async create(item) {
            await model.create(item)

        },
        async remove(id) {
            await model.destroy({ where: { id } })

        },
        async update(id, data) {
            await model.update(data, { where: { id } })
        }
    }
}