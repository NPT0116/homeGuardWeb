import { WebSocketServer } from 'ws';
import { updateSensorData } from '../controllers/sensorsController.mjs';

const setupWokwiSocket = (server, clientIo) => {
    const wss = new WebSocketServer({ server, path: '/esp32' });

    wss.on('connection', (ws) => {
        console.log('ESP32 (Wokwi) connected');

        ws.on('message', async (message) => {
            // Convert Buffer to String and then parse as JSON
            try {
                const dataString = message.toString(); // Convert buffer to string
                console.log('Received message from Wokwi:', dataString);

                const data = JSON.parse(dataString); // Parse the JSON string

                // Prepare the request object for updateSensorData function
                const req = {
                    body: {
                        deviceName: data.deviceName,
                        sensor: data.sensor,
                        ...data,
                    },
                    app: {
                        get: (key) => {
                            if (key === 'clientIo') return clientIo;
                        },
                    },
                };

                const res = {
                    status: (code) => ({
                        json: (message) => console.log(`Response Status ${code}:`, message),
                    }),
                };

                const next = (error) => {
                    if (error) console.error('Error in updateSensorData:', error.message);
                };

                await updateSensorData(req, res, next);
            } catch (error) {
                console.error('Error processing message:', error.message);
            }
        });

        ws.on('close', () => {
            console.log('ESP32 (Wokwi) disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    return wss;
};

export default setupWokwiSocket;
