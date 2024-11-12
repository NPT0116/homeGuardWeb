// models/FireSensor.mjs
import mongoose from 'mongoose';

const fireSensorSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: false },
    smokeLevel: { type: Number, required: true }, // Mức độ khói hiện tại
    temperature: { type: Number, required: true }, // Nhiệt độ đo được từ cảm biến lửa
    status: { type: Boolean, required: true }, // Nhiệt độ đo được từ cảm biến lửa
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            smokeLevel: { type: Number, required: true },
            temperature: { type: Number, required: true },
            status: { type: Boolean, required: true }, // Nhiệt độ đo được từ cảm biến lửa
        },
    ],
});

export const FireSensor = mongoose.model('FireSensor', fireSensorSchema);
