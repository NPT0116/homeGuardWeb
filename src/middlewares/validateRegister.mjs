import { body } from 'express-validator';
import { User } from '../models/userSchema.mjs';

export const validateCreateUser = [
    // Kiểm tra username
    body('username')
        .isLength({ min: 5, max: 32 })
        .withMessage('Username must be between 5 to 32 characters')
        .notEmpty()
        .withMessage('Username must not be empty')
        .isString()
        .withMessage('Username must be a string')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ username: value });
            if (user) throw new Error('Username is already exsits');
            return true;
        }),

    // Kiểm tra password
    body('password')
        .isLength({ min: 5, max: 32 })
        .withMessage('Password must be between 5 to 32 characters')
        .notEmpty()
        .withMessage('Password must not be empty'),

    // Custom validator cho confirmPassword (không kiểm tra trực tiếp confirmPassword, chỉ so sánh với password)
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];
