/**
 * @typedef {import("../../global").Product} Product
 * @param {{productRepository: import("../../global").Repository<Product>}} param
 * @returns {(id: String | Number) => Promise<Product[]>}
 */
module.exports = ({ productRepository }) => async () => {
    const result = await productRepository.find({})
    return result
}