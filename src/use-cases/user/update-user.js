const errorEnums = require('../../enums/error-enums')

/**
 * @typedef {import('../../global').User} User
 * @param {{userRepository: import('../../global').Repository<User>}} param
 * @returns {(id: string | number, data: User) => Promise<void>}
 */
module.exports = ({ userRepository }) => async (id, data) => {
    const userCount = await userRepository.count({ id })
    if (userCount === 0) {
        throw errorEnums.NOT_FOUND
    }
    await userRepository.update(id, data)
}