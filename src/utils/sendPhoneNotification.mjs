import axios from 'axios';

const utilSendPhoneNotification = async (title, message) => {
    const pushsaferApiKey = '5glaCnNC5ogc9NGVleYI'; // Thay bằng API Key của bạn
    const pushsaferUrl = 'https://www.pushsafer.com/api';

    try {
        const response = await axios.post(pushsaferUrl, null, {
            params: {
                k: pushsaferApiKey, // API key của bạn
                t: title, // Tiêu đề thông báo
                m: message, // Nội dung thông báo
            },
        });

        console.log('Notification sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending notification:', error.message);
    }
};

export default utilSendPhoneNotification;
