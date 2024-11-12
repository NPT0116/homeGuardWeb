document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.info-icon');
    const sidebar = document.querySelector('.sidebar-section');
    const container = document.querySelector('.container');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-hidden');
        container.classList.toggle('sidebar-container-hidden');
    });
});
