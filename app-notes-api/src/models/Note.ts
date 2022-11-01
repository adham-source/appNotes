import mongoose, { Schema } from 'mongoose'

const noteSchema: Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        complated: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

const NoteSchema = mongoose.model('Note', noteSchema)

export default NoteSchema
