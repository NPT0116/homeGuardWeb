import { User } from '../models/userSchema.mjs';
import bcrypt from 'bcrypt';

export const createUser = async (username, password, email) => {
    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();

        return {
            success: true,
            message: `Success create username: ${username}`,
            user: newUser,
        };
    } catch (e) {
        console.error(`Error creating user: ${e}`);
        return { success: false, message: 'Error creating user' };
    }
};

export const findUserByUsername = async (username) => {
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { success: true, message: ` ${username}is  exist in DB`, user: existingUser };
        } else {
            return { success: true, message: ` ${username} is not exist in DB`, user: null };
        }
    } catch (e) {
        return { success: false, message: `Can't access DB and find username: ${username}` };
    }
};
