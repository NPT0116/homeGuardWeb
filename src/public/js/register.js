document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#register-form');
    const inputs = form.querySelectorAll('.input-field');

    inputs.forEach((input) => {
        input.addEventListener('input', async () => {
            clearError(input.name);
            if (input.name === 'username') {
                await checkUsernameAvailability(input.value);
            }
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Ngăn việc gửi form mặc định
        clearErrors();
        const username = form.querySelector('input[name="username"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

        let hasError = false;

        // Kiểm tra username
        if (username.length < 5 || username.length > 32) {
            displayError('username', 'Username must be between 5 and 32 characters');
            hasError = true;
        }

        // Kiểm tra password
        if (password.length < 5 || password.length > 32) {
            displayError('password', 'Password must be between 5 and 32 characters');
            hasError = true;
        }

        // Kiểm tra confirmPassword
        if (password !== confirmPassword) {
            displayError('confirmPassword', 'Passwords do not match');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        await sendRegisterUser(username, password, email, confirmPassword);
    });
});
async function sendRegisterUser(username, password, email, confirmPassword) {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email, confirmPassword }),
        });

        // Kiểm tra mã trạng thái của phản hồi
        if (response.status === 200) {
            // Chuyển đổi response về JSON
            const data = await response.json();
            console.log(data);

            // Chuyển hướng tới trang login nếu đăng ký thành công
            window.location.href = '/login';
            console.log('reate user successfully');
        } else {
            // Nếu không phải trạng thái 200, thông báo lỗi
            console.log("Can't create user");
            const data = await response.json(); // Chuyển đổi phản hồi lỗi
            console.log(data); // In ra phản hồi lỗi
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const errorInput = document.querySelectorAll('.input-field');
    errorInput.forEach((e) => {
        e.classList.remove('error-color');
    });
    errorElements.forEach((e) => {
        e.textContent = '';
    });
}

function displayError(field, message) {
    const errorElement = document.querySelector(`.${field}-error`);
    const errorInput = document.querySelector(`input[name="${field}"]`); // Lấy input cụ thể
    errorInput.classList.add('error-color');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(field) {
    const errorElement = document.querySelector(`.${field}-error`);
    const inputElement = document.querySelector(`input[name="${field}"]`);

    if (inputElement) {
        inputElement.classList.remove('error-color');
    }

    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Hàm kiểm tra tính khả dụng của username qua API
async function checkUsernameAvailability(username) {
    if (username.length >= 5) {
        // Kiểm tra chỉ khi username đủ dài
        try {
            const response = await fetch(`/api/users/${username}`);
            const data = await response.json();

            if (data.available) {
                console.log('Username is available');
                document.querySelector('.username-error').textContent = '';
            } else {
                displayError('username', 'Username is already taken');
            }
        } catch (error) {
            console.error('Error checking username availability:', error);
        }
    }
}
