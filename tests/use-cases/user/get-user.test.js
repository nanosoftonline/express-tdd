const GetUser = require("../../../src/use-cases/user/get-user")

describe("Get Users", () => {
    let getUser;

    let User = {
        findOne: jest.fn()
    }

    beforeAll(() => {
        getUser = GetUser({
            User
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should return a specific user", async () => {
        //arrange
        User.findOne = jest.fn().mockResolvedValue({ name: "name" });
        //act
        const result = await getUser(1)
        //assert
        expect(result).toEqual({ name: "name" });
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });





});