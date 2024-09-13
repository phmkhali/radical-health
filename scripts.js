document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('#scroll-indicator .dot');
    const sections = Array.from(dots).map(dot => document.querySelector(dot.getAttribute('data-target')));
    const text = document.querySelector('#mission-statement .animate-text');
    const counters = document.querySelectorAll('.counter');

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

        // Animate text
        const rect = text.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom >= 0) {
            text.classList.add('typewriter');
        } else {
            text.classList.remove('typewriter'); // Remove class to reset animation
        }
    }

    function updateCounter(element, endValue) {
        let startValue = 0;
        const duration = 2000; // Duration of the animation in milliseconds
        const stepTime = 50; // Interval between updates in milliseconds
        const steps = Math.ceil(duration / stepTime);
        const increment = (endValue - startValue) / steps;

        const formatNumber = (number) => {
            return number.toLocaleString(); // Format number with thousands separators
        };

        const counterInterval = setInterval(() => {
            startValue += increment;
            if (startValue >= endValue) {
                clearInterval(counterInterval);
                startValue = endValue;
            }
            element.textContent = formatNumber(Math.floor(startValue));
        }, stepTime);
    }

    function resetCounter(element, endValue) {
        element.textContent = '0'; // Reset counter to initial value
        updateCounter(element, endValue); // Start animation
    }

    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the element is in view
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const endValue = parseInt(counterElement.getAttribute('data-end-value'), 10);
                resetCounter(counterElement, endValue);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    counters.forEach(counter => {
        counter.setAttribute('data-end-value', counter.textContent); // Set the end value
        counter.textContent = '0'; // Set initial value
        observer.observe(counter); // Start observing the element
    });

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

document.addEventListener('wheel', function(e) {
    e.preventDefault();
    let scrollAmount = e.deltaY;
    window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
    });
}, { passive: false });
