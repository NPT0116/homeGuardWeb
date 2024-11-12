import PATH from '../config/routes.mjs';
const authenticateEnsure = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log(req.originalUrl);

        if (
            req.originalUrl !== PATH.LOGIN &&
            req.originalUrl !== PATH.REGISTER &&
            !/^\/api\/users\/[\w-]+$/.test(req.originalUrl) // Kiểm tra các route với pattern /api/users/:username
        )
            return res.redirect(PATH.LOGIN);
        else next();
    }
};

export default authenticateEnsure;
