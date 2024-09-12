document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('#scroll-indicator .dot');
    const sections = Array.from(dots).map(dot => document.querySelector(dot.getAttribute('data-target')));
    const title = document.querySelector('#title .animate-title');

    function updateActiveDot() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let index = sections.findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top + window.scrollY <= scrollPosition && rect.bottom + window.scrollY >= scrollPosition;
        });

        if (index === -1) index = 0; // Default to first dot if none found

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function animateOnScroll() {
        const animateGridItems = document.querySelectorAll('.animate-grid-item');
        const teamMembers = document.querySelectorAll('.team-member');
        const windowHeight = window.innerHeight;

        // Animate grid items
        animateGridItems.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                element.classList.add('fadeInLeft');
            } else {
                element.classList.remove('fadeInLeft');
            }
        });

        // Animate team member cards
        teamMembers.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                element.classList.add('fadeInUp');
            } else {
                element.classList.remove('fadeInUp');
            }
        });

        // Animate title
        const rect = title.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom >= 0) {
            title.classList.add('typewriter');
        } else {
            title.classList.remove('typewriter'); // Remove class to reset animation
        }
    }

    window.addEventListener('scroll', () => {
        updateActiveDot();
        animateOnScroll(); // Check for animations on scroll
    });

    updateActiveDot(); // Initialize on page load
    animateOnScroll(); // Initialize on page load
});

let lastScrollTop = 0;
const topBar = document.querySelector('.top-bar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop < lastScrollTop) {
        topBar.classList.add('show'); // Scroll up: show bar
    } else {
        topBar.classList.remove('show'); // Scroll down: hide bar
    }

    lastScrollTop = scrollTop;
});
