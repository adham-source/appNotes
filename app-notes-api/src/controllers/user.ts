import { Request, Response } from 'express'
import asyncHandeler from 'express-async-handler'
import bcrypt from 'bcrypt'
import config from '../config/config'
import UserSchema from '../models/User'
import NoteSchema from '../models/Note'

export default class UserControllers {
    /**
     * @desc Get all users
     * @route GET /api/users
     * @access Private
     */
    getAllUsers = asyncHandeler(
        async (_req: Request, res: Response): Promise<void> => {
            const users = await UserSchema.find()
                .select({ password: 0, role: 0, verify: 0 })
                .lean()
            if (!users?.length || users?.length === 0 || !users) {
                res.status(404).json({
                    success: false,
                    message: 'Not found any user',
                })
                return
            }
            res.json({
                success: true,
                users,
            })
        }
    )

    /**
     * @desc Create new users
     * @route POST /api/users
     * @access Private
     */
    createNewUser = asyncHandeler(
        async (req: Request, res: Response): Promise<void> => {
            const { username, email, password, roles } = req.body
            if (
                !username ||
                !email ||
                !password ||
                !Array.isArray(roles) ||
                !roles
            ) {
                res.status(400).json({
                    success: false,
                    message: 'All fileds are required',
                })
                return
            }
            const duplicate = await UserSchema.findOne({ email }).lean().exec()
            if (duplicate || duplicate !== null) {
                res.status(409).json({
                    success: false,
                    message: 'Email is already exist',
                })
                return
            }

            const hasedPassword = await bcrypt.hash(
                `${password}${config.secretPassword}`,
                10
            )

            const userObject = {
                username,
                email,
                password: hasedPassword as string,
                roles,
            }

            const user = await UserSchema.create(userObject)
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user data received',
                })
                return
            }

            res.status(201).json({
                success: true,
                message: `New user ${userObject.username} created`,
            })
        }
    )

    /**
     * @desc Update a  user
     * @route PATCH /api/users
     * @access Private
     */

    updateUser = asyncHandeler(
        async (req: Request, res: Response): Promise<void> => {
            const { id, username, email, password, roles, active } = req.body
            if (
                !id ||
                !username ||
                !email ||
                !Array.isArray(roles) ||
                !roles.length ||
                typeof active !== 'boolean'
            ) {
                res.status(400).json({
                    success: false,
                    message: 'All fileds are required',
                })
                return
            }
            const user = await UserSchema.findById(id).exec()
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: 'User not found',
                })

                return
            }
            const duplicate = await UserSchema.findOne({ email }).lean().exec()
            if (duplicate && duplicate?._id.toString() !== id) {
                res.status(409).json({
                    success: false,
                    message: 'Duplicate email',
                })
                return
            }

            user.username = username as string
            user.email = email as string
            user.roles = roles as string[]
            user.active = active as boolean

            // This is a simple handel to change password !!
            if (password) {
                user.password = (await bcrypt.hash(
                    `${password}${config.secretPassword}`,
                    10
                )) as string
            }

            const updateUser = await user.save()

            res.json({
                success: true,
                message: `${updateUser.username} updated`,
            })
        }
    )

    /**
     * @desc Delete a  user
     * @route DELETE /api/users
     * @access Private
     */

    deleteUser = asyncHandeler(
        async (req: Request, res: Response): Promise<void> => {
            const { id } = req.body
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                })
                return
            }

            const user = await UserSchema.findById(id).exec()
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: 'User not found',
                })
                return
            }

            const notes = await NoteSchema.findOne({ user: id }).lean().exec()
            if (notes) {
                res.status(400).json({
                    success: false,
                    message: 'User has assigned notes',
                })
            }

            const result = await user.deleteOne()
            const replay = `${result.username} deleted`

            res.json({
                success: true,
                message: replay,
            })
        }
    )
}
