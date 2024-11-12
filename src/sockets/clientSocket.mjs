import { Server as SocketIOServer } from 'socket.io';

const setupClientIo = (server, app) => {
    const clientIo = new SocketIOServer(server); // Create Socket.IO instance for clients

    // Set up event listeners
    clientIo.on('connection', (socket) => {
        console.log('Web client connected:', socket.id);

        socket.on('setUserId', (userId) => {
            socket.userId = userId;
        });

        // Listen for 'lcd-control' events from the web client
        socket.on('lcd-control', (data) => {
            const { deviceId, mode } = data;
            console.log(`Received LCD control command for device ${deviceId} with mode ${mode}`);

            // Send the deviceId and mode to the ESP32 WebSocket
            const espWs = app.get('espWs');
            if (espWs && espWs.clients.size > 0) {
                const message = JSON.stringify({ deviceId, sensor: 'lcd', mode });
                espWs.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        // No need to reference WebSocket directly
                        client.send(message);
                        console.log(`Sent to ESP32: ${message}`);
                    }
                });
            } else {
                console.log('ESP32 is not connected');
            }
        });

        socket.on('disconnect', () => {
            console.log('Web client disconnected:', socket.id);
        });
    });

    return clientIo; // Return the configured instance
};

export default setupClientIo;
