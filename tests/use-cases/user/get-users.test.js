const GetUsers = require("../../../src/use-cases/user/get-users")

describe("Get Users", () => {
    let getUsers;

    let User = {
        findAll: jest.fn()
    }

    beforeAll(() => {
        getUsers = GetUsers({
            User
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should return list of users", async () => {
        //arrange
        User.findAll = jest.fn().mockResolvedValue([{ name: "name" }]);
        //act
        const result = await getUsers()
        //assert
        expect(result).toEqual([{ name: "name" }]);
        expect(User.findAll).toHaveBeenCalledTimes(1);
        expect(User.findAll).toHaveBeenCalledWith({ where: {} });
    });





});