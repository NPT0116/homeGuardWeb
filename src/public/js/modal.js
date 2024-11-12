// Function mở modal và thực hiện hành động
function openModal(message, confirmAction) {
    const modal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    // Cập nhật thông báo trong modal
    modalMessage.textContent = message;

    // Hiển thị modal
    modal.style.display = 'flex';

    // Khi nhấn vào nút Confirm, thực hiện hành động truyền vào
    confirmBtn.onclick = () => {
        confirmAction();
        modal.style.display = 'none'; // Đóng modal sau khi xác nhận
    };

    // Khi nhấn vào nút Cancel, đóng modal
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

// Gọi modal khi nhấn vào Logout
document.addEventListener('DOMContentLoaded', () => {
    // Tìm thẻ <a> với id logout-btn hoặc thông qua class
    const logoutLink = document.querySelector('.site-navigation a[href="/logout"]');

    // Kiểm tra xem thẻ <a> có tồn tại không trước khi gắn sự kiện
    if (logoutLink) {
        // Gắn sự kiện click cho thẻ <a>
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Ngăn chặn hành động mặc định của link
            openModal('Are you sure you want to logout?', () => {
                window.location.href = '/logout'; // Điều hướng đến trang logout sau khi Confirm
            });
        });
    }
});
