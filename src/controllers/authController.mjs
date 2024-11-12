import { validationResult, checkSchema, matchedData } from 'express-validator';
import { createUser, findUserByUsername } from '../controllers/userController.mjs';
import passport from 'passport';
import customError from '../utils/customError.mjs';
import sendEmail from '../utils/emailUtil.mjs';
import sendCustomNotification from '../utils/sendMobileNotification.mjs';
import dotenv from 'dotenv';

const assynErrorHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((e) => next(e));
    };
};
export const registerUser = assynErrorHandler(async (req, res, next) => {
    console.log(req.body.email);
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new customError('Validation failed', 400, errors.array());
        console.log(err);

        return next(err);
    }

    const { username, password } = matchedData(req);

    const result = await createUser(username, password, email);

    if (!result.success) {
        return next(new customError('Failed to create user in DB', 500));
    }
    sendEmail(
        email,
        'VLCNTT EMAIL CONFIRM',
        `You has successfully register account in our website with the username: ${username}`,
    );
    const title = 'register account successfully';
    const body = `${username} is has registered to our application home guard successfully with email : ${email}`;
    const data = {
        type: 'register account',
    };
    sendCustomNotification(process.env.TOKEN, title, body, data);
    return res.status(200).send({ msg: 'create users successfully' });
});

export const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            let errors = {};
            if (info.field === 'username') {
                errors.username = info.message;
            } else if (info.field === 'password') {
                errors.password = info.message;
            }

            return res.render('login', {
                title: 'Login Page',
                errors: errors,
                layout: false,
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

export const checkUserName = async (req, res, next) => {
    try {
        const { username } = req.params; // Lấy username từ URL

        const { success, message, user } = await findUserByUsername(username);
        if (!success) {
            next(new customError(message, 500));
        }
        if (user) {
            return res.status(200).json({ available: false, message: 'username is already taken', user: user });
        } else return res.status(200).json({ available: true, message: 'username is available', user: null });
    } catch (e) {
        return next(new customError(e.message, 500));
    }
};
