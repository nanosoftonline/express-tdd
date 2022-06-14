const request = require("supertest");
const server = require("../../src/server");
const UserRouter = require("../../src/routes/user-routes");

describe("User Router", () => {
    let userRouter;

    let getUser = jest.fn()
    let deleteUser = jest.fn()
    let createUser = jest.fn()
    let updateUser = jest.fn()
    let getUsers = jest.fn()
    let countUsers = jest.fn()

    beforeAll(() => {
        userRouter = UserRouter({
            getUser,
            getUsers,
            createUser,
            deleteUser,
            countUsers,
            updateUser
        });

        server.use("/user", userRouter);
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("GET /user", () => {
        test("should return list of users", async () => {
            //arrange
            getUsers.mockResolvedValue([{ name: "name" }]);
            //act
            const response = await request(server).get("/user");
            //assert
            expect(response.status).toEqual(200);
            expect(response.body).toEqual([{ name: "name" }]);
            expect(getUsers).toHaveBeenCalledTimes(1);
        });

        test("should return 500 on data source error", async () => {
            //arrange
            getUsers.mockRejectedValue(new Error("DB Error"));
            //act
            const response = await request(server).get("/user");
            //assert
            expect(response.status).toEqual(500);
            expect(response.body).toEqual({ message: "Datasource Error" });
            expect(getUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe("POST /user", () => {
        test("should create a user if doesn't already exist ", async () => {
            //arrange
            createUser.mockResolvedValue(null);
            countUsers.mockResolvedValue(0)
            //act
            const response = await request(server).post("/user").send({ name: "name" });
            //assert
            expect(response.status).toEqual(201);
            expect(createUser).toHaveBeenCalledWith({ name: "name" });
            expect(countUsers).toHaveBeenCalledWith({ name: "name" });
        });

        test("should return 409 if user exists", async () => {
            //arrange
            createUser.mockResolvedValue(null);
            countUsers.mockResolvedValue(1)
            //act
            const response = await request(server).post("/user").send({ name: "name" });
            //assert
            expect(response.status).toEqual(409);
            expect(response.body).toEqual({ message: "User Already Exists" });
            expect(createUser).toHaveBeenCalledTimes(0);
        });

        test("should return 500 on data source error", async () => {
            //arrange
            countUsers.mockResolvedValue(0)
            createUser.mockRejectedValue(new Error("DB Error"));
            //act
            const response = await request(server).post("/user").send({ name: "name" });
            //assert
            expect(response.status).toEqual(500);
            expect(response.body).toEqual({ message: "Datasource Error" });
            expect(createUser).toHaveBeenCalledWith({ name: "name" });
        });
    });

    describe("GET /user/:userId", () => {
        test("should get a user ", async () => {
            //arrange
            getUser.mockResolvedValue({ name: "name" });
            countUsers.mockResolvedValue(1)
            //act
            const response = await request(server).get("/user/123");
            //assert
            expect(response.status).toEqual(200);
            expect(getUser).toHaveBeenCalledWith("123");
        });

        test("should return 404 if user not found", async () => {
            //arrange
            getUser.mockResolvedValue(null);
            countUsers.mockResolvedValue(0)
            //act
            const response = await request(server).get("/user/123");
            //assert
            expect(response.status).toEqual(404);
            expect(response.body).toEqual({ message: "User Not Found" });
            expect(getUser).toHaveBeenCalledTimes(0);
        });

        test("should return 500 on data source error", async () => {
            //arrange
            getUser.mockRejectedValue(new Error("DB Error"));
            countUsers.mockResolvedValue(1)
            //act
            const response = await request(server).get("/user/123");
            //assert
            expect(response.status).toEqual(500);
            expect(response.body).toEqual({ message: "Datasource Error" });
            expect(getUser).toHaveBeenCalledWith("123");
        });
    });


    describe("DELETE /user/:userId", () => {
        test("should delete a user ", async () => {
            //arrange
            deleteUser.mockResolvedValue(null);
            countUsers.mockResolvedValue(1)
            //act
            const response = await request(server).delete("/user/123");
            //assert
            expect(response.status).toEqual(200);
            expect(response.body).toEqual({ message: "User Deleted" });
            expect(deleteUser).toHaveBeenCalledWith("123");
        });

        test("should return 404 if user not found", async () => {
            //arrange
            deleteUser.mockResolvedValue(null);
            countUsers.mockResolvedValue(0)
            //act
            const response = await request(server).delete("/user/123");
            //assert
            expect(response.status).toEqual(404);
            expect(response.body).toEqual({ message: "User Not Found" });
            expect(deleteUser).toHaveBeenCalledTimes(0);
        });

        test("should return 500 on data source error", async () => {
            //arrange
            countUsers.mockResolvedValue(1)
            deleteUser.mockRejectedValue(new Error("DB Error"));
            //act
            const response = await request(server).delete("/user/123");
            //assert
            expect(response.status).toEqual(500);
            expect(response.body).toEqual({ message: "Datasource Error" });
            expect(deleteUser).toHaveBeenCalledWith("123");
        });
    });

    describe("PUT /user/:userId", () => {
        test("should update a user ", async () => {
            //arrange
            updateUser.mockResolvedValue(null);
            countUsers.mockResolvedValue(1)
            //act
            const response = await request(server).put("/user/123").send({ name: "new name" });
            //assert
            expect(response.status).toEqual(200);
            expect(response.body).toEqual({ message: "User Updated" });
            expect(updateUser).toHaveBeenCalledWith({ name: "new name" }, { id: "123" });
        });

        test("should return 404 if user not found", async () => {
            //arrange
            updateUser.mockResolvedValue(null);
            countUsers.mockResolvedValue(0)
            //act
            const response = await request(server).put("/user/123").send({ name: "new name" });
            //assert
            expect(response.status).toEqual(404);
            expect(response.body).toEqual({ message: "User Not Found" });
            expect(updateUser).toHaveBeenCalledTimes(0);
        });

        test("should return 500 on data source error", async () => {
            //arrange
            countUsers.mockResolvedValue(1)
            updateUser.mockRejectedValue(new Error("DB Error"));
            //act
            const response = await request(server).put("/user/123").send({ name: "new name" });
            //assert
            expect(response.status).toEqual(500);
            expect(response.body).toEqual({ message: "Datasource Error" });
            expect(updateUser).toHaveBeenCalledTimes(1);
        });
    });
});