import { Router } from 'express';
import PATH from '../config/routes.mjs';
import { Device } from '../models/deviceSchema.mjs';
const profileRouter = Router();

profileRouter.get(PATH.PROFILE, async (req, res) => {
    const userId = req.user._id;

    const deviceCount = await Device.countDocuments({ owner: userId });

    return res.render('profile', { title: 'profile page', user: req.user, deviceCount });
});
export default profileRouter;
