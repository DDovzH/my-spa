let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact'
};

function OnStartUp() {
    popStateHandler();
}

OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    generateCaptcha();
});

document.querySelector('#gallery-link').addEventListener('click', () => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div id="gallery" style="display: grid; grid-template-columns: repeat(3, auto); gap: 10px; justify-content: center;">
            ${[...Array(9)].map((_, i) => `
                <img class="gallery-image lazy" 
                     data-src="images/image${i + 1}.jpg" 
                     alt="Image ${i + 1}" 
                     style="width: 150px; height: 150px; cursor: pointer; border: 1px solid #ddd;">
            `).join('')}
        </div>
    `;

    const images = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                obs.unobserve(img);
            }
        });
    });
    images.forEach(img => observer.observe(img));

    document.querySelectorAll('.gallery-image').forEach(img => {
        img.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${img.src}" style="width: 80%; height: auto;">
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
}

function RenderAboutPage() {
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">About Me</h1> 
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">Contact with me</h1> 
        <form id="contact-form"> 
            <label for="name">Name:</label> 
            <input type="text" id="name" name="name" required> 
            
            <label for="email">Email:</label> 
            <input type="email" id="email" name="email" required> 
            
            <label for="message">Message:</label> 
            <textarea id="message" name="message" required></textarea> 
            
            <div id="captcha-container">
                <label for="captcha">Enter the text below:</label>
                <canvas id="captcha"></canvas>
                <input type="text" id="captcha-input" name="captcha-input" required>
            </div>
            
            <button type="submit">Send</button> 
        </form>`;

    generateCaptcha();

    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        if (validateForm()) {
            alert('Form submitted successfully!');
        } else {
            alert('Form validation failed. Please check your input.');
        }
    });
}

function generateCaptcha() {
    const captchaText = Math.random().toString(36).substring(2, 8);
    const canvas = document.getElementById('captcha');
    const ctx = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 50;

    const isDarkMode = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDarkMode ? '#ffffff' : '#000000';
    ctx.font = '30px Arial';
    ctx.fillText(captchaText, 10, 35);

    canvas.dataset.captcha = captchaText;
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const captchaInput = document.getElementById('captcha-input').value.trim();
    const captcha = document.getElementById('captcha').dataset.captcha;

    if (!name || !email || !message) {
        alert('All fields are required.');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (captchaInput !== captcha) {
        alert('CAPTCHA is incorrect.');
        return false;
    }

    return true;
}

function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];

    if (loc === pageUrls.contact) { RenderContactPage(); }
    if (loc === pageUrls.about) { RenderAboutPage(); }
}

window.onpopstate = popStateHandler;
