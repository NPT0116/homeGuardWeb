// models/FireSensor.mjs
import mongoose from 'mongoose';

const fireSensorSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: false },
    status: { type: Boolean, required: true }, // Nhiệt độ đo được từ cảm biến lửa
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            status: { type: Boolean, required: true }, // Nhiệt độ đo được từ cảm biến lửa
        },
    ],
});

export const FireSensor = mongoose.model('FireSensor', fireSensorSchema);
