/**
* @typedef {import("../../global").Product} Product
 * @param {{productRepository:import("../../global").Repository<Product>}} param
 * @returns {(filter: Object) =>Promise<Number>}
 */
module.exports = ({ productRepository }) => async (filter) => {
    const result = await productRepository.count(filter)
    return result
}