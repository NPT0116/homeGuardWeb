document.addEventListener('DOMContentLoaded', () => {
    // Lấy URL hiện tại của trang
    const currentLocation = window.location.pathname;

    // Lấy tất cả các mục menu
    const menuItems = document.querySelectorAll('.site-navigation a');

    // Duyệt qua từng mục menu để so sánh URL
    menuItems.forEach((item) => {
        // Nếu href của mục menu trùng với URL hiện tại, thêm class active
        if (item.getAttribute('href') === currentLocation) {
            item.classList.add('active');
        }
    });
});
