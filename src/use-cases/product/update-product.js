/**
 * @typedef {import("../../global").Product} Product
 * @param {{productRepository: import("../../global").Repository<Product>}} param
 * @returns {(id: String | Number, data: Product) => Promise<Void>}
 */
module.exports = ({ productRepository }) => async (id, data) => {
    await productRepository.update(id, data)
}