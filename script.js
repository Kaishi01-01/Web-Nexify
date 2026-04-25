let selectedPayment = "";
let isLoginMode = true;

// 1. Inisialisasi Data & Event
function init() {
    const { onSnapshot, collection } = window.fb.methods;
    const db = window.fb.db;

    // Sinkronisasi Produk dari Firebase
    onSnapshot(collection(db, "products"), (snapshot) => {
        let products = [];
        snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
        renderUI(products);
    });
}

function renderUI(data) {
    const list = document.getElementById('app-list');
    list.innerHTML = data.map(app => `
        <div class="app-card" onclick="openCheckout('${app.name}', '${app.price}', '${app.img}')">
            <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-md">
                    <img src="${app.img}" class="object-contain w-full h-full">
                </div>
            </div>
            <h4 class="text-[10px] font-bold text-center text-slate-400 uppercase tracking-tighter">${app.name}</h4>
            <p class="text-blue-400 font-black text-center text-xs mt-1">${app.price}</p>
        </div>
    `).join('');

    const admList = document.getElementById('admin-list');
    if(admList) {
        admList.innerHTML = data.map(app => `
            <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div class="flex items-center gap-4">
                    <img src="${app.img}" class="w-10 h-10 rounded-lg bg-white p-1">
                    <p class="font-bold text-sm">${app.name} - ${app.price}</p>
                </div>
                <button onclick="deleteProduct('${app.id}')" class="text-red-500 p-2"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');
    }
}

// 2. Navigasi Global
window.showPage = (id) => {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
        const target = document.getElementById('page-' + id);
        if(target) {
            target.style.display = 'block';
            setTimeout(() => target.classList.add('active'), 10);
        }
    }, 200);
};

// 3. Auth (Login & Daftar)
window.toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "LOGIN NEXIFY" : "DAFTAR AKUN";
    document.getElementById('auth-btn').innerText = isLoginMode ? "SIGN IN" : "SIGN UP";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Belum punya akun?" : "Sudah punya akun?";
};

window.handleAuth = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = window.fb.methods;

    try {
        if(isLoginMode) {
            await signInWithEmailAndPassword(window.fb.auth, email, pass);
        } else {
            await createUserWithEmailAndPassword(window.fb.auth, email, pass);
        }
        alert("Berhasil!");
        showPage('home');
    } catch (e) { alert("Gagal: Email/Password salah atau kurang aman."); }
};

window.handleLogout = () => window.fb.methods.signOut(window.fb.auth).then(() => location.reload());

// 4. Fitur Checkout
window.openCheckout = (name, price, img) => {
    document.getElementById('check-name').innerText = name;
    document.getElementById('check-price').innerText = price;
    document.getElementById('check-img').innerHTML = `<img src="${img}" class="w-16">`;
    showPage('checkout');
};

window.selectPay = (el, method) => {
    document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = method;
};

window.confirmOrder = () => {
    const name = document.getElementById('order-name').value;
    const wa = document.getElementById('order-wa').value;
    if(!name || !wa || !selectedPayment) return alert("Lengkapi data order!");
    alert("Order Berhasil! Kami akan menghubungi WhatsApp Anda.");
    showPage('home');
};

// 5. Fitur Admin
window.addProductToFB = async () => {
    const name = document.getElementById('adm-name').value;
    const price = document.getElementById('adm-price').value;
    const img = document.getElementById('adm-img').value;
    if(name && price && img) {
        await window.fb.methods.addDoc(window.fb.methods.collection(window.fb.db, "products"), { name, price, img });
        ['adm-name', 'adm-price', 'adm-img'].forEach(id => document.getElementById(id).value = "");
    }
};

window.deleteProduct = async (id) => {
    if(confirm("Hapus produk?")) await window.fb.methods.deleteDoc(window.fb.methods.doc(window.fb.db, "products", id));
};

document.addEventListener('DOMContentLoaded', init);
