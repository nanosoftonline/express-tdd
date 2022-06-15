const DeleteUser = require("../../../src/use-cases/user/delete-user")
const mockUserRepository = require("../../mocks/repositories/mock-user-repository")

describe("Get User", () => {
    let deleteUser;
    beforeAll(() => {
        deleteUser = DeleteUser({
            userRepository: mockUserRepository
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should call repo remove method", async () => {
        //arrange
        mockUserRepository.remove = jest.fn().mockResolvedValue(null);
        //act
        await deleteUser(1)
        //assert
        expect(mockUserRepository.remove).toHaveBeenCalledTimes(1);
    });

    test("should throw not found error when item does not exist", async () => {
        //arrange
        mockUserRepository.count = jest.fn().mockResolvedValue(0)
        try {
            //act
            await deleteUser(1)
            throw new Error("Fail")
        } catch (e) {
            //assert
            expect(e.message).toBe("Item not found");
            expect(mockUserRepository.remove).toHaveBeenCalledTimes(0);
        }
    });

});