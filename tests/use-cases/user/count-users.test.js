const CountUser = require("../../../src/use-cases/user/count-users");
const mockUserRepository = require("../../mocks/repositories/mock-user-repository");

describe("Get Users", () => {
    let countUsers;

    beforeAll(() => {
        countUsers = CountUser({
            userRepository: mockUserRepository
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should return count", async () => {
        //arrange
        mockUserRepository.count = jest.fn().mockResolvedValue(1);
        //act
        const result = await countUsers({ name: "Some Name" })
        //assert
        expect(result).toEqual(1);
        expect(mockUserRepository.count).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.count).toHaveBeenCalledWith({ name: "Some Name" });
    });

});