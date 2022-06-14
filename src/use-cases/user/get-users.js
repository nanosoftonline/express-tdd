module.exports = ({ User }) => async () => {
    const result = await User.findAll({ where: {} })
    return result
}