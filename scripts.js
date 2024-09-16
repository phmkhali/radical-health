document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('#scroll-indicator .dot');
    const sections = Array.from(dots).map(dot => {
        const targets = dot.getAttribute('data-target').split(',');
        return targets.map(target => document.querySelector(target));
    }); 
    const text = document.querySelector('#mission-statement .animate-text');
    const counters = document.querySelectorAll('.counter');
    const landingText = document.querySelector('.landing-text');
    const subheader = document.querySelector('.subheader');

    // Update the active dot in the scroll indicator
    function updateActiveDot() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let index = sections.findIndex(sectionArray => sectionArray.some(section => {
            const rect = section.getBoundingClientRect();
            return rect.top + window.scrollY <= scrollPosition && rect.bottom + window.scrollY >= scrollPosition;
        }));

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Add scroll event listener for the dots
    dots.forEach((dot, dotIndex) => {
        dot.addEventListener('click', () => {
            const targets = sections[dotIndex];
            targets.forEach((target, index) => {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, index * 500); // Add delay between scrolls for each section
            });
        });
    });

    // Function to handle visibility and animations
    function handleVisibilityAndAnimation() {
        const windowHeight = window.innerHeight;

        // Animate grid items
        document.querySelectorAll('.animate-grid-item').forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                item.classList.add('fadeInLeft');
            } else {
                item.classList.remove('fadeInLeft');
            }
        });

        // Animate team members
        document.querySelectorAll('.team-member').forEach(member => {
            const rect = member.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom >= 0) {
                member.classList.add('fadeInUp');
            } else {
                member.classList.remove('fadeInUp');
            }
        });

        // Animate mission statement text
        const textRect = text.getBoundingClientRect();
        if (textRect.top < windowHeight && textRect.bottom >= 0) {
            text.classList.add('typewriter');
        } else {
            text.classList.remove('typewriter'); // Reset the animation
        }

        // Animate landing text and subheader
        const landingRect = landingText.getBoundingClientRect();
        if (landingRect.top < windowHeight && landingRect.bottom >= 0) {
            landingText.classList.add('visible');
            setTimeout(() => {
                subheader.classList.add('visible');
            }, 100); // Tiny delay before subheader appears
        } else {
            landingText.classList.remove('visible');
            subheader.classList.remove('visible'); // Reset subheader
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
        handleVisibilityAndAnimation();
    });

    // Initialize on page load
    updateActiveDot();
    handleVisibilityAndAnimation();
});

// Handle smooth scrolling behavior
document.addEventListener('wheel', function (e) {
    e.preventDefault();
    window.scrollBy({
        top: e.deltaY,
        behavior: 'smooth',
    });
}, { passive: false });


