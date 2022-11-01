import { Request, Response, NextFunction } from 'express'
import logger from './logger'

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        'errors.log'
    )
    const status = res.statusCode ? res.statusCode : 500

    res.status(status)

    res.json({ message: err.message })

    next()
}

export default errorHandler
