import express from 'express';
import PATH from '../config/routes.mjs';
import { redirectToDashboardSensors, renderDashboard } from '../controllers/dashboardController.mjs';

const dashboardRouter = express.Router();

// Route to provide temperature sensor data for a user
dashboardRouter.get(PATH.DASHBOARD, renderDashboard);
// dashboardRouter.get(routes.dashboard, async (req, res, next) => {
//     return res.render('dashboard', { title: 'dashboard' });
// });
dashboardRouter.get('/dashboard/:sensorId', redirectToDashboardSensors);
export default dashboardRouter;
