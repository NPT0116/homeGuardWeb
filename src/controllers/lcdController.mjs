import { Device } from '../models/deviceSchema.mjs';

export const renderLcd = async (req, res, next) => {
    const userId = req.user._id;
    const devices = await Device.find({ owner: userId });
    if (!devices.length) {
        return res.status(404).send('No devices found for this user');
    }
    return res.render('lcd', { title: 'LCD page', devices });
};
