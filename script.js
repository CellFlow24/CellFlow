// Force browser to start at the top of the page on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
};

// Scroll Reveal Animations
function revealElements() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', revealElements);
revealElements();

// --- NEW: Auto-Swiping Feedback Carousel ---
const feedbackTrack = document.getElementById('feedbackTrack');
let autoScrollInterval;

function startCarousel() {
    autoScrollInterval = setInterval(() => {
        // If we reached the end, scroll back to the start smoothly
        if (feedbackTrack.scrollLeft + feedbackTrack.clientWidth >= feedbackTrack.scrollWidth - 10) {
            feedbackTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Scroll right by exactly one card width
            feedbackTrack.scrollBy({ left: feedbackTrack.clientWidth, behavior: 'smooth' });
        }
    }, 3500); // Swipes every 3.5 seconds
}

function stopCarousel() {
    clearInterval(autoScrollInterval);
}

if (feedbackTrack) {
    // Pause animation when mouse hovers or finger touches the screen
    feedbackTrack.addEventListener('mouseenter', stopCarousel);
    feedbackTrack.addEventListener('mouseleave', startCarousel);
    feedbackTrack.addEventListener('touchstart', stopCarousel);
    feedbackTrack.addEventListener('touchend', startCarousel);
    
    // Start it when the page loads
    startCarousel();
}

// Modal System (Pop-ups)
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// Image Gallery Slider function (for Modals)
function slideGallery(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const scrollAmount = slider.clientWidth; 
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Google Sheets Form Submission
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    var formStatus = document.getElementById('formStatus');
    formStatus.innerHTML = "Sending request...";
    formStatus.style.color = "#0056b3"; 

    var webAppUrl = "https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec"; 
    
    var formData = new FormData(this);
    
    var inquiryType = formData.get('inquiryType');
    var originalMessage = formData.get('message');
    var combinedMessage = "[Type: " + inquiryType + "] " + originalMessage;
    formData.set('message', combinedMessage);

    fetch(webAppUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        formStatus.innerHTML = "Request sent successfully! We will contact you soon.";
        formStatus.style.color = "green";
        document.getElementById('leadForm').reset();
    })
    .catch(error => {
        formStatus.innerHTML = "Error sending request. Please try again.";
        formStatus.style.color = "red";
    });
});
