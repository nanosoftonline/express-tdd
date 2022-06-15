const GetUser = require("../../../src/use-cases/user/get-user")
const mockUserRepository = require("../../mocks/repositories/mock-user-repository")

describe("Get User", () => {
    let getUser;
    beforeAll(() => {
        getUser = GetUser({
            userRepository: mockUserRepository
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should find a specific user", async () => {
        //arrange
        mockUserRepository.findById = jest.fn().mockResolvedValue({ name: "name" });
        //act
        const result = await getUser(1)
        //assert
        expect(result).toEqual({ name: "name" });
        expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    test("should throw error when user not found", async () => {
        //arrange
        mockUserRepository.findById = jest.fn().mockResolvedValue({ name: "name" });
        mockUserRepository.count = jest.fn().mockResolvedValue(0);
        try {
            //act
            const result = await getUser(1)
        } catch (e) {
            //assert
            expect(e.message).toEqual("Item not found");
            expect(mockUserRepository.findById).toHaveBeenCalledTimes(0);

        }
    });

});