document.addEventListener('DOMContentLoaded', function () {
    // Load navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            initializeNavbar();
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Load footer
    fetch('footernew.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footernew').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});

function initializeNavbar() {
    // Get all necessary elements
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const dropdownTrigger = document.querySelector('.mobile-dropdown-trigger');
    const dropdown = document.querySelector('.mobile-dropdown');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu
    closeMenu.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Dropdown toggle
    dropdownTrigger.addEventListener('click', () => {
        dropdown.classList.toggle('active');
        dropdownTrigger.classList.toggle('active');
    });

    // Highlight current page in navigation
    highlightCurrentPage();
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu-content a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');

            // If it's in a dropdown, also highlight the parent
            const dropdownParent = link.closest('.dropdown');
            if (dropdownParent) {
                dropdownParent.classList.add('active');
            }
        }
    });
} 