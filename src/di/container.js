const { createContainer, asFunction, asValue } = require("awilix")
const User = require("../models/user")

const container = createContainer()

const UserRouter = require("../routes/user-routes")
const GetUsers = require("../use-cases/user/get-users")
const GetUser = require("../use-cases/user/get-user")
const CountUsers = require("../use-cases/user/count-users")
const DeleteUser = require("../use-cases/user/delete-user")
const UpdateUser = require("../use-cases/user/update-user")
const CreateUser = require("../use-cases/user/create-user")
const UserRepository = require("../repositories/user-repository")

container.register({
    userRoutes: asFunction(UserRouter),
    getUsers: asFunction(GetUsers),
    getUser: asFunction(GetUser),
    userRepository: asFunction(UserRepository),
    countUsers: asFunction(CountUsers),
    deleteUser: asFunction(DeleteUser),
    updateUser: asFunction(UpdateUser),
    createUser: asFunction(CreateUser),
    User: asValue(User)
})


module.exports = container