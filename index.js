require("dotenv").config({})
const { resolve } = require("./src/di/container")
const server = require("./src/server")
server.use("/user", resolve("userRoutes"))
server.listen(8080, () => console.info("server running..."))