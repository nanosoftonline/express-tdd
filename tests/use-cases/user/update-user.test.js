const UpdateUser = require("../../../src/use-cases/user/update-user")
const mockUserRepository = require("../../mocks/repositories/mock-user-repository")

describe("Get User", () => {
    let updateUser;
    beforeAll(() => {
        updateUser = UpdateUser({
            userRepository: mockUserRepository
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should update a specific user", async () => {
        //arrange
        mockUserRepository.update = jest.fn().mockResolvedValue(null);
        //act
        await updateUser(1)
        //assert
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
    });

    test("should throw error when user not found", async () => {
        //arrange
        mockUserRepository.update = jest.fn().mockResolvedValue(null);
        mockUserRepository.count = jest.fn().mockResolvedValue(0);
        try {
            //act
            await updateUser(1)
        } catch (e) {
            //assert
            expect(e.message).toEqual("Item not found");
            expect(mockUserRepository.update).toHaveBeenCalledTimes(0);
        }
    });

});