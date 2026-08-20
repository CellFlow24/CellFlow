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
let classArray = ['card-front', 'card-middle']; //'card-back', 'card-hidden'
let carouselInterval;

function rotateCards() {
    const last = classArray.pop();
    classArray.unshift(last);
    cards.forEach((card, index) => {
        card.className = 'stacked-card ' + classArray[index];
    });
}

function startStackedCarousel() {
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

// --- Mini 3D Stacked Carousel for "Trusted By" ---
const miniCards = document.querySelectorAll('.mini-card');
let miniClassArray = ['mini-front', 'mini-middle', 'mini-hidden']; //mini-back can be add
let miniInterval;

function rotateMiniCards() {
    const last = miniClassArray.pop();
    miniClassArray.unshift(last);
    miniCards.forEach((card, index) => {
        card.className = 'mini-card ' + miniClassArray[index];
    });
}

function startMiniCarousel() {
    if (miniCards.length > 0) {
        miniInterval = setInterval(rotateMiniCards, 3000); // Swipes every 3 seconds
    }
}

function stopMiniCarousel() { 
    clearInterval(miniInterval); 
}

const miniContainer = document.getElementById('trustedCarousel');
if (miniContainer) {
    // Pauses the swipe if they touch or hover over the badges
    miniContainer.addEventListener('mouseenter', stopMiniCarousel);
    miniContainer.addEventListener('mouseleave', startMiniCarousel);
    miniContainer.addEventListener('touchstart', stopMiniCarousel);
    miniContainer.addEventListener('touchend', startMiniCarousel);
    startMiniCarousel();
}

// --- Hide Floating CTA when Form is Visible ---
const ctaBtn = document.getElementById('floatingCta');
const contactSection = document.getElementById('contact');

if (ctaBtn && contactSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ctaBtn.classList.add('hidden-cta');
            } else {
                ctaBtn.classList.remove('hidden-cta');
            }
        });
    }, { threshold: 0.15 }); 
    observer.observe(contactSection);
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

// Google Sheets Form Submission & PROFESSIONAL CLOUD BLOB ANIMATION
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    var submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = "Sending...";
    submitBtn.style.opacity = "0.7";

    var webAppUrl = "https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec"; 
    
    var formData = new FormData(this);
    var inquiryType = formData.get('inquiryType');
    var originalMessage = formData.get('message');
    var selectedProduct = document.getElementById('selectedProduct').value;

    // If they ordered an app, send the product name instead of the message text
    if (inquiryType === 'Order an App') {
        if (!selectedProduct) {
            alert("Please select an application to order.");
            submitBtn.innerHTML = "Place an Order";
            submitBtn.style.opacity = "1";
            return; // Stop submission if they didn't click a product
        }
        formData.set('message', "Order Placed: " + selectedProduct);
    } else {
        formData.set('message', originalMessage);
    }
    
    fetch(webAppUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('successState').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('successBlob').classList.add('active');
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

function resetForm() {
    document.getElementById('successBlob').classList.remove('active');
    document.getElementById('successContent').classList.remove('active');
    
    setTimeout(() => {
        document.getElementById('successState').style.display = 'none';
        document.getElementById('formContainer').style.display = 'block';
    }, 400); 
}

// --- Custom Dropdown & Product Loading Logic ---
const customDropdownSelected = document.getElementById('customDropdownSelected');
const customDropdownOptions = document.getElementById('customDropdownOptions');
const inquiryTypeHidden = document.getElementById('inquiryTypeHidden');
const customOptions = document.querySelectorAll('.custom-option');

const messageBox = document.getElementById('messageBox');
const productContainer = document.getElementById('productContainer');
const submitBtn = document.getElementById('submitBtn');
const productList = document.getElementById('productList');
const selectedProductInput = document.getElementById('selectedProduct');

let productsFetched = false;

// 1. Open/Close the custom dropdown when clicked
customDropdownSelected.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevents click from instantly closing it
    customDropdownOptions.classList.toggle('open');
});

// 2. Close dropdown if the user clicks anywhere else on the screen
document.addEventListener('click', function(event) {
    if (!customDropdownSelected.contains(event.target) && !customDropdownOptions.contains(event.target)) {
        customDropdownOptions.classList.remove('open');
    }
});

// 3. Handle what happens when an option is clicked
customOptions.forEach(option => {
    option.addEventListener('click', function() {
        const selectedValue = this.getAttribute('data-value');
        
        // Update the visual text and the hidden input
        customDropdownSelected.textContent = this.textContent;
        customDropdownSelected.classList.add('has-value');
        inquiryTypeHidden.value = selectedValue;
        
        // Close the menu
        customDropdownOptions.classList.remove('open');

        // --- Logic for showing products ---
        if (selectedValue === 'Order Your App') {
            // Hide Textbox, Show Products
            messageBox.style.display = 'none';
            messageBox.removeAttribute('required');
            productContainer.style.display = 'block';
            submitBtn.innerHTML = 'Place an Order';
            
            // Fetch from G-Sheet if not already fetched
            if (!productsFetched) {
                // Injecting the premium jumping dots animation
                productList.innerHTML = `
                    <div class="loader-container">
                        <span class="loader-text">Loading</span>
                        <div class="jumping-dots">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                    </div>
                `;
                
                fetch("https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec") // <-- MAKE SURE TO PASTE YOUR ACTUAL APP SCRIPT URL HERE
                .then(res => res.json())
                .then(data => {
                    productList.innerHTML = '';
                    data.forEach(item => {
                        let div = document.createElement('div');
                        div.className = 'product-card';
                        div.innerHTML = `
                            <span class="prod-name">${item.name}</span>
                            <div class="prod-pricing">
                                <span class="price-strike">₹${item.originalPrice}</span>
                                <span class="price-final">₹${item.discountedPrice}</span>
                            </div>
                        `;
                        div.onclick = function() {
                            document.querySelectorAll('.product-card').forEach(el => el.classList.remove('selected'));
                            this.classList.add('selected');
                            selectedProductInput.value = `${item.name} (Price: ₹${item.discountedPrice})`;
                        };
                        productList.appendChild(div);
                    });
                    productsFetched = true;
                });
            }
        } else {
            // Reset to Standard Form
            messageBox.style.display = 'block';
            messageBox.setAttribute('required', 'true');
            productContainer.style.display = 'none';
            submitBtn.innerHTML = 'Send Request';
            selectedProductInput.value = ''; // clear selection
            document.querySelectorAll('.product-card').forEach(el => el.classList.remove('selected'));
        }
    });
});
