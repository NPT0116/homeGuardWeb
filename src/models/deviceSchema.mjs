// models/Device.mjs
import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
    {
        device_id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String, // Ví dụ: phòng tắm, nhà bếp
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dht22Sensor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DHT22Sensor',
        },
        fireSensor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FireSensor',
        },
        motionSensor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MotionSensor',
        },
        gasSensor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GasSensor',
        },
    },
    { timestamps: true },
);

export const Device = mongoose.model('Device', deviceSchema);
