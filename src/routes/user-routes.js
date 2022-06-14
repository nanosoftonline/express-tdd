const express = require("express")
const router = express.Router()


function UserRouter({
    getUser,
    getUsers,
    createUser,
    deleteUser,
    countUsers,
    updateUser
}) {

    router.get("/", async (req, res) => {
        try {
            const result = await getUsers();
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ message: "Datasource Error" });
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const userCount = await countUsers({ id: req.params.id })
            if (userCount > 0) {
                const result = await getUser(req.params.id);
                return res.status(200).json(result);
            }
            return res.status(404).json({ message: "User Not Found" });
        } catch (e) {
            return res.status(500).json({ message: "Datasource Error" });
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            const userCount = await countUsers({ name: req.body.name })
            if (userCount > 0) {
                await deleteUser(req.params.id);
                return res.status(200).json({ message: "User Deleted" });
            }
            return res.status(404).json({ message: "User Not Found" });
        } catch (e) {
            return res.status(500).json({ message: "Datasource Error" });
        }
    });

    router.put("/:id", async (req, res) => {
        try {
            const userCount = await countUsers({ id: req.params.id })
            if (userCount > 0) {
                await updateUser(req.body, { id: req.params.id });
                return res.status(200).json({ message: "User Updated" });
            }
            return res.status(404).json({ message: "User Not Found" });
        } catch (e) {
            return res.status(500).json({ message: "Datasource Error" });
        }
    });

    router.post("/", async (req, res) => {
        try {
            const userCount = await countUsers({ name: req.body.name })
            if (userCount === 0) {
                await createUser(req.body);
                return res.status(201).json({ message: "User Created" });
            }
            return res.status(409).json({ message: "User Already Exists" })
        } catch (e) {
            return res.status(500).json({ message: "Datasource Error" });
        }
    });

    return router
}

module.exports = UserRouter