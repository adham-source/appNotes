import mongoose, { Schema } from 'mongoose'

const userSchema: Schema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: [
            {
                type: String,
                default: 'Employee',
            },
        ],
        role: {
            type: String,
            enum: ['Admin', 'Client', 'Root'],
            default: 'Client',
            required: true,
        },
        verify: {
            type: Boolean,
            default: false,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const UserSchema = mongoose.model('User', userSchema)

export default UserSchema
