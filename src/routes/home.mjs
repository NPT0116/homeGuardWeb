// routes/homeRoute.js
import { Router } from 'express';
import PATH from '../config/routes.mjs';
import { renderHomePage } from '../controllers/HomeController.mjs';

const homeRouter = Router();

homeRouter.get(PATH.HOME, renderHomePage);

export default homeRouter;
