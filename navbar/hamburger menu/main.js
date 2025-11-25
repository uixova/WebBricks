const hamburgerToggle = document.getElementById('hamburger-toggle');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('active');

    const icon = hamburgerToggle.querySelector('i');
    icon.classList = mobileMenu.classList.contains('active')
        ? 'fas fa-times'
        : 'fas fa-bars';
});

document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburgerToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburgerToggle.querySelector('i').classList = 'fas fa-bars';
    }
});