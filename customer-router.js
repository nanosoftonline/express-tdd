//customer-router.js
const express = require("express")
const router = express.Router()
const Customer = require("./customer-model")

router.get("/", async (req, res) => {
    try {
        const result = await Customer.findAll({ where: {} })
        res.status(200).json(result)
    } catch (e) {
        res.status(500).json(e.message)
    }
})
router.post("/", async (req, res) => {
    try {
        const item = await Customer.findOne({ where: { name: req.body.name } })
        if (item) {
            const result = await Customer.create(req.body)
            res.status(201).json(result)
        } else {
            throw new Error("Customer Already Exists")
        }
    } catch (e) {
        res.status(500).json(e.message)
    }
})
router.get("/:id", async (req, res) => {
    try {
        const item = await Customer.findByPk(req.params.id)
        if (item) {
            const result = await Customer.findByPk(req.params.id)
            res.status(200).json(result)
        } else {
            throw new Error("Customer not found")
        }
    } catch (e) {
        res.status(500).json(e.message)
    }
})
router.delete("/:id", async (req, res) => {
    try {
        const item = await Customer.findByPk(req.params.id)
        if (item) {
            const result = await Customer.destroy({ where: { id: req.params.id } })
            res.status(200).json(result)
        } else {
            throw new Error("Customer not found")
        }
    } catch (e) {
        res.status(500).json(e.message)
    }
})
router.put("/:id", async (req, res) => {
    try {
        const item = await Customer.findByPk(req.params.id)
        if (item) {
            const result = await Customer.update(req.body, {
                where: {
                    id:
                        req.params.id
                }
            })
            res.status(200).json(result)
        } else {
            throw new Error("Customer not found")
        }
    } catch (e) {
        res.status(500).json(e.message)
    }
})



module.exports = router