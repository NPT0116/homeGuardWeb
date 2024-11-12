import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
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
        devices: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Device', // Tham chiếu đến bảng (collection) thiết bị
            },
        ],
    },
    { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
