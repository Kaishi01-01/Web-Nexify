let selectedPayment = "";

// 1. Realtime Sync dengan Firestore
function initFirebase() {
    const { onSnapshot, collection } = window.fb.methods;
    const db = window.fb.db;

    onSnapshot(collection(db, "products"), (snapshot) => {
        const productData = [];
        snapshot.forEach(doc => productData.push({ id: doc.id, ...doc.data() }));
        renderAll(productData);
    });

    // Cek Status Login
    window.fb.methods.onAuthStateChanged(window.fb.auth, (user) => {
        const btn = document.getElementById('login-nav-btn');
        if (user) {
            btn.innerText = user.email === "nexifyadmin1@gmail.com" ? "ADMIN PANEL" : "MY ACCOUNT";
            btn.onclick = () => showPage(user.email === "nexifyadmin1@gmail.com" ? 'admin' : 'home');
        }
    });
}

// 2. Render Tampilan
function renderAll(data) {
    // Katalog Home
    const list = document.getElementById('app-list');
    list.innerHTML = data.map(app => `
        <div class="app-card" onclick="openCheckout('${app.name}', '${app.price}', '${app.img}')">
            <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-3">
                    <img src="${app.img}" class="object-contain w-full h-full">
                </div>
            </div>
            <h4 class="text-xs font-bold text-center uppercase tracking-tight">${app.name}</h4>
            <p class="text-blue-400 font-black text-center text-xs mt-2">${app.price}</p>
        </div>
    `).join('');

    // List Admin
    const admList = document.getElementById('admin-list');
    admList.innerHTML = data.map(app => `
        <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
            <div class="flex items-center gap-4">
                <img src="${app.img}" class="w-10 h-10 rounded-lg">
                <p class="font-bold text-sm">${app.name} - ${app.price}</p>
            </div>
            <button onclick="deleteProduct('${app.id}')" class="text-red-500 text-xs"><i class="fa-solid fa-trash"></i></button>
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

function selectPay(el, method) {
    document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = method;
}

function confirmOrder() {
    const name = document.getElementById('order-name').value;
    const wa = document.getElementById('order-wa').value;
    if(!name || !wa || !selectedPayment) return alert("Lengkapi data & pembayaran!");
    
    alert(`Order Berhasil!\nProduk: ${document.getElementById('check-name').innerText}\nPembayaran: ${selectedPayment}\nAdmin akan segera hubungi ke WA: ${wa}`);
    showPage('home');
}

// 4. Logika Admin
async function addProductToFB() {
    const name = document.getElementById('adm-name').value;
    const price = document.getElementById('adm-price').value;
    const img = document.getElementById('adm-img').value;

    if(name && price && img) {
        await window.fb.methods.addDoc(window.fb.methods.collection(window.fb.db, "products"), { name, price, img });
        alert("Data terkirim ke Cloud!");
        ['adm-name', 'adm-price', 'adm-img'].forEach(id => document.getElementById(id).value = "");
    }
}

async function deleteProduct(id) {
    if(confirm("Hapus dari database?")) {
        await window.fb.methods.deleteDoc(window.fb.methods.doc(window.fb.db, "products", id));
    }
}

// 5. Auth Logic
async function handleLogin() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try {
        await window.fb.methods.signInWithEmailAndPassword(window.fb.auth, email, pass);
        alert("Login Sukses!");
        showPage(email === "nexifyadmin1@gmail.com" ? 'admin' : 'home');
    } catch (e) { alert("Error: " + e.message); }
}

function handleLogout() {
    window.fb.methods.signOut(window.fb.auth);
    location.reload();
}

function showPage(id) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
}

document.addEventListener('DOMContentLoaded', initFirebase);
