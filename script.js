let selectedPayment = "";

// 1. Realtime Sync dengan Firestore
function initFirebase() {
    const { onSnapshot, collection } = window.fb.methods;
    const db = window.fb.db;

    // Ambil data produk secara realtime
    onSnapshot(collection(db, "products"), (snapshot) => {
        const productData = [];
        snapshot.forEach(doc => productData.push({ id: doc.id, ...doc.data() }));
        renderAll(productData);
    });

    // Cek Status Login & Atur Tombol Navbar
    window.fb.methods.onAuthStateChanged(window.fb.auth, (user) => {
        const btn = document.getElementById('login-nav-btn');
        if (user) {
            // Jika sudah login
            btn.innerText = user.email === "nexifyadmin1@gmail.com" ? "ADMIN PANEL" : "MY ACCOUNT";
            btn.onclick = () => {
                if(user.email === "nexifyadmin1@gmail.com") {
                    showPage('admin');
                } else {
                    showPage('home'); // Atau ke halaman profil user nanti
                }
            };
        } else {
            // Jika belum login
            btn.innerText = "Sign In";
            btn.onclick = () => showPage('auth');
        }
    });
}

// 2. Render Tampilan (Home & Admin)
function renderAll(data) {
    const list = document.getElementById('app-list');
    list.innerHTML = data.map(app => `
        <div class="app-card" onclick="openCheckout('${app.name}', '${app.price}', '${app.img}')">
            <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-3 shadow-sm">
                    <img src="${app.img}" class="object-contain w-full h-full" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1170/1170577.png'">
                </div>
            </div>
            <h4 class="text-xs font-bold text-center uppercase tracking-tight">${app.name}</h4>
            <p class="text-blue-400 font-black text-center text-xs mt-2">${app.price}</p>
        </div>
    `).join('');

    const admList = document.getElementById('admin-list');
    admList.innerHTML = data.map(app => `
        <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 mb-2">
            <div class="flex items-center gap-4">
                <img src="${app.img}" class="w-10 h-10 rounded-lg object-cover bg-white p-1">
                <div>
                    <p class="font-bold text-sm">${app.name}</p>
                    <p class="text-[10px] text-blue-400 font-bold">${app.price}</p>
                </div>
            </div>
            <button onclick="deleteProduct('${app.id}')" class="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// 3. Logika Checkout
function openCheckout(name, price, img) {
    document.getElementById('check-name').innerText = name;
    document.getElementById('check-price').innerText = price;
    document.getElementById('check-img').innerHTML = `<img src="${img}" class="w-16">`;
    showPage('checkout');
}

window.selectPay = function(el, method) {
    document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = method;
};

window.confirmOrder = function() {
    const name = document.getElementById('order-name').value;
    const wa = document.getElementById('order-wa').value;
    if(!name || !wa || !selectedPayment) return alert("Lengkapi data & pilih metode pembayaran!");
    
    alert(`Order Berhasil!\nProduk: ${document.getElementById('check-name').innerText}\nPembayaran: ${selectedPayment}\nAdmin Nexify akan segera menghubungi WA: ${wa}`);
    showPage('home');
};

// 4. Logika Admin
window.addProductToFB = async function() {
    const name = document.getElementById('adm-name').value;
    const price = document.getElementById('adm-price').value;
    const img = document.getElementById('adm-img').value;

    if(name && price && img) {
        try {
            await window.fb.methods.addDoc(window.fb.methods.collection(window.fb.db, "products"), { name, price, img });
            alert("Berhasil menambah stok baru!");
            ['adm-name', 'adm-price', 'adm-img'].forEach(id => document.getElementById(id).value = "");
        } catch (e) { alert("Gagal tambah data: " + e.message); }
    } else {
        alert("Semua kolom harus diisi!");
    }
};

window.deleteProduct = async function(id) {
    if(confirm("Hapus aplikasi ini dari katalog?")) {
        try {
            await window.fb.methods.deleteDoc(window.fb.methods.doc(window.fb.db, "products", id));
        } catch (e) { alert("Gagal hapus: " + e.message); }
    }
};

// 5. Auth Logic
window.handleLogin = async function() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try {
        await window.fb.methods.signInWithEmailAndPassword(window.fb.auth, email, pass);
        alert("Selamat datang kembali!");
    } catch (e) { alert("Login Gagal: Periksa Email/Password!"); }
};

window.handleLogout = function() {
    if(confirm("Keluar dari sistem?")) {
        window.fb.methods.signOut(window.fb.auth).then(() => {
            location.reload();
        });
    }
};

// 6. Navigation Logic (Global)
function showPage(id) {
    console.log("Navigasi ke: " + id);
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(p => {
        p.style.display = 'none';
        p.classList.remove('active');
    });

    const targetPage = document.getElementById('page-' + id);
    if (targetPage) {
        targetPage.style.display = 'block';
        setTimeout(() => targetPage.classList.add('active'), 10);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Ekspos ke window agar bisa dipanggil dari HTML
window.showPage = showPage;

document.addEventListener('DOMContentLoaded', initFirebase);
