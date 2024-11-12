import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse(await readFile(new URL('../serviceAccount.json', import.meta.url)));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://vlcntt-1d478-default-rtdb.asia-southeast1.firebasedatabase.app',
});

/**
 * Gửi thông báo qua FCM với các tham số tùy chỉnh.
 * @param {string} token - Token của thiết bị hoặc nhóm thiết bị nhận thông báo.
 * @param {string} title - Tiêu đề của thông báo.
 * @param {string} body - Nội dung của thông báo.
 * @param {object} data - Dữ liệu đi kèm thông báo (tùy chọn).
 */
const sendCustomNotification = (token, title, body, data = {}) => {
    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: data, // Dữ liệu thêm tùy chọn
        token: token, // Token của thiết bị hoặc nhóm thiết bị nhận thông báo
    };

    // Gửi thông báo qua FCM
    admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
};

export default sendCustomNotification;
