// routes/devices.js
import { Router } from 'express';
import { Device } from '../models/deviceSchema.mjs';
import {
    renderSensorPageWith1Sensor,
    renderSensorPageWithAllSensor,
    updateSensorData,
} from '../controllers/sensorsController.mjs';
import PATH from '../config/routes.mjs';
const sensorRouter = Router();
sensorRouter.get(PATH.DEVICES.outlet.SENSORS, renderSensorPageWith1Sensor);
sensorRouter.get(PATH.SENSORS.outlet.ALL, renderSensorPageWithAllSensor);
sensorRouter.post(PATH.SENSORS.outlet.UPDATE_DATA, updateSensorData);
export default sensorRouter;
