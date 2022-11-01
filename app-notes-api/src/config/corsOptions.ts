import whiteList from './allowedOrigins'

const corsOptions = {
    origin: (origin: unknown, callback: Function): void => {
        if (whiteList.indexOf(origin as string) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true as boolean,
    optionsSuccessStatus: 200 as number,
}

export default corsOptions
