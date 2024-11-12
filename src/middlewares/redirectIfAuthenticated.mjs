import routes from '../config/routes.mjs';

const redirectIfAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect(routes.home);
    }
    next();
};

export default redirectIfAuthenticated;
