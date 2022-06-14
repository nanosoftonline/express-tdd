module.exports = ({ User }) => async (filter) => {
    const result = await User.count({ where: filter })
    return result
}