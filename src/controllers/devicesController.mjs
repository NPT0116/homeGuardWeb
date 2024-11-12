import customError from '../utils/customError.mjs';
import { Device } from '../models/deviceSchema.mjs';
import { DHT22Sensor } from '../models/dht22SensorSchema.mjs';
import { FireSensor } from '../models/fireSensorSchema.mjs';
import { MotionSensor } from '../models/motionSensorSchema.mjs';
import { GasSensor } from '../models/gasSensorSchema.mjs';
import { User } from '../models/userSchema.mjs';
export const renderDevicePages = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('devices');
        return res.render('devices', { title: 'Devices page', user: user });
    } catch (e) {
        next(new customError(e, 500));
    }
};

// controllers/devicesController.mjs

export const registerDevice = async (req, res, next) => {
    const { deviceId, location, name } = req.body;
    const user = req.user;

    try {
        // Kiểm tra nếu thiết bị đã được đăng ký
        let device = await Device.findOne({ device_id: deviceId });
        if (device) {
            return next(new customError('Device already exists and has been registered', 500));
        }

        // Tạo các cảm biến cố định cho thiết bị
        const dht22Sensor = await new DHT22Sensor({
            device: null,
            temperature: 0,
            humidity: 0,
            history: [{ timestamp: new Date(), temperature: 0, humidity: 0 }],
        }).save();

        const fireSensor = await new FireSensor({
            device: null,
            temperature: 0, // Giá trị mặc định cho temperature
            smokeLevel: 0, // Giá trị mặc định cho smokeLevel
            status: false,
            history: [{ timestamp: new Date(), temperature: 0, smokeLevel: 0, status: false }],
        }).save();

        const motionSensor = await new MotionSensor({
            device: null,
            isMotionDetected: false,
            history: [{ timestamp: new Date(), isMotionDetected: false }],
        }).save();

        const gasSensor = await new GasSensor({
            device: null,
            status: false,
            gasLevel: 0,
            history: [{ timestamp: new Date(), status: false, gasLevel: 0 }],
        }).save();

        // Tạo thiết bị mới với các cảm biến đã tạo
        const newDevice = new Device({
            device_id: deviceId,
            name,
            location,
            owner: user._id,
            dht22Sensor: dht22Sensor._id,
            fireSensor: fireSensor._id,
            motionSensor: motionSensor._id,
            gasSensor: gasSensor._id,
        });

        await newDevice.save();

        // Cập nhật lại thiết bị trong các cảm biến
        await DHT22Sensor.findByIdAndUpdate(dht22Sensor._id, { device: newDevice._id });
        await FireSensor.findByIdAndUpdate(fireSensor._id, { device: newDevice._id });
        await MotionSensor.findByIdAndUpdate(motionSensor._id, { device: newDevice._id });
        await GasSensor.findByIdAndUpdate(gasSensor._id, { device: newDevice._id });

        // Thêm thiết bị mới vào danh sách thiết bị của người dùng
        user.devices.push(newDevice._id);
        await user.save();

        return res.status(201).json({ message: 'Device successfully registered' });
    } catch (e) {
        console.error(e);
        next(new customError(e.message, 500));
    }
};

export const deleteDevice = async (req, res, next) => {
    try {
        const { deviceId } = req.params;
        const device = await Device.findOne({ device_id: deviceId });

        if (!device) {
            return next(new customError("Can't find device", 404));
        }

        // Xóa các cảm biến liên quan đến thiết bị
        await DHT22Sensor.deleteOne({ _id: device.dht22Sensor });
        await FireSensor.deleteOne({ _id: device.fireSensor });
        await MotionSensor.deleteOne({ _id: device.motionSensor });
        await DistanceSensor.deleteOne({ _id: device.distanceSensor });

        // Xóa thiết bị khỏi danh sách `devices` của người dùng
        await User.updateOne({ _id: req.user._id }, { $pull: { devices: device._id } });

        // Xóa thiết bị
        await Device.deleteOne({ _id: device._id });

        return res.status(200).json({ msg: `Successfully deleted device with ID: ${deviceId}` });
    } catch (e) {
        next(new customError(e.message, 500));
    }
};

export const renderSensorOfDevice = (req, res, next) => {
    const deviceId = req.params.deviceId;
    req.session.selectedDeviceId = deviceId; // Store in session
    res.redirect('/device/sensors'); // Redirect to sensors page without deviceId in URL
};
