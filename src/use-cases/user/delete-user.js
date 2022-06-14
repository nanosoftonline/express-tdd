module.exports = ({ User }) => async (id) => {
    const result = await User.destroy({ where: { id } })
    return result
}