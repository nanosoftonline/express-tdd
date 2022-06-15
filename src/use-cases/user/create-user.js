const errorEnums = require('../../enums/error-enums')

/**
 * @typedef { import('../../global').User} User
 * @param {{userRepository: import('../../global').Repository<User>}} param
 * @returns {(item: User) =>Promise<Void>}
 */
module.exports = ({ userRepository }) => async (item) => {
    const userCount = await userRepository.count({ name: item.name })
    if (userCount > 0) {
        throw errorEnums.ALREADY_EXISTS
    }
    await userRepository.create(item)
}