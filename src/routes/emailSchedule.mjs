import { Router } from 'express';
import cron from 'node-cron';
import sendEmail from '../utils/emailUtil.mjs';
import customError from '../utils/customError.mjs';

const emailScheduleRouter = Router();

const getDailyAvgData = async () => {
    const avgTemperature = 25;
    const avgHumidity = 40;
    return { avgTemperature, avgHumidity };
};

const sendDailyEmailReport = async () => {
    const { avgTemperature, avgHumidity } = await getDailyAvgData();
    const emailContent = `Daily Report:\n\nAverage Temperature: ${avgTemperature}°C\nAverage Humidity: ${avgHumidity}%`;
    await sendEmail('phucthanh1601@gmail.com', 'Daily Temperature and Humidity Report', emailContent, (err) => {
        if (err) {
            console.error('Failed to send daily report:', err.message);
        }
    });
};
cron.schedule('0 9 * * *', sendDailyEmailReport);

emailScheduleRouter.get('/email/daily-report', async (req, res, next) => {
    try {
        await sendDailyEmailReport();
        res.status(200).json({ msg: 'successfully send daily report email' });
    } catch (e) {
        next(new customError(e, 500));
    }
});

export default emailScheduleRouter;
