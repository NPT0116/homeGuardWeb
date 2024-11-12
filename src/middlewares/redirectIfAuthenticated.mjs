import PATH from '../config/routes.mjs';

const redirectIfAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect(PATH.HOME);
    }
    next();
};

export default redirectIfAuthenticated;
