import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import WebSocket, { WebSocketServer } from 'ws';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import router from './routes/index.mjs';
import session from 'express-session';
import connectDB from './config/configDB.mjs';
import './strategies/local-strategy.mjs';
import passport from 'passport';
import expressLayouts from 'express-ejs-layouts';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import mongoose from 'mongoose';
import customError from './utils/customError.mjs';
import globalErrorHandler from './controllers/errorController.mjs';
import authenticateEnsure from './middlewares/authenConfirm.mjs';
import morgan from 'morgan';
import http from 'http';
import setupWokwiSocket from './sockets/esp32Socket.mjs';
import setupClientIo from './sockets/clientSocket.mjs'; // Import the clientIo setup function
import PATH from './config/routes.mjs';
const app = express();
const server = http.createServer(app); // Create the HTTP server
const PORT = process.env.PORT || 3000;
import { fileURLToPath } from 'url';
import path from 'path';

// EJS View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', './src/views');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware and Configurations
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Session configuration
app.use(
    session({
        secret: 'yourSecretKey',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000, // Cookie lasts for 1 hour
            httpOnly: true,
            secure: false,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    }),
);
app.use(passport.session()); // Passport session middleware

// Set up WebSocket server for Wokwi (ESP32) connections
const clientIo = setupClientIo(server, app); // Initialize clientIo with the server
const espWs = setupWokwiSocket(server, clientIo); // Initialize Wokwi WebSocket with the server instance

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Express API with Swagger for multiple servers',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/routes/*.mjs'],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware for ensuring authentication before handling routes
app.use(authenticateEnsure);
app.use(router);

// Handle 404 errors for all non-existing routes
app.all('*', (req, res, next) => {
    const error = new customError(`Can't find ${req.originalUrl} on the server!!`, 404);
    next(error);
});

app.set('clientIo', clientIo);
app.set('espWs', espWs);
app.use(globalErrorHandler);

// Use server.listen to run the server, supporting both Express and WebSocket
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
