## How to write a Clean API Architecture using Express
So why do we need to think of architecture when it comes to building APIs. After all, we can knock together a simple API within a few minutes:

Let's use Express and PostgreSQL to quickly put together an API to CRUD customers to a database

```json
{
  "name": "easyapi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1",
    "pg": "^8.7.3",
    "sequelize": "^6.20.1"
  }
}
```



```js
//customer-model.js
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize("postgres://postgres@localhost:5432/customerdb");

const Customer = sequelize.define('customer', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
}, { timestamps: false });

module.exports = Customer
```

```js
//customer-router.js
const express = require("express")
const router = express.Router()
const Customer = require("./customer-model")

router.get("/", async (req, res, next) => {
    try {
        const result = await Customer.findAll({ where: {} })
        res.status(200).json(result)

    } catch ({ message }) {
        res.status(500).json({ message })

    }

})

router.post("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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


router.delete("/:id", async (req, res) => {
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
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

router.use("/*", (req, res) => {
    res.status(404).json({ message: "This route does not exist" })
})

module.exports = router
```

```js
//server.js
const express  = require("express")
const server = express();

server.use(express.json()); 
server.get("/", (req, res) => {
    res.send("Welcome to my API")
})
server.use("/customer", require("./customer-router"));
server.listen(8080, () => console.info("Server Running..."))
```


![](docs/easy2.gif)


Easy as that! 

It might not look that way but there is actually quite a lot happening here. If we intend building scalable and flexible applications we need a way of breaking up the complexity into small and testable parts. 

Complexity! What complexity? 

Well, a few things are noticed:

* No input validation
* All errors are caught and returned the same way with no mapping of error to predictable status codes and messages
* All functionality is kept in the route handler.
* No tests
* Every route handler will need to be touched to change the data source from Postgres to let's say MongoDB

Ok let's look at how can fix input validation first

## Input Validation

Validation is a big topic to discuss and we won't be doing that here, however we should look for a good validation library to do the heavy lifting for use.

A good, mature and well starred module is [joi](https://github.com/sideway/joi). Check it out. Great documentation [here](https://joi.dev/api/)

To validation our body, params and query of the request there is a middleware function we'd need to write

```js
function validate({ body, params, query }) {
    return function (req, res, next) {
        let errors = []
        if (body) {
            const { error } = body.validate(req.body, { abortEarly: false })
            if (error) {
                errors.push({ message: error.message, type: "body" })
            }
        }

        if (params) {
            const { error } = params.validate(req.params, { abortEarly: false })
            if (error) {
                errors.push({ message: error.message, type: "params" })
            }
        }

        if (query) {
            const { error } = query.validate(req.query, { abortEarly: false })
            if (error) {
                errors.push({ message: error.message, type: "query" })
            }
        }

        if (errors.length > 0) {
            return res.status(400).json(errors)
        }
        next()
    }

}
```

This validation middleware examines parts of the request input(body, params or query) agains a validation schema. It gathers all validations error into an array called errors and if any errors are found, the server responsed with a 400 status code with descriptive error messages

Let's update our router with this middleware to illustrate

```js
//customer-router.js
const express = require("express")
const router = express.Router()
const Customer = require("./customer-model")
const Joi = require('joi');

/**
 * 
 * @param {{body?, params?, query?}} param
 * @returns 
 */
function validate({ body, params, query }) {
    return function (req, res, next) {
        let errors = []
        if (body) {
            const { error } = body.validate(req.body, { abortEarly: false })
            if (error) {
                errors.push({ message: error.message, type: "body" })
            }
        }

        if (params) {
            const { error } = params.validate(req.params, { abortEarly: false })
            if (error) {
                errors.push({ message: error.message, type: "params" })
            }
        }

        if (query) {
            const { error } = query.validate(req.query, { abortEarly: false })
            if (error) {
                errors.push({ message: error.message, type: "query" })
            }
        }

        if (errors.length > 0) {
            return res.status(400).json(errors)
        }
        next()
    }

}

router.get("/", async (req, res, next) => {
    const result = await Customer.findAll({ where: {} })
    res.status(200).json(result)

})

router.post("/",
    validate({
        body: Joi.object({
            name: Joi.string().required()
        })
    }),
    async (req, res) => {
        const item = await Customer.findOne({ where: { name: req.body.name } })
        if (item) {
            throw new Error("Customer Already Exists")
        } else {
            const result = await Customer.create(req.body)
            res.status(201).json(result)
        }
    })

router.get("/:id",
    validate({
        params: Joi.object({
            id: Joi.number().integer().required()
        }),

    }),
    async (req, res) => {

        const item = await Customer.findByPk(req.params.id)
        if (item) {
            const result = await Customer.findByPk(req.params.id)
            res.status(200).json(result)
        } else {
            throw new Error("Customer not found")
        }
    })


router.delete("/:id",
    validate({
        params: Joi.object({
            id: Joi.number().integer().required()
        }),

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
        }),

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
```

![](docs/ok1.gif)

We can clean this up nicely with express-joi-validation module; a middleware for validating express inputs. This will intercept the request and validate the inputs as we see fit.

```js
...
const Joi = require("joi")
const {createValidator} = require('express-joi-validation')
const validator = createValidator()
...
router.put("/:id",
   validator.params(Joi.object({
      id: Joi.number().required(),
   })),
   validator.body(Joi.object({
      name: Joi.string(),
   })),

   async (req, res) => {

   await Customer.update(req.body, {
      where: {
         id:
            req.params.id
      }
   })

   res.status(200).json({ message: "Updated" })
})
```

Let's look at the customer router now

```js
//customer-router.js
const express = require("express")
const Joi = require("joi")
const router = express.Router()
const { createValidator } = require('express-joi-validation')
const validator = createValidator()
const Customer = require("./customer-model")


const paramsValidate = validator.params(Joi.object({
   id: Joi.number().required(),
}))
const bodyValidate = validator.body(Joi.object({
   name: Joi.string(),
}))

router.get("/", async (req, res) => {
   const result = await Customer.findAll({ where: {} })
   res.status(200).json(result)
})
router.post("/", bodyValidate, async (req, res) => {
   const result = await Customer.create(req.body)
   res.status(201).json(result)
})
router.get("/:id", paramsValidate, async (req, res) => {
   const result = await Customer.findByPk(req.params.id)
   res.status(200).json(result)
})
router.delete("/:id", paramsValidate, async (req, res) => {
   const result = await Customer.destroy({ where: { id: req.params.id } })
   res.status(200).json(result)
})

router.put("/:id", paramsValidate, bodyValidate, async (req, res) => {
   await Customer.update(req.body, {
      where: {
         id:
            req.params.id
      }
   })
   res.status(200).json({ message: "Updated" })
})

module.exports = router
```
![](docs/nice.gif)


## Error Handling
We need a consistent way of handling expected or unexpected errors in our router handlers

