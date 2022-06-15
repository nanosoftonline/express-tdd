/**
 * 
 * @param {{groupDataSource}} param
 * @returns {{find, findOne, count, remove, create, update}}
 */
module.exports = function GroupRepository({ groupDataSource }) {
    return {
        async count(filter) {
            const result = await groupDataSource.countItems(filter)
            return result

        },
        async find(filter) {
            const result = await groupDataSource.find(filter)
            return result

        },

        async findOne(id) {
            const result = await groupDataSource.findOne(id)
            return result

        },
        async create(item) {
            const result = await groupDataSource.create(item)
            return result
        },
        async remove(id) {
            const result = await groupDataSource.remove(id)
            return result
        },
        async update(id, data) {
            const result = await groupDataSource.update(id, data)
            return result
        }
    }
}