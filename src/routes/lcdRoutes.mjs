import express from 'express';
import { renderLcd } from '../controllers/lcdController.mjs';
const lcdRouter = express.Router();

lcdRouter.get('/lcd', renderLcd);

export default lcdRouter;
