/**
 * @typedef {import('../../global').User} User
 * @param {{userRepository: import('../../global').Repository<User>}} param
 * @returns {(id: String | Number) => Promise<User[]>}
 */
module.exports = ({ userRepository }) => async () => {
    const result = await userRepository.find({})
    return result
}