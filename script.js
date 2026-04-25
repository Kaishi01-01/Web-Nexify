const premiumApps = [
    { id: 1, name: "Netflix UHD", price: "Rp 25.000", img: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png" },
    { id: 2, name: "Spotify Prem", price: "Rp 15.000", img: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
    { id: 3, name: "YouTube Prem", price: "Rp 10.000", img: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" },
    { id: 4, name: "Canva Pro", price: "Rp 12.000", img: "https://www.vectorlogo.zone/logos/canva/canva-icon.svg" },
    { id: 5, name: "ChatGPT Plus", price: "Rp 50.000", img: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { id: 6, name: "Disney+ Hot", price: "Rp 20.000", img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
];

function renderHome() {
    const container = document.getElementById('app-list');
    container.innerHTML = premiumApps.map(app => `
        <div class="app-card" onclick="openProduct(${app.id})">
            <div class="app-icon-box">
                <img src="${app.img}" alt="${app.name}" style="width: 45px;">
            </div>
            <h4>${app.name}</h4>
            <p class="price-tag">${app.price}</p>
        </div>
    `).join('');
}

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openProduct(id) {
    const app = premiumApps.find(a => a.id === id);
    alert(`Membuka halaman detail: ${app.name}\nSiapkan metode pembayaranmu!`);
}

// Inisialisasi saat load
document.addEventListener('DOMContentLoaded', () => {
    renderHome();
});
