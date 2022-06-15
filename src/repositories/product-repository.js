/**
 * 
 * @param {{productDataSource}} param
 * @returns {{find, findOne, count, remove, create, update}}
 */
module.exports = function UserRepository({ productDataSource }) {
    return {
        async count(filter) {
            const result = await productDataSource.countItems(filter)
            return result

        },
        async find(filter) {
            const result = await productDataSource.find(filter)
            return result

        },

        async findOne(id) {
            const result = await productDataSource.findOne(id)
            return result

        },
        async create(item) {
            const result = await productDataSource.create(item)
            return result
        },
        async remove(id) {
            const result = await productDataSource.remove(id)
            return result
        },
        async update(id, data) {
            const result = await productDataSource.update(id, data)
            return result
        }
    }
}