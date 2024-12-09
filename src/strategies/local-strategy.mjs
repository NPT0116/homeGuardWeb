import passport from 'passport';

import { Strategy } from 'passport-local';
import { User } from '../models/userSchema.mjs';
import { comparePasswordd } from '../utils/password.mjs';

passport.serializeUser((user, done) => {
    console.log('Serialize User');

    done(null, user._id);
});
passport.deserializeUser(async (userId, done) => {
    console.log('Deserialize User');
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("can't find user in deserialize");
        }
        done(null, user);
    } catch (e) {
        console.error(`Error: ${e}`);

        done(e, null);
    }
});

export default passport.use(
    'local',
    new Strategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const userFind = await User.findOne({ username });
                if (!userFind) {
                    return done(null, false, { field: 'username', message: 'User not found' });
                }
                if (!comparePasswordd(password, userFind.password)) {
                    return done(null, false, { field: 'password', message: 'Incorrect password' });
                }
                done(null, userFind);
            } catch (e) {
                done(e, null);
            }
        },
    ),
);
