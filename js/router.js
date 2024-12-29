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
            
            <!-- Google reCAPTCHA -->
            <div class="g-recaptcha" data-sitekey="6LeEDqkqAAAAAAbwNGyWM0pBHPkSaSc4H4TYF0qe"></div>
            
            <button type="submit">Submit</button> 
        </form>`;
    
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const token = grecaptcha.getResponse();
    if (!token) {
        alert('Please complete the reCAPTCHA.');
        return;
    }

    const secretKey = '6LeEDqkqAAAAAKlRkCeVdW--MMoLmNTHTg5YGQRv';
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const response = await fetch(verificationURL, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            alert('Captcha passed! Form is valid.');
        } else {
            alert('Captcha failed! Please try again.');
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        alert('Error verifying reCAPTCHA. Please try again later.');
    }

    grecaptcha.reset();
}

function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];

    if (loc === pageUrls.contact) { RenderContactPage(); }
    if (loc === pageUrls.about) { RenderAboutPage(); }
}

window.onpopstate = popStateHandler;
