import { Device } from '../models/deviceSchema.mjs';
import { FireSensor } from '../models/sensorModels.mjs';
import sendEmail from '../utils/emailUtil.mjs';

export const fireDetection = async (req, res, next) => {
    try {
        const { deviceId, temperature, smokeLevel, status } = req.body;

        // Tìm thiết bị theo deviceId và lấy thông tin cảm biến lửa
        const device = await Device.findOne({ device_id: deviceId }).populate('fireSensor').populate('owner');

        if (!device || !device.fireSensor) {
            return res.status(404).send('Device or fire sensor not found');
        }

        const fireSensor = await FireSensor.findById(device.fireSensor._id);

        // Xác định trạng thái cháy dựa trên ngưỡng nhiệt độ và khói

        // Cập nhật giá trị và trạng thái cảm biến lửa
        fireSensor.temperature = temperature;
        fireSensor.smokeLevel = smokeLevel;
        fireSensor.status = status;

        // Thêm thông tin vào lịch sử của fireSensor
        fireSensor.history.push({
            timestamp: new Date(),
            temperature,
            smokeLevel,
            status,
        });

        await fireSensor.save();

        // Nếu trạng thái cháy là `true`, gửi email cảnh báo và thông báo qua Socket.IO
        if (status) {
            const emailContent = `Cảnh báo: Đã phát hiện dấu hiệu cháy tại ${device.location}. Nhiệt độ: ${temperature}°C, Mức độ khói: ${smokeLevel}. Hãy kiểm tra ngay lập tức.`;
            await sendEmail(device.owner.email, 'Cảnh báo cháy nổ tức thời', emailContent);

            req.app.get('io').emit('fireAlert', {
                location: device.location,
                temperature,
                smokeLevel,
            });
        }

        return res.status(200).send('Fire alert handled and saved to history successfully');
    } catch (error) {
        next(error);
    }
};
