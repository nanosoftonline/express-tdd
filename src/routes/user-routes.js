const express = require("express");
const asyncHandler = require('express-async-handler')
const errorEnums = require("../enums/error-enums");
const router = express.Router()

/**
 * 
 * @param {import("../global").UserRouterParam} param
 * @returns 
 */
function UserRouter({
    getUser,
    getUsers,
    createUser,
    deleteUser,
    updateUser
}) {

    router.get("/", asyncHandler(async (req, res) => {
        const result = await getUsers({});
        res.status(200).json(result);
    }))

    router.get("/:id", asyncHandler(async (req, res) => {
        const result = await getUser(req.params.id);
        res.status(200).json(result);
    }))

    router.delete("/:id", asyncHandler(async (req, res) => {
        await deleteUser(req.params.id);
        res.status(200).json({ message: "User Deleted" });
    }))

    router.put("/:id", asyncHandler(async (req, res) => {
        await updateUser(req.params.id, req.body);
        res.status(200).json({ message: "User Updated" });
    }))

    router.post("/", asyncHandler(async (req, res) => {
        await createUser(req.body);
        res.status(201).json({ message: "User Created" });
    }))

    router.use((err, req, res, next) => {
        switch (err) {
            case errorEnums.ALREADY_EXISTS:
                res.status(409).json({ message: err.message });
            case errorEnums.NOT_FOUND:
                res.status(404).json({ message: err.message });
            default:
                res.status(500).json({ message: "Datasource Error" });
        }
    })

    return router
}

module.exports = UserRouter