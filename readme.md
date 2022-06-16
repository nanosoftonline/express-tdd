## How to write a Clean API Architecture using Express
So we do why do we need to think of architecture when it comes to building APIs. After all, we can knock together a simple API within a few minutes:

Let's use Express and PostgreSQL to quickly put together an API to CRUD customers to a database

```json
{
  "name": "simpleapi",
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
   const result = await Customer.findAll({ where: {} })
   res.status(200).json(result)
})
router.post("/", async (req, res) => {
   const result = await Customer.create(req.body)
   res.status(200).json(result)
})
router.get("/:id", async (req, res) => {
   const result = await Customer.findByPk(req.params.id)
   res.status(200).json(result)
})
router.delete("/:id", async (req, res) => {
   const result = await Customer.destroy({ where: { id: req.params.id } })
   res.status(200).json(result)
})
router.put("/:id", async (req, res) => {
   const result = await Customer.update(req.body, {
      where: {
         id:
            req.params.id
      }
   })
   res.status(200).json(result)
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

So what's the problem?

It might not look that way but there is actually quite a lot happening here. If we want to build scalable and flexible applications we need a way of breaking up the complexity. Complexity! What complexity? Well let's look at whats going on here. Take the **PUT /:id** endpoint. This endpoint allows us to update the customers details, e.g. name of the customer.

The "router.put" hook of the express server listens for the HTTP PUT request on the "/user/:id" path

The inputs "id" and "body" are passed directly without any extraction, or validation to the update logic via a specialized database model.

The result of the update function is returned by the response. The Customer model therefore provides a direct definition of what will be returned by the response.

In the light of this tightly coupled functionality we should ask some questions

* How would we test
* How would we decompose logic as the application grows 
* How would we add validations for inputs
* How would we add functionality
* How would we handle errors

I think we can do better

