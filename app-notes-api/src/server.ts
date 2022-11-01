import config from './config/config'
import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import rootRouter from './routes/api/root'
import userRouter from './routes/api/user'
import logger from './middlewares/logger'
import errorHandler from './middlewares/errorHandler'
import dbConnect from './config/dbConnect'
import { connection } from 'mongoose'

const app: Application = express()
const PORT = config.port || 8080

dbConnect()

app.use(logger.loggers)
app.use(cors(corsOptions))
app.use(helmet())

app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '..', 'public')))
app.use('/', rootRouter)
app.use('/api/users', userRouter)
app.use((req: Request, res: Response): void => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
        return
    }
    if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
        return
    }
    res.type('txt').send('404 Not Found')
})

app.use(errorHandler)

connection.once('open', (): void => {
    console.info('Database is running on MONGODB')
    app.listen(PORT, () =>
        console.info(`Server is running on http://localhost:${PORT}`)
    )
})

connection.on('error', (err): void => {
    logger.logEvents(
        `MONGODB\t${err.no}: ${err.code}\t${err.syscall}\t${err.hostname} `,
        'databaseErrors.log'
    )
})

export default app
