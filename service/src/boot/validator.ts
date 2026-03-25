import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'

const validator = (validator: {
  type: string
  schema?: Joi.ObjectSchema<any>
}) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object(validator.schema)
      if (validator.type === 'body' && req.body) {
        const validated = await schema.validateAsync(req.body)
        req.body = validated
      }

      if (validator.type === 'query' && req.query) {
        const validated = await schema.validateAsync(req.query)
        req.query = validated
      }

      if (validator.type === 'param' && req.params) {
        const validated = await schema.validateAsync(req.params)
        req.params = validated
      }

      next()
    } catch (err: any) {
      //* Pass err to next
      //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
      if (err.isJoi) return next(res.status(422).json({ message: err.message }))
    }
  }
}

export default validator
