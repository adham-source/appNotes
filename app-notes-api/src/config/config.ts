import * as dotenv from 'dotenv'
dotenv.config()

const config = {
    port: Number(process.env.PORT) as number,
    databaseUri: process.env.MONGODB_URI as string,
    secretPassword: process.env.SECRET_PASSWORD as string,
}

export default config
