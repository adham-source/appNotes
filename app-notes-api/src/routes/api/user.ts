import { Router } from 'express'
import UserControllers from '../../controllers/user'

const userControllers = new UserControllers()

const router = Router()

router
    .route('/')
    .get(userControllers.getAllUsers)
    .post(userControllers.createNewUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser)

export default router
