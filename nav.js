document.addEventListener('DOMContentLoaded', function () {
    const root = document.documentElement;
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;
    const navLinks = nav.querySelector('.nav-links');
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');

    function currentSystemTheme() {
        return themeMedia.matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        root.style.colorScheme = theme;
    }

    function updateThemeButton(themeButton) {
        const activeTheme = root.getAttribute('data-theme') || currentSystemTheme();
        themeButton.textContent = activeTheme === 'dark' ? '☾' : '☀';
        themeButton.setAttribute('aria-label', 'Switch to ' + (activeTheme === 'dark' ? 'light' : 'dark') + ' mode');
        themeButton.setAttribute('title', 'Switch to ' + (activeTheme === 'dark' ? 'light' : 'dark') + ' mode');
    }

    const savedTheme = localStorage.getItem('theme-preference');
    applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : currentSystemTheme());

    function closeMenu() {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    if (navLinks) {
        const themeButton = document.createElement('button');
        themeButton.type = 'button';
        themeButton.className = 'nav-theme-toggle';
        updateThemeButton(themeButton);

        themeButton.addEventListener('click', function () {
            const activeTheme = root.getAttribute('data-theme') || currentSystemTheme();
            const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('theme-preference', nextTheme);
            updateThemeButton(themeButton);
        });

        navLinks.appendChild(themeButton);

        themeMedia.addEventListener('change', function () {
            if (!localStorage.getItem('theme-preference')) {
                applyTheme(currentSystemTheme());
                updateThemeButton(themeButton);
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (nav.classList.contains('nav--open') && !nav.contains(e.target)) {
            closeMenu();
        }
    });
});
