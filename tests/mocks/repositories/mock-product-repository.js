/**
 *  @type {import("../../../src/global").Repository<import("../../../src/global").Product>}
 */
const mockProductRepository = {
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
    findById: jest.fn()
}

module.exports = mockProductRepository