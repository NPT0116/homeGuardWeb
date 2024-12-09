// controllers/sensorsController.mjs

import { Device } from '../models/deviceSchema.mjs';
import customError from '../utils/customError.mjs';
import { DHT22Sensor } from '../models/dht22SensorSchema.mjs';
import { FireSensor } from '../models/fireSensorSchema.mjs';
import { MotionSensor } from '../models/motionSensorSchema.mjs';
import { GasSensor } from '../models/gasSensorSchema.mjs';
import sendEmail from '../utils/emailUtil.mjs';
import utilSendPhoneNotification from '../utils/sendPhoneNotification.mjs';

export const renderSensorPageWith1Sensor = async (req, res, next) => {
    const deviceId = req.session.selectedDeviceId; // Retrieve from session
    if (!deviceId) {
        return res.status(400).send('Device not selected');
    }

    try {
        const device = await Device.findOne({ device_id: deviceId }).populate('dht22Sensor').populate('fireSensor').populate('motionSensor').populate('gasSensor');

        if (!device) {
            return res.status(404).send('Device not found');
        }
        const devices = [device];
        return res.render('sensor', { title: 'Sensor Page', devices, type: 'all' }); // chỉ truyền device
    } catch (error) {
        next(error);
    }
};

export const renderSensorPageWithAllSensor = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const devices = await Device.find({ owner: userId }).populate('dht22Sensor').populate('fireSensor').populate('motionSensor').populate('gasSensor');

        if (!devices.length) {
            return res.status(404).send('No devices found for this user');
        }
        return res.render('sensor', { title: 'All Sensors', devices, type: 'all' }); // truyền devices
    } catch (error) {
        next(error);
    }
};

const getSensorModel = (sensorType) => {
    switch (sensorType) {
        case 'dht22':
            return DHT22Sensor;
        case 'fire':
            return FireSensor;
        case 'motion':
            return MotionSensor;
        case 'gas':
            return GasSensor; // Thay distance bằng gas
        default:
            throw new customError('Invalid sensor type', 400);
    }
};

export const updateSensorData = async (req, res, next) => {
    const { deviceName, sensor: sensorType, ...sensorData } = req.body;

    try {
        // Find the device by its name
        const device = await Device.findOne({ device_id: deviceName })
            .populate(sensorType + 'Sensor')
            .populate('owner');
        if (!device || !device[sensorType + 'Sensor']) {
            return next(new customError('Device or sensor not found', 404));
        }

        // Get the sensor model based on the type
        const SensorModel = getSensorModel(sensorType);

        // Find the sensor document associated with the device
        const sensor = await SensorModel.findById(device[sensorType + 'Sensor']._id);
        if (!sensor) {
            return next(new customError(`${sensorType} sensor not found`, 404));
        }

        // Update sensor data and add to history based on sensor type
        const timestamp = new Date();
        let alertTriggered = false;
        let alertDetails = {};

        if (sensorType === 'dht22') {
            const { temperature, humidity } = sensorData;
            sensor.temperature = temperature;
            sensor.humidity = humidity;
            sensor.history.push({ timestamp, temperature, humidity });
        } else if (sensorType === 'fire') {
            const { temperature, smokeLevel, status } = sensorData;
            sensor.temperature = temperature;
            sensor.smokeLevel = smokeLevel;
            sensor.status = status;
            sensor.history.push({ timestamp, temperature, smokeLevel, status });

            if (status) {
                alertTriggered = true;
                alertDetails = { temperature, smokeLevel };
            }
        } else if (sensorType === 'motion') {
            const { isMotionDetected } = sensorData;
            sensor.isMotionDetected = isMotionDetected;
            sensor.history.push({ timestamp, isMotionDetected });

            if (isMotionDetected) {
                alertTriggered = true;
                alertDetails = {};
            }
        } else if (sensorType === 'gas') {
            const { gasLevel, status } = sensorData;
            sensor.gasLevel = gasLevel;
            sensor.status = status;
            sensor.history.push({ timestamp, gasLevel, status });

            if (status) {
                alertTriggered = true;
                alertDetails = { gasLevel };
            }
        }

        // Save the updated sensor data
        await sensor.save();

        // Trigger alert if necessary
        const clientIo = req.app.get('clientIo');
        if (!clientIo) {
            throw new Error('Socket.IO instance not found');
        }

        if (alertTriggered) {
            await sendAlert(sensorType, device.location, device.owner.email, alertDetails, clientIo);
        }

        res.status(200).json({ message: `${sensorType} sensor data updated successfully` });
    } catch (error) {
        next(new customError(error.message, 500));
    }
};

// Cấu hình các loại cảnh báo và nội dung tương ứng
const alertConfigurations = {
    fire: {
        emailSubject: 'Cảnh báo cháy nổ tức thời',
        getEmailContent: (location, details) => `Cảnh báo: Đã phát hiện dấu hiệu cháy tại ${location}. Nhiệt độ: ${details.temperature}°C, Mức độ khói: ${details.smokeLevel}. Hãy kiểm tra ngay lập tức.`,
        getSocketEvent: () => 'fireAlert',
    },
    gas: {
        emailSubject: 'Cảnh báo khí gas vượt ngưỡng',
        getEmailContent: (location, details) => `Cảnh báo: Đã phát hiện mức khí gas cao tại ${location}. Mức độ khí gas: ${details.gasLevel}. Hãy kiểm tra ngay lập tức.`,
        getSocketEvent: () => 'gasAlert',
    },
    motion: {
        emailSubject: 'Cảnh báo chuyển động phát hiện',
        getEmailContent: (location, details) => `Cảnh báo: Đã phát hiện chuyển động tại ${location}. Vui lòng kiểm tra.`,
        getSocketEvent: () => 'motionAlert',
    },
    // Thêm các loại cảm biến khác ở đây nếu cần trong tương lai
};

export const sendAlert = async (alertType, location, userEmail, alertDetails, io) => {
    const config = alertConfigurations[alertType];
    if (!config) {
        throw new Error(`Alert type "${alertType}" is not configured`);
    }

    // Tạo nội dung email và sự kiện Socket.IO dựa trên cấu hình
    const emailContent = config.getEmailContent(location, alertDetails);
    const emailSubject = config.emailSubject;
    const socketEvent = config.getSocketEvent();

    // Gửi email
    await sendEmail(userEmail, emailSubject, emailContent);

    // Gửi thông báo điện thoại
    await utilSendPhoneNotification(emailSubject, emailContent);

    // Gửi thông báo qua Socket.IO
    io.emit(socketEvent, {
        location,
        ...alertDetails,
    });
};
