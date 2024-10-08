// Play audio
const backgroundAudio = document.getElementById('backgroundAudio');
const hoverSound = document.getElementById('hoverSound');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
let isSoundEnabled = false; 

// Set initial volume
backgroundAudio.volume = 0.5;

// Play hover sound
const hoverElements = document.querySelectorAll('.btn-primary, .team-member');

hoverElements.forEach(hoverElement => {
  let isPlaying = false;

  hoverElement.addEventListener('mousemove', () => {
    if (isSoundEnabled && !isPlaying) {
      hoverSound.currentTime = 0; 
      hoverSound.play();
      isPlaying = true;
    }
  });

  hoverElement.addEventListener('mouseleave', () => {
    isPlaying = false;
  });
});

// Toggle sound
soundToggle.addEventListener('click', () => {
  isSoundEnabled = !isSoundEnabled;
  if (isSoundEnabled) {
    backgroundAudio.volume = 0.5; // Restore volume
    soundIcon.src = 'assets/unmute.svg'; // Set icon to unmute

    // Play background audio if not already playing
    if (backgroundAudio.paused) {
      backgroundAudio.play();
    }
  } else {
    backgroundAudio.volume = 0; // Mute volume
    soundIcon.src = 'assets/mute.svg'; // Set icon to mute
    backgroundAudio.pause(); 
  }

  backgroundAudio.muted = !isSoundEnabled; 
});


// Animations
document.addEventListener("DOMContentLoaded", () => {
  const dots = document.querySelectorAll("#scroll-indicator .dot");
  const sections = Array.from(dots).map((dot) => {
    const targets = dot.getAttribute("data-target").split(",");
    return targets.map((target) => document.querySelector(target));
  });
  const text = document.querySelector("#mission-statement .animate-text");
  const counters = document.querySelectorAll(".counter");
  const landingText = document.querySelector(".landing-text");
  const subheader = document.querySelector(".subheader");

  // Update the active dot in the scroll indicator
  function updateActiveDot() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let index = sections.findIndex((sectionArray) =>
      sectionArray.some((section) => {
        const rect = section.getBoundingClientRect();
        return (
          rect.top + window.scrollY <= scrollPosition &&
          rect.bottom + window.scrollY >= scrollPosition
        );
      })
    );

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // Add scroll event listener for the dots
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      const targets = sections[dotIndex];
      targets.forEach((target, index) => {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, index * 500); // Add delay between scrolls for each section
      });
    });
  });

  // Function to handle visibility and animations
  function handleVisibilityAndAnimation() {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    // Animate grid items
    document.querySelectorAll(".animate-grid-item").forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom >= 0) {
        item.classList.add("fadeInRight");
      } else {
        item.classList.remove("fadeInRight");
      }
    });

    // Animate team members
    document.querySelectorAll(".team-member").forEach((member) => {
      const rect = member.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom >= 0) {
        member.classList.add("fadeInUp");
      } else {
        member.classList.remove("fadeInUp");
      }
    });

    // Animate mission statement text
    const textRect = text.getBoundingClientRect();
    if (textRect.top < windowHeight && textRect.bottom >= 0) {
      text.classList.add("typewriter");
    } else {
      text.classList.remove("typewriter"); // Reset the animation
    }

    // Animate landing text and subheader
    const landingRect = landingText.getBoundingClientRect();
    if (landingRect.top < windowHeight && landingRect.bottom >= 0) {
      landingText.classList.add("visible");
      setTimeout(() => {
        subheader.classList.add("visible");
      }, 100); // Tiny delay before subheader appears
    } else {
      landingText.classList.remove("visible");
      subheader.classList.remove("visible"); // Reset subheader
    }

  // Animate data content
  const dataContentRect = document.querySelector('.data-content').getBoundingClientRect();
  if (dataContentRect.top < windowHeight && dataContentRect.bottom >= 0) {
    const visibilityRatio = (dataContentRect.bottom - scrollPosition) / windowHeight;
    if (visibilityRatio <= 0.5) {
      document.querySelector('.data-content').classList.add('visible');
      document.querySelector('.data-content').classList.remove('partially-visible');
    } else {
      document.querySelector('.data-content').classList.add('partially-visible');
      document.querySelector('.data-content').classList.remove('visible');
    }
  } else {
    document.querySelector('.data-content').classList.remove('visible');
    document.querySelector('.data-content').classList.remove('partially-visible');
  }
  }

  // Function to update counter with animation
  function updateCounter(element, endValue) {
    let startValue = 0;
    const duration = 2000; // Total animation time in milliseconds
    const stepTime = 50; // Interval between updates
    const steps = Math.ceil(duration / stepTime);
    const increment = (endValue - startValue) / steps;

    const formatNumber = (number) => number.toLocaleString(); // Format number with commas

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
    element.textContent = "0"; // Reset counter
    updateCounter(element, endValue); // Start animation
  }

  // Observer for counter elements
  const observerOptions = { threshold: 0.5 }; // Trigger when 50% of element is visible
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counterElement = entry.target;
        const endValue = parseInt(
          counterElement.getAttribute("data-end-value"),
          10
        );
        resetCounter(counterElement, endValue);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Initialize counters
  counters.forEach((counter) => {
    counter.setAttribute("data-end-value", counter.textContent);
    counter.textContent = "0"; // Set initial value
    observer.observe(counter);
  });

  // Add scroll event listener
  window.addEventListener("scroll", () => {
    updateActiveDot();
    handleVisibilityAndAnimation();
  });

  // Initialize on page load
  updateActiveDot();
  handleVisibilityAndAnimation();
});
