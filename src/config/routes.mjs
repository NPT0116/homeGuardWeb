export const PATH = {
    HOME: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    LOGIN_STATUS: '/login/status',
    USERNAME_EXISTS: '/api/users/:username',
    PROFILE: '/profile',
    DASHBOARD: '/dashboard',
    DEVICES: {
        path: '/devices',
        outlet: {
            REGISTER: '/devices/register',
            UPDATE_SENSOR_VALUE: '/devices/api/sensors/update',
            DELETE: '/devices/delete/:deviceId',
            SENSORS: '/device/sensors',
        },
    },
    SENSORS: {
        path: '/sensor',
        outlet: {
            FIRE_DETECTION: '/sensor/fireDetection',
            UPDATE_DATA: '/sensor/update-data',
            ALL: '/sensors/all',
        },
    },
};

export default PATH;
