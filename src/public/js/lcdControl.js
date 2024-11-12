const socket = io();

document.getElementById('submitBtn').addEventListener('click', () => {
    // Get selected device ID and mode
    const deviceId = document.getElementById('deviceSelect').value;
    const mode = document.getElementById('modeSelect').value;

    // Send the device ID and mode to the server
    socket.emit('lcd-control', { deviceId, mode });
    console.log(`Sent device ID: ${deviceId} and mode: ${mode} to server`);
});
