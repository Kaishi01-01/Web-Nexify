// Daftar Aplikasi Premium Terlengkap
const apps = [
    { id: 1, name: "Netflix UHD", price: "Rp 25.000", img: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png" },
    { id: 2, name: "Spotify Prem", price: "Rp 15.000", img: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
    { id: 3, name: "YouTube Prem", price: "Rp 10.000", img: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" },
    { id: 4, name: "Canva Pro", price: "Rp 12.000", img: "https://www.vectorlogo.zone/logos/canva/canva-icon.svg" },
    { id: 5, name: "ChatGPT Plus", price: "Rp 50.000", img: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { id: 6, name: "Disney+ Hot", price: "Rp 20.000", img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
    { id: 7, name: "Alight Motion", price: "Rp 15.000", img: "https://static.wikia.nocookie.net/logopedia/images/e/e0/Alight_Motion_2022.png" },
    { id: 8, name: "PicsArt Pro", price: "Rp 10.000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/PicsArt_logo.svg/1200px-PicsArt_logo.svg.png" },
    { id: 9, name: "Iqiyi Vip", price: "Rp 18.000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/IQIYI_logo.svg/1280px-IQIYI_logo.svg.png" },
    { id: 10, name: "Vidio Prem", price: "Rp 15.000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Vidio_logo.svg/1200px-Vidio_logo.svg.png" }
];

// 1. Render Produk ke Home
function init() {
    const list = document.getElementById('app-list');
    list.innerHTML = apps.map(app => `
        <div class="app-card" onclick="goToCheckout(${app.id})">
            <div class="icon-box">
                <img src="${app.img}" alt="${app.name}">
            </div>
            <h4 class="text-xs font-bold">${app.name}</h4>
            <p class="text-blue-500 font-bold text-[10px] mt-1">${app.price}</p>
        </div>
    `).join('');
}

// 2. Logika Pindah Halaman
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    window.scrollTo(0,0);
}

// 3. Menuju Checkout & Load Data Produk Terpilih
function goToCheckout(id) {
    const app = apps.find(a => a.id === id);
    document.getElementById('checkout-name').innerText = app.name;
    document.getElementById('checkout-price').innerText = app.price;
    document.getElementById('checkout-icon').innerHTML = `<img src="${app.img}" style="width:50px">`;
    showPage('checkout');
}

// 4. Pilih Metode Pembayaran
function selectPay(el) {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
    el.classList.add('selected');
}

// 5. Simulasi Order
function processOrder() {
    const name = document.getElementById('buyer-name').value;
    const wa = document.getElementById('buyer-wa').value;
    const pay = document.querySelector('.pay-method.selected');

    if(!name || !wa || !pay) {
        alert("Mohon isi nama, WA, dan pilih metode pembayaran!");
        return;
    }

    alert(`Terima kasih ${name}!\nPesanan sedang diproses. Instruksi pembayaran akan dikirim ke WhatsApp ${wa}`);
    showPage('home');
}

document.addEventListener('DOMContentLoaded', init);
