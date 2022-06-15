/**
* @typedef {import("../../global").User} User
 * @param {{userRepository:import("../../global").Repository<User>}} param
 * @returns {(filter: Object) =>Promise<Number>}
 */
module.exports = ({ userRepository }) => async (filter) => {
    const result = await userRepository.count(filter)
    return result
}