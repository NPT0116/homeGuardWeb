export const regenerateSessionAndLogin = async (req, user, callback) => {
    try {
        // Đợi việc tạo session hoàn tất
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

        // Đợi việc đăng nhập hoàn tất
        await new Promise((resolve, reject) => {
            req.logIn(user, (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('User logged in:', user); // Kiểm tra người dùng đã đăng nhập
                console.log('Session after login:', req.session); // Kiểm tra session sau khi đăng nhập
                resolve();
            });
        });

        return callback(null); // Không có lỗi, callback được gọi với giá trị null
    } catch (err) {
        return callback(err); // Gọi callback với lỗi nếu có
    }
};
