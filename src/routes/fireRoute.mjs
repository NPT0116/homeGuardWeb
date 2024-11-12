// routes/fireRoutes.mjs
import { Router } from 'express';
import { fireDetection } from '../controllers/FireControllers.mjs';
import PATH from '../config/routes.mjs';
const fireRouter = Router();

// API để xử lý cảnh báo cháy từ Wokwi
fireRouter.post(PATH.SENSORS.outlet.FIRE_DETECTION, fireDetection);
// fireRouter.get('/api/checkFireAlert', checkFireAlert);
fireRouter.post('/clear-fire-alert', (req, res) => {
    req.session.fireAlert = null; // Xóa fireAlert khỏi session
    res.status(200).send('Fire alert cleared');
});
export default fireRouter;
