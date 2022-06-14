module.exports = ({ User }) => async (data, filter) => {
    const result = await User.update(data, { where: filter })
    return result
}