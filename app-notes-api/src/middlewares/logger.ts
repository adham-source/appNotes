import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { Request, Response, NextFunction } from 'express'

const logEvents = async (
    message: string,
    logFileName: string
): Promise<void> => {
    const dateTime: string = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
        }
        await fsPromises.appendFile(
            path.join(__dirname, '..', '..', 'logs', logFileName),
            logItem
        )
    } catch (err) {
        console.error(err)
    }
}

const loggers = (req: Request, res: Response, next: NextFunction): void => {
    logEvents(
        `${req.method}\t${req.url}\t${req.headers.origin}`,
        'requests.log'
    )
    next()
}

export default { logEvents, loggers }
