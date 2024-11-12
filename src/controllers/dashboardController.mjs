import express from 'express';
import { Device } from '../models/deviceSchema.mjs';
import { DHT22Sensor } from '../models/dht22SensorSchema.mjs';
import { FireSensor } from '../models/fireSensorSchema.mjs';
import { MotionSensor } from '../models/motionSensorSchema.mjs';
import customError from '../utils/customError.mjs';
import { GasSensor } from '../models/gasSensorSchema.mjs';

export const renderDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const devices = await Device.find({ owner: userId })
            .populate('dht22Sensor')
            .populate('fireSensor')
            .populate('motionSensor')
            .populate('gasSensor');

        if (!devices.length) {
            return res.status(404).send('No devices found for this user');
        }

        return res.render('dashboard', { title: 'Dashboard - Devices Overview', devices });
    } catch (error) {
        next(error);
    }
};

export const redirectToDashboardSensors = async (req, res, next) => {
    const { sensorId } = req.params;

    try {
        // Tìm cảm biến trong các loại cảm biến khác nhau
        let sensor = await DHT22Sensor.findById(sensorId);
        let sensorType = 'DHT22';

        if (!sensor) {
            sensor = await FireSensor.findById(sensorId);
            sensorType = 'Fire';
        }
        if (!sensor) {
            sensor = await MotionSensor.findById(sensorId);
            sensorType = 'Motion';
        }
        if (!sensor) {
            sensor = await GasSensor.findById(sensorId);
            sensorType = 'Gas';
        }

        if (!sensor) {
            return next(new customError('Sensor not found', 404));
        }

        return res.render('sensorDashboard', {
            title: `${sensorType} Sensor Dashboard`,
            device: sensor.device,
            sensorType,
            sensor,
        });
    } catch (e) {
        next(new customError(e.message, 500));
    }
};
