import mongoose from 'mongoose';

const gasSensorSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: false },
    status: { type: Boolean, required: true }, // Trạng thái phát hiện khí gas
    gasLevel: { type: Number, required: true }, // Mức độ khí gas
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            status: Boolean,
            gasLevel: Number,
        },
    ],
});

export const GasSensor = mongoose.model('GasSensor', gasSensorSchema);
