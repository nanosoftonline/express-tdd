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


```js
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
        const result = await Customer.create(req.body)
        res.status(201).json(result)

    } catch (e) {
        res.status(500).json(e.message)
    }
})
router.get("/:id", async (req, res) => {
    try {
        const result = await Customer.findByPk(req.params.id)
        res.status(200).json(result)
    } catch (e) {
        res.status(500).json(e.message)
    }
})
router.delete("/:id", async (req, res) => {
    try {
        const result = await Customer.destroy({ where: { id: req.params.id } })
        res.status(200).json(result)
    } catch (e) {
        res.status(500).json(e.message)
    }
})
router.put("/:id", async (req, res) => {
    try {
        const result = await Customer.update(req.body, {
            where: {
                id:
                    req.params.id
            }
        })
        res.status(200).json(result)
    } catch (e) {
        res.status(500).json(e.message)
    }
})

module.exports = router
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


![](docs/easy2.gif)



Easy as that! 

It might not look that way but there is actually quite a lot happening here. If we intend building scalable and flexible applications we need a way of breaking up the complexity into small and testable parts. 

Complexity! What complexity? 

Well, a few questions come to mind:

* Can we do input validation
* Can we catch errors and map those errors to predictable status codes and messages
* Can we easily add functionality without bloating the router handler.
* Can we easily test tests for our code
* Can we easily change the data source from Postgres to let's say MongoDB


Well let's look at whats going on here. Take the **PUT** endpoint. This endpoint allows us to update a specific customers details. The inputs "id" and "body" are passed directly without any extraction, or validation to the update logic via a specialized database model. The result of the update function is returned by the response. The Customer model therefore provides a direct definition of what needs to come in and go out of the request handler.

In the light of this tightly coupled functionality we should ask some questions

* How would we test
* How would we decompose logic as the application grows 
* How would we add validations for inputs
* How would we add functionality
* How would we handle errors



We can do better

Ok let's look at what 

* We need a way to elegantly handle errors and mapping those errors to response codes / messages
* We need a way of validating the input of all requests
* We need a way of creating a use case for holding small pieces of logic
* We need a way code repository to do database functionality, like create, read, update and delete operations
* we need a way to change the data source without affecting all the above


Ok so where do we start. Let's have a look at what we have at the moment and try to improve on it.

## Validation
Let's see if we can add code to validate the input. We can use a framework like joi to do validation. Let's have a look at the PUT request again and see how we can incorporate input validation.


```js
...
const Joi = require("joi")
...
router.put("/:id", async (req, res) => {

   const paramsSchema = Joi.object({
      id: Joi.number().required()
   })
   const bodySchema = Joi.object({
      name: Joi.string()
   })

   const isParamValid = paramSchema.validate(req.params)
   const isBodyValid = bodySchema.validate(req.body)

   if (isParamValid.error) {
      return res.status(400).json({ message: isParamValid.error.message })
   }
   if (isBodyValid.error) {
      return res.status(400).json({ message: isBodyValid.error.message })
   }

   await Customer.update(req.body, {
      where: {
         id:
            req.params.id
      }
   })

   res.status(200).json({ message: "Updated" })
})
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

