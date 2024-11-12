import loginRouter from './authRoutes.mjs';
import { Router } from 'express';
import logoutRouter from './logoutRoutes.mjs';

import dashboardRouter from './dashboardRoutes.mjs';
import homeRouter from './home.mjs';
import profileRouter from './profileRoutes.mjs';
import deviceRouter from './devicesRoutes.mjs';
import sensorRouter from './sensorRoutes.mjs';
import emailScheduleRouter from './emailSchedule.mjs';
import fireRouter from './fireRoute.mjs';
import lcdRouter from './lcdRoutes.mjs';

const router = Router();
router.use(loginRouter);
router.use(logoutRouter);
router.use(dashboardRouter);
router.use(profileRouter);
router.use(homeRouter);
router.use(deviceRouter);
router.use(sensorRouter);
router.use(emailScheduleRouter);
// sensor handle
router.use(fireRouter);
router.use(lcdRouter);
export default router;
