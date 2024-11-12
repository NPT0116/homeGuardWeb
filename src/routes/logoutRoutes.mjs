import PATH from '../config/routes.mjs';
import { Router } from 'express';

const logoutRouter = Router();

logoutRouter.get(PATH.LOGOUT, (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(400).send({ msg: "User not logged in yet, can't logout" });
        }

        // Nếu không có lỗi thì mới redirect
        return res.redirect(PATH.LOGIN);
    });
});

export default logoutRouter;
