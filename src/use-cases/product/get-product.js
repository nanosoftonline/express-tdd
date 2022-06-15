/**
 * @typedef {import("../../global").Product} Product
 * @param {{productRepository: import("../../global").Repository<Product>}} param
 * @returns {(id: String | Number) => Promise<Product>}
 */
module.exports = ({ productRepository }) => async (id) => {
    const result = await productRepository.findById(id)
    return result
}