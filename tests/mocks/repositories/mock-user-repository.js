/**
 *  @type {import("../../../src/global").Repository<import("../../../src/global").User>}
 */
const mockUserRepository = {
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
    findById: jest.fn()
}

module.exports = mockUserRepository