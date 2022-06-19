/**
 * 
 * @param {{body?, params?, query?}} param
 * @returns 
 */
module.exports = ({ body, params, query }) => {
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