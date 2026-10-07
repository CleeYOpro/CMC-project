// Reserve the navbar's height before it loads so the page doesn't jump down
// when navbar.html arrives.
document.head.insertAdjacentHTML('beforeend',
    '<style>#navbar{min-height:72px;background:#002855}' +
    '@media (min-width:1100px){#navbar{min-height:100px}}</style>');

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
    const footer = document.getElementById('footernew');
    if (footer) {
        fetch('footernew.html')
            .then(response => response.text())
            .then(data => {
                footer.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});

function initializeNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileTrigger = document.querySelector('.mobile-dropdown-trigger');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const dropdownItem = document.querySelector('.nav-item.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const desktopQuery = window.matchMedia('(min-width: 1100px)');

    // ---------- Mobile menu ----------
    function openMenu() {
        mobileMenu.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('nav-open');
        // Wait for the menu to become visible before moving focus into it
        requestAnimationFrame(() => closeMenu.focus());
    }

    function closeMobileMenu(returnFocus) {
        if (!mobileMenu.classList.contains('active')) return;
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('nav-open');
        if (returnFocus) hamburger.focus();
    }

    hamburger.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', () => closeMobileMenu(true));

    mobileTrigger.addEventListener('click', () => {
        const expanded = mobileTrigger.getAttribute('aria-expanded') === 'true';
        mobileTrigger.setAttribute('aria-expanded', String(!expanded));
        mobileDropdown.hidden = expanded;
    });

    // Close the menu after picking a link (matters for same-page/back-forward nav)
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeMobileMenu(false));
    });

    // Keep keyboard focus inside the open menu
    mobileMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const focusable = Array.from(mobileMenu.querySelectorAll('a[href], button'))
            .filter(el => el.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    // Rotating a tablet / resizing into desktop width shouldn't leave the page locked
    desktopQuery.addEventListener('change', (e) => {
        if (e.matches) closeMobileMenu(false);
    });

    // Restored from the back/forward cache with the menu still open
    window.addEventListener('pageshow', () => closeMobileMenu(false));

    // ---------- Desktop "Resources" dropdown ----------
    function setDropdown(open) {
        dropdownMenu.classList.toggle('open', open);
        dropdownToggle.setAttribute('aria-expanded', String(open));
    }

    dropdownToggle.addEventListener('click', () => {
        setDropdown(dropdownToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close when focus or a tap moves outside the dropdown
    dropdownItem.addEventListener('focusout', (e) => {
        if (!dropdownItem.contains(e.relatedTarget)) setDropdown(false);
    });
    document.addEventListener('click', (e) => {
        if (!dropdownItem.contains(e.target)) setDropdown(false);
    });

    // ---------- Escape closes whatever is open ----------
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu(true);
        } else if (dropdownMenu.classList.contains('open')) {
            setDropdown(false);
            dropdownToggle.focus();
        }
    });

    setUpSkipLink();
    highlightCurrentPage();
}

// The skip link jumps to the first element after the navbar
function setUpSkipLink() {
    if (document.getElementById('main-content')) return;
    let target = document.getElementById('navbar').nextElementSibling;
    while (target && /^(SCRIPT|STYLE|LINK)$/.test(target.tagName)) {
        target = target.nextElementSibling;
    }
    const skipLink = document.querySelector('.skip-link');
    if (!target) {
        skipLink.remove();
        return;
    }
    target.id = target.id || 'main-content';
    target.setAttribute('tabindex', '-1');
    target.style.outline = 'none';
    skipLink.setAttribute('href', '#' + target.id);
}

function highlightCurrentPage() {
    // Works for both "/aboutus.html" and clean URLs like "/aboutus"
    const normalize = (path) => {
        const page = path.split('/').pop().replace(/\.html$/i, '').toLowerCase();
        return page || 'index';
    };
    const currentPage = normalize(window.location.pathname);
    const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu-content a');

    navLinks.forEach(link => {
        if (normalize(link.getAttribute('href')) === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
    });
}
