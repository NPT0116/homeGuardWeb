// models/MotionSensor.mjs
import mongoose from 'mongoose';

const motionSensorSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: false },
    isMotionDetected: { type: Boolean, default: true }, // Trạng thái phát hiện chuyển động
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            isMotionDetected: { type: Boolean, required: true },
        },
    ],
});

export const MotionSensor = mongoose.model('MotionSensor', motionSensorSchema);
