const Joi = require('joi');
const schema = Joi.object()
    .keys({
        name: Joi.string()
            .min(3)
            .max(40)
            .required(),
        age: Joi.number()
            .integer()
            .min(16)
    })
const data = {
    name: 'Sr',
    age: 10
};

const result = schema.validate(data, { abortEarly: false });
console.log(result);