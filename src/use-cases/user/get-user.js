const errorEnums = require('../../enums/error-enums')

/**
 * @typedef {import('../../global').User} User
 * @param {{userRepository: import('../../global').Repository<User>}} param
 * @returns {(id: String | Number) => Promise<User>}
 */
module.exports = ({ userRepository }) => async (id) => {
    const userCount = await userRepository.count({ id })
    if (userCount === 0) {
        throw errorEnums.NOT_FOUND
    }
    const result = await userRepository.findById(id)
    return result
}