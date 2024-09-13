document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('#scroll-indicator .dot');
    const sections = Array.from(dots).map(dot => document.querySelector(dot.getAttribute('data-target')));
    const text = document.querySelector('#mission-statement .animate-text');
    const counters = document.querySelectorAll('.counter');

    // Update the active dot in the scroll indicator
    function updateActiveDot() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let index = sections.findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top + window.scrollY <= scrollPosition && rect.bottom + window.scrollY >= scrollPosition;
        });

        // If no section is found, default to the first dot
        if (index === -1) index = 0;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Handle animations for grid items, team members, and mission statement text
    function animateOnScroll() {
        const animateGridItems = document.querySelectorAll('.animate-grid-item');
        const teamMembers = document.querySelectorAll('.team-member');
        const windowHeight = window.innerHeight;

        // Animate grid items
        animateGridItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                item.classList.add('fadeInLeft');
            } else {
                item.classList.remove('fadeInLeft');
            }
        });

        // Animate team members
        teamMembers.forEach(member => {
            const rect = member.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                member.classList.add('fadeInUp');
            } else {
                member.classList.remove('fadeInUp');
            }
        });

        // Animate mission statement text
        const rect = text.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom >= 0) {
            text.classList.add('typewriter');
        } else {
            text.classList.remove('typewriter'); // Reset the animation
        }
    }

    // Function to update counter with animation
    function updateCounter(element, endValue) {
        let startValue = 0;
        const duration = 2000; // Total animation time in milliseconds
        const stepTime = 50; // Interval between updates
        const steps = Math.ceil(duration / stepTime);
        const increment = (endValue - startValue) / steps;

        const formatNumber = number => number.toLocaleString(); // Format number with commas

        const counterInterval = setInterval(() => {
            startValue += increment;
            if (startValue >= endValue) {
                clearInterval(counterInterval);
                startValue = endValue;
            }
            element.textContent = formatNumber(Math.floor(startValue));
        }, stepTime);
    }

    // Reset the counter and animate it again when it comes into view
    function resetCounter(element, endValue) {
        element.textContent = '0'; // Reset counter
        updateCounter(element, endValue); // Start animation
    }

    // Observer for counter elements
    const observerOptions = { threshold: 0.5 }; // Trigger when 50% of element is visible
    const observerCallback = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const endValue = parseInt(counterElement.getAttribute('data-end-value'), 10);
                resetCounter(counterElement, endValue);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Initialize counters
    counters.forEach(counter => {
        counter.setAttribute('data-end-value', counter.textContent);
        counter.textContent = '0'; // Set initial value
        observer.observe(counter);
    });

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        updateActiveDot();
        animateOnScroll();
    });

    // Initialize on page load
    updateActiveDot();
    animateOnScroll();
});

// Handle smooth scrolling behavior
document.addEventListener('wheel', function (e) {
    e.preventDefault();
    window.scrollBy({
        top: e.deltaY,
        behavior: 'smooth',
    });
}, { passive: false });

// Adjust scroll-snap behavior based on screen size
const isLaptop = window.innerWidth < 1024;
const scrollSnapStop = isLaptop ? 'normal' : 'always';
document.documentElement.style.setProperty('--scroll-snap-stop', scrollSnapStop);

document.querySelectorAll('section').forEach(section => {
    section.style.scrollSnapStop = getComputedStyle(document.documentElement).getPropertyValue('--scroll-snap-stop');
});
