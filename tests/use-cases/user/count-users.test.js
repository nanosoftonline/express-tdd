const CountUser = require("../../../src/use-cases/user/count-users")

describe("Get Users", () => {
    let countUsers;

    let User = {
        count: jest.fn()
    }

    beforeAll(() => {
        countUsers = CountUser({
            User
        });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should return count of users for a where", async () => {
        //arrange
        User.count = jest.fn().mockResolvedValue(1);
        //act
        const result = await countUsers({ name: "Some Name" })
        //assert
        expect(result).toEqual(1);
        expect(User.count).toHaveBeenCalledTimes(1);
        expect(User.count).toHaveBeenCalledWith({ where: { name: "Some Name" } });
    });





});