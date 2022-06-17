//server.js
const express = require("express")
const server = express();

server.use(express.json());
server.get("/", (req, res) => {
    res.send("Welcome to my API")
})
server.use("/customer", require("./customer-router"));
server.listen(8080, () => console.info("Server Running..."))