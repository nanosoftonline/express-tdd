/**
 * @typedef {import("../../global").Product} Product
 * @param {{productRepository:import("../../global").Repository<Product>}} param
 * @returns {(item: Product) =>Promise<void>}
 */
module.exports = ({ productRepository }) => async (item) => {
    await productRepository.create(item)
}