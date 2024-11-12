import PATH from '../config/routes.mjs';
import { Router } from 'express';
import {
    registerDevice,
    renderDevicePages,
    deleteDevice,
    renderSensorOfDevice,
} from '../controllers/devicesController.mjs';

const deviceRouter = Router();

deviceRouter.get(PATH.DEVICES.path, renderDevicePages);

deviceRouter.post(PATH.DEVICES.outlet.REGISTER, registerDevice);

deviceRouter.delete(PATH.DEVICES.outlet.DELETE, deleteDevice);

// deviceRouter.post(PATH.DEVICES.outlet.UPDATE_SENSOR_VALUE, updateSensorValue);
// routes/devices.js
deviceRouter.get('/devices/:deviceId/select', renderSensorOfDevice);

export default deviceRouter;
