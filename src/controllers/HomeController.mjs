import { Device } from '../models/deviceSchema.mjs';
import { DHT22Sensor } from '../models/dht22SensorSchema.mjs';
import { FireSensor } from '../models/fireSensorSchema.mjs';
import { MotionSensor } from '../models/motionSensorSchema.mjs';
import { User } from '../models/userSchema.mjs';

export const renderHomePage = async (req, res, next) => {
    try {
        // Lấy thông tin người dùng

        const user = await User.findById(req.user._id);

        // Lấy tất cả các thiết bị của người dùng, bao gồm các cảm biến liên quan
        const devices = await Device.find({ owner: req.user._id }).populate('dht22Sensor').populate('fireSensor').populate('motionSensor');
        const onlineDevicesCount = devices.length;

        // Đặt mốc thời gian một tuần trước để tính trung bình nhiệt độ và độ ẩm
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let temperatureSum = 0;
        let humiditySum = 0;
        let tempDataCount = 0;
        let humidityDataCount = 0;

        // Lặp qua các thiết bị để tính trung bình nhiệt độ và độ ẩm từ cảm biến DHT22
        for (const device of devices) {
            if (device.dht22Sensor) {
                // Lọc dữ liệu trong lịch sử cảm biến trong khoảng thời gian 1 tuần qua
                const recentData = device.dht22Sensor.history.filter((entry) => new Date(entry.timestamp) >= oneWeekAgo);

                // Tính tổng và đếm số lượng dữ liệu nhiệt độ và độ ẩm
                recentData.forEach((entry) => {
                    if (entry.temperature !== undefined) {
                        temperatureSum += entry.temperature;
                        tempDataCount++;
                    }
                    if (entry.humidity !== undefined) {
                        humiditySum += entry.humidity;
                        humidityDataCount++;
                    }
                });
            }
        }

        // Tính trung bình nhiệt độ và độ ẩm
        const avgTemperature = tempDataCount > 0 ? (temperatureSum / tempDataCount).toFixed(1) : 'No Data';
        const avgHumidity = humidityDataCount > 0 ? (humiditySum / humidityDataCount).toFixed(1) : 'No Data';

        // Đưa ra lời khuyên dựa trên nhiệt độ và độ ẩm
        const adviceCards = [];
        if (avgTemperature !== 'No Data') {
            if (avgTemperature < 18) {
                adviceCards.push({
                    icon: 'fas fa-temperature-low',
                    message: 'Temperature is quite low. Consider keeping warm!',
                });
            } else if (avgTemperature > 28) {
                adviceCards.push({
                    icon: 'fas fa-temperature-high',
                    message: 'Temperature is high. Stay hydrated and keep cool!',
                });
            } else {
                adviceCards.push({
                    icon: 'fas fa-thermometer-half',
                    message: 'Temperature is optimal. Enjoy the comfortable weather!',
                });
            }
        }

        if (avgHumidity !== 'No Data') {
            if (avgHumidity < 30) {
                adviceCards.push({
                    icon: 'fas fa-water',
                    message: 'Humidity is low. Use a humidifier to improve air quality.',
                });
            } else if (avgHumidity > 70) {
                adviceCards.push({
                    icon: 'fas fa-cloud-rain',
                    message: 'Humidity is high. Consider using a dehumidifier to reduce moisture.',
                });
            } else {
                adviceCards.push({
                    icon: 'fas fa-smile',
                    message: 'Humidity level is comfortable. Breathe easy!',
                });
            }
        }

        // Lấy thông báo từ tất cả các cảm biến FireSensor
        const fireAlerts = await FireSensor.aggregate([
            { $match: { device: { $in: devices.map((d) => d._id) } } }, // Chỉ lấy dữ liệu từ các thiết bị của user
            { $unwind: '$history' },
            { $match: { 'history.status': true } },
            { $sort: { 'history.timestamp': -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'devices',
                    localField: 'device',
                    foreignField: '_id',
                    as: 'deviceDetails',
                },
            },
            {
                $project: {
                    timestamp: '$history.timestamp',
                    message: {
                        $concat: ['Fire detected in ', { $arrayElemAt: ['$deviceDetails.location', 0] }],
                    },
                },
            },
        ]);

        // Lấy thông báo từ tất cả các cảm biến MotionSensor
        const motionAlerts = await MotionSensor.aggregate([
            { $match: { device: { $in: devices.map((d) => d._id) } } }, // Chỉ lấy dữ liệu từ các thiết bị của user
            { $unwind: '$history' },
            { $match: { 'history.status': true } },
            { $sort: { 'history.timestamp': -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'devices',
                    localField: 'device',
                    foreignField: '_id',
                    as: 'deviceDetails',
                },
            },
            {
                $project: {
                    timestamp: '$history.timestamp',
                    message: {
                        $concat: ['Motion detected in ', { $arrayElemAt: ['$deviceDetails.location', 0] }],
                    },
                },
            },
        ]);

        // Gộp và sắp xếp các cảnh báo từ cả hai loại cảm biến
        const recentAlerts = [...fireAlerts, ...motionAlerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5); // Giới hạn lại số cảnh báo muốn hiển thị

        // Render trang với dữ liệu từ DB
        return res.render('index', {
            title: 'Home page',
            userName: user.username,
            onlineDevicesCount,
            avgTemperature,
            avgHumidity,
            recentAlerts,
            adviceCards, // Truyền các thẻ lời khuyên vào view
        });
    } catch (error) {
        next(error);
    }
};
