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

// --- Toptal-Style Stacked Carousel Logic ---
const cards = document.querySelectorAll('.stacked-card');
let classArray = ['card-front', 'card-middle', 'card-back'];
let carouselInterval;

function rotateCards() {
    const last = classArray.pop();
    classArray.unshift(last);
    cards.forEach((card, index) => {
        card.className = 'stacked-card ' + classArray[index];
    });
}

function startStackedCarousel() {
    // Only run if the cards actually exist on the page
    if (cards.length > 0) {
        carouselInterval = setInterval(rotateCards, 3500);
    }
}
function stopStackedCarousel() { clearInterval(carouselInterval); }

const carouselContainer = document.getElementById('feedbackCarousel');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopStackedCarousel);
    carouselContainer.addEventListener('mouseleave', startStackedCarousel);
    carouselContainer.addEventListener('touchstart', stopStackedCarousel);
    carouselContainer.addEventListener('touchend', startStackedCarousel);
    startStackedCarousel();
}

// Modal System (Pop-ups)
function openModal(modalId) { document.getElementById(modalId).style.display = 'block'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}
function slideGallery(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const scrollAmount = slider.clientWidth; 
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Google Sheets Form Submission & CLOUD BLAST ANIMATION
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    var submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = "Sending...";
    submitBtn.style.opacity = "0.7";

    var webAppUrl = "https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec"; 
    
    var formData = new FormData(this);
    var inquiryType = formData.get('inquiryType');
    var originalMessage = formData.get('message');
    formData.set('message', "[Type: " + inquiryType + "] " + originalMessage);

    fetch(webAppUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // --- TRIGGER THE MAGICAL CLOUD BLAST ---
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('successState').style.display = 'block';
        
        // Slight delay to allow display:block to register before animating
        setTimeout(() => {
            document.getElementById('blastCircle').classList.add('active');
            document.getElementById('successContent').classList.add('active');
        }, 50);

        document.getElementById('leadForm').reset();
        submitBtn.innerHTML = "Send Request";
        submitBtn.style.opacity = "1";
    })
    .catch(error => {
        submitBtn.innerHTML = "Error! Try Again";
        submitBtn.style.backgroundColor = "red";
    });
});

// Function to reset the form if the user wants to send another message
function resetForm() {
    document.getElementById('blastCircle').classList.remove('active');
    document.getElementById('successContent').classList.remove('active');
    
    setTimeout(() => {
        document.getElementById('successState').style.display = 'none';
        document.getElementById('formContainer').style.display = 'block';
    }, 400); // Wait for fade out
}
