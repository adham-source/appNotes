import { connect } from 'mongoose'
import config from './config'

const dbConnect = async (): Promise<void> => {
    try {
        await connect(config.databaseUri)
    } catch (err) {
        console.error(err)
    }
}

export default dbConnect
