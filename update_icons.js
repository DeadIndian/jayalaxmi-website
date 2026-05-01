const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Add lucide script
html = html.replace('<link rel="stylesheet" href="styles.css" />', '<link rel="stylesheet" href="styles.css" />\n\t\t<script src="https://unpkg.com/lucide@latest"></script>');

// Replace icons in Why Us
html = html.replace('<img src="assets/images/icons/fleet.svg" alt="Large Fleet" class="why-icon-img">', '<i data-lucide="truck" class="why-icon-img"></i>');
html = html.replace('<img src="assets/images/icons/service.svg" alt="Expert Service" class="why-icon-img">', '<i data-lucide="wrench" class="why-icon-img"></i>');
html = html.replace('<img src="assets/images/icons/price.svg" alt="Competitive Pricing" class="why-icon-img">', '<i data-lucide="indian-rupee" class="why-icon-img"></i>');
html = html.replace('<img src="assets/images/icons/location.svg" alt="Based in Hyderabad" class="why-icon-img">', '<i data-lucide="map-pin" class="why-icon-img"></i>');

// Replace icons in About
html = html.replace('<img src="assets/images/icons/sales.svg" alt="Sales" class="about-icon">', '<i data-lucide="shopping-cart" class="about-icon"></i>');
html = html.replace('<img src="assets/images/icons/location-pin.svg" alt="Location" class="about-icon">', '<i data-lucide="map-pin" class="about-icon"></i>');
html = html.replace('<img src="assets/images/icons/repair.svg" alt="Repair" class="about-icon">', '<i data-lucide="tool" class="about-icon"></i>');
html = html.replace('<img src="assets/images/icons/handshake.svg" alt="Handshake" class="about-icon">', '<i data-lucide="handshake" class="about-icon"></i>');

// Replace icons in Contact
html = html.replace('<img src="assets/images/icons/phone.svg" alt="Phone" class="contact-icon-img">', '<i data-lucide="phone" class="contact-icon-img"></i>');
html = html.replace('<img src="assets/images/icons/email.svg" alt="Email" class="contact-icon-img">', '<i data-lucide="mail" class="contact-icon-img"></i>');
html = html.replace('<img src="assets/images/icons/address.svg" alt="Address" class="contact-icon-img">', '<i data-lucide="map-pin" class="contact-icon-img"></i>');
html = html.replace('<img src="assets/images/icons/clock.svg" alt="Hours" class="contact-icon-img">', '<i data-lucide="clock" class="contact-icon-img"></i>');

fs.writeFileSync('index.html', html);
