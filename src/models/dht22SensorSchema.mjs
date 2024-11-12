// models/DHT22Sensor.mjs
import mongoose from 'mongoose';

const dht22SensorSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: false },
    temperature: { type: Number, required: true }, // Giá trị nhiệt độ hiện tại
    humidity: { type: Number, required: true }, // Giá trị độ ẩm hiện tại
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            temperature: { type: Number, required: true },
            humidity: { type: Number, required: true },
        },
    ],
});

export const DHT22Sensor = mongoose.model('DHT22Sensor', dht22SensorSchema);
