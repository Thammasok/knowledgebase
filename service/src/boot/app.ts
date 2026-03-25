import 'dotenv/config'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import limiter from './rate-limit'
import logger from './logger'
import generateRoute from './router'
import useragent from 'express-useragent'
import errorMiddleware from '../middleware/error.middleware'
import HttpException from '../exceptions/http-exception'

const LOGGER_NAME = 'APP_BOOT:'
const app: Application = express()

declare global {
  namespace Express {}
}

// view engine setup
// app.set('views', path.join(__dirname, '../views'))
// app.set('view engine', 'hbs')

// const corsOptions = {
//   origin: config.ALLOWED_ORIGIN.CLIENT_URL,
// }

app.use(cors())

app.use(limiter)
app.use(useragent.express())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

// api/routes
generateRoute(app)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpException(StatusCodes.NOT_FOUND, 'API not found'))
})

// Error handling middleware (must be last)
app.use(errorMiddleware)

export default app
