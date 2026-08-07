// Modal System (Pop-ups)
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal if user clicks outside the content box
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
}

// Google Sheets Form Submission
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload
    
    var formStatus = document.getElementById('formStatus');
    formStatus.innerHTML = "Sending request...";
    formStatus.style.color = "blue";

    // REPLACE THE URL BELOW WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    var webAppUrl = "https://script.google.com/macros/s/AKfycbxi5eKscJULcVf9ygblyu3MJqLAaHLAaqEk5_VN7DTe1e4BSOeE_gk9xvwaNkGF4mq4yQ/exec"; 
    
    var formData = new FormData(this);

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
