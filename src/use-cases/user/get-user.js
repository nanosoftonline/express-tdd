
module.exports = ({ User }) => async (id) => {
    const result = await User.findOne({ where: { id } })
    return result
}