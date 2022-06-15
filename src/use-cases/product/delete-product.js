/**
 * @typedef {import("../../global").Product} Product
 * @param {{productRepository: import("../../global").Repository<Product>}} param
 * @returns {(id: String | Number) =>Promise<Void>}
 */
module.exports = ({ productRepository }) => async (id) => {
    await productRepository.remove(id)

}