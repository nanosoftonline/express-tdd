/**
 * 
 * @param {{userDataSource}} param
 * @returns {{find, findOne, count, remove, create, update}}
 */
module.exports = function UserRepository({ userDataSource }) {
    return {
        async count(filter) {
            const result = await userDataSource.countItems(filter)
            return result

        },
        async find(filter) {
            const result = await userDataSource.find(filter)
            return result

        },

        async findOne(id) {
            const result = await userDataSource.findOne(id)
            return result

        },
        async create(item) {
            const result = await userDataSource.create(item)
            return result
        },
        async remove(id) {
            const result = await userDataSource.remove(id)
            return result
        },
        async update(id, data) {
            const result = await userDataSource.update(id, data)
            return result
        }
    }
}