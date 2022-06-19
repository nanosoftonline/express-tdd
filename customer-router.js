//customer-router.js
const express = require("express")
const router = express.Router()
const Customer = require("./customer-model")
const Joi = require('joi');
const validate = require("./middleware/validate")

router.get("/", async (req, res, next) => {
    try {
        const result = await Customer.findAll({ where: {} })
        res.status(200).json(result)
    } catch ({ message }) {
        res.status(500).json({ message })
    }

})

router.post("/",
    validate({
        body: Joi.object({
            name: Joi.string().required()
        })
    }),
    async (req, res) => {
        try {
            const item = await Customer.findOne({ where: { name: req.body.name } })
            if (item) {
                throw new Error("Customer Already Exists")
            } else {
                const result = await Customer.create(req.body)
                res.status(201).json(result)
            }
        } catch ({ message }) {
            res.status(500).json({ message })
        }
    })

router.get("/:id",
    validate({
        params: Joi.object({
            id: Joi.number().integer().required()
        })
    }),
    async (req, res) => {
        try {
            const item = await Customer.findByPk(req.params.id)
            if (item) {
                const result = await Customer.findByPk(req.params.id)
                res.status(200).json(result)
            } else {
                throw new Error("Customer not found")
            }
        } catch ({ message }) {
            res.status(500).json({ message })
        }
    })


router.delete("/:id",
    validate({
        params: Joi.object({
            id: Joi.number().integer().required()
        })
    }),
    async (req, res) => {
        try {
            const item = await Customer.findByPk(req.params.id)
            if (item) {
                const result = await Customer.destroy({ where: { id: req.params.id } })
                res.status(200).json(result)
            } else {
                throw new Error("Customer not found")
            }
        } catch ({ message }) {
            res.status(500).json({ message })
        }
    })


router.put("/:id",
    validate({
        params: Joi.object({
            id: Joi.number().integer().required()
        }),
        body: Joi.object({
            name: Joi.string()
        })
    }),
    async (req, res) => {
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
        } catch ({ message }) {
            res.status(500).json({ message })
        }
    })

router.use("/*", (req, res) => {
    res.status(404).json({ message: "This route does not exist" })
})

module.exports = router