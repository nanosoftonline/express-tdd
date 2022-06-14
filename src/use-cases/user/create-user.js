module.exports = ({ User }) => async (data) => {
    const result = await User.create(data)
    return result
}