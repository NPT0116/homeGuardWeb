import { Router } from 'express';
import { validateCreateUser } from '../middlewares/validateRegister.mjs';
import { registerUser, loginUser, checkUserName } from '../controllers/authController.mjs'; // Import các controller
import authenConfirm from '../middlewares/authenConfirm.mjs';
import PATH from '../config/routes.mjs';
import redirectIfAuthenticated from '../middlewares/redirectIfAuthenticated.mjs';
const loginRouter = Router();

loginRouter.get(PATH.REGISTER, (req, res) => {
    res.render('register', { title: 'Register Page', layout: false, errors: [] });
});

loginRouter.post(PATH.REGISTER, validateCreateUser, registerUser); // Sử dụng controller thay vì logic trực tiếp

loginRouter.get(PATH.LOGIN, redirectIfAuthenticated, (req, res) => {
    res.render('login', { title: 'Login Page', layout: false, errors: [] });
});

loginRouter.post(PATH.LOGIN, loginUser); // Sử dụng controller cho việc login

loginRouter.get(PATH.USERNAME_EXISTS, checkUserName);
export default loginRouter;
