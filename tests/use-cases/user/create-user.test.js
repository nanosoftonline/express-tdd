const CreateUser = require("../../../src/use-cases/user/create-user")
const mockUserRepository = require("../../mocks/repositories/mock-user-repository")

describe("Get User", () => {
    let createUser;
    beforeAll(() => {
        createUser = CreateUser({
            userRepository: mockUserRepository
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should create a specific user", async () => {
        //arrange
        mockUserRepository.create = jest.fn().mockResolvedValue(null);
        //act
        await createUser({ name: "some name" })
        //assert
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    test("should throw error when user already exists", async () => {
        //arrange
        mockUserRepository.create = jest.fn().mockResolvedValue(null);
        mockUserRepository.count = jest.fn().mockResolvedValue(1);
        try {
            //act
            await createUser({ name: "some name" })
        } catch (e) {
            //assert
            expect(e.message).toEqual("Item already exists");
            expect(mockUserRepository.count).toHaveBeenCalledWith({ name: "some name" })
            expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
        }
    });

});