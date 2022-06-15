const GetUsers = require("../../../src/use-cases/user/get-users");
const mockUserRepository = require("../../mocks/repositories/mock-user-repository");

describe("Get userRepositorys", () => {
    let getUsers;


    beforeAll(() => {
        getUsers = GetUsers({
            userRepository: mockUserRepository
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should return list of users", async () => {
        //arrange
        mockUserRepository.find = jest.fn().mockResolvedValue([{ name: "name" }]);
        //act
        const result = await getUsers()
        //assert
        expect(result).toEqual([{ name: "name" }]);
        expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.find).toHaveBeenCalledWith({});
    });





});