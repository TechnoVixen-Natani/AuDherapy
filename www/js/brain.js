// js/brain.js - The Consolidated Forensic Data Brain

// 1. DATA INITIALIZATION
let db = JSON.parse(localStorage.getItem('audherapy_db')) || [];
let appConfig = JSON.parse(localStorage.getItem('audherapy_config')) || {}; 

// Initialize Default Config if empty
if (Object.keys(appConfig).length === 0) {
    appConfig = {
        maintenance: [
            {label: '💧 Water', item: 'Water', color: '#4A90E2'}, 
            {label: '🦷 Teeth', item: 'Teeth', color: '#FF3366'},
            {label: '⚖️ Weight', item: 'Weight', color: '#FFD700'}
        ],
        meds: [
            {label: '🌅 Morning', item: 'Morning', color: '#FFD700'}, 
            {label: '🌇 Evening', item: 'Evening', color: '#FF8C00'}, 
            {label: '🌃 Night', item: 'Night', color: '#4A90E2'}
        ],
        medicationLibrary: []
    };
    localStorage.setItem('audherapy_config', JSON.stringify(appConfig));
}

// 2. CORE LOGGING ENGINE
function log(cat, item, val = null, note = "") {
    const entry = { 
        timestamp: Date.now(), 
        date: new Date().toLocaleDateString(), 
        time: new Date().toLocaleTimeString(), 
        category: cat, 
        item: item, 
        value: val, 
        note: note 
    };
    
    db.push(entry);
    localStorage.setItem('audherapy_db', JSON.stringify(db));
    syncVaultToFile();
    console.log(`[Log] ${cat} - ${item} recorded.`);
}

// 3. HARDWARE HANDLER: MEDIA (Video/Audio Files)
async function processMedia(input, type) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const mediaId = 'media_' + Date.now(); // Generate a unique ID tag

        try {
            // 1. Send the massive file directly to the phone's Hard Drive
            await saveMediaToVault(mediaId, file);

            // 2. Save ONLY the lightweight text ID to the 5MB box
            let db = JSON.parse(localStorage.getItem('audherapy_db')) || [];
            db.push({
                timestamp: Date.now(),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                category: 'Journal',
                item: `${type}Memo`, 
                value: mediaId, // Just the tracking ID, not the whole video!
                note: `Recorded ${type}: ${file.name}`,
                isHeavy: true   // The critical bridge flag for your journal
            });

            localStorage.setItem('audherapy_db', JSON.stringify(db));
            syncVaultToFile(); // Update your Voidstar backup
            
            if (typeof loadEntry === 'function') loadEntry();
            alert(`${type} Saved securely to the Heavy Vault!`);

        } catch (error) {
            alert("CRITICAL FAULT: " + error);
        }
    }
}
// 4. HARDWARE HANDLER: VOICE (Internal Mic)
let mediaRecorder;
let audioChunks = [];

async function toggleInternalMic() {
    const btn = document.getElementById('recordBtn');

    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        try {
            // FORCE BROWSER TO ASK FOR TOKEN
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob); 
                reader.onloadend = () => {
                    log('Journal', 'VoiceMemo', reader.result, "Internal mic recording");
                    if (typeof loadEntry === 'function') loadEntry();
                };
            };

            mediaRecorder.start();
            btn.innerText = "🛑 STOPPING...";
            btn.style.background = "#FFD700"; // Morning Gold
        } catch (err) {
            console.error("Mic Hardware Error:", err);
            // This alert triggers if the browser can't "see" the mic
            alert("Hardware Error: The app cannot bridge to the Microphone. Try a full Rebuild (Green Play Button).");
        }
    } else {
        mediaRecorder.stop();
        // Stop all audio tracks to release the hardware
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        btn.innerText = "🎙️ VOICE";
        btn.style.background = "#3b82f6";
    }
}

// 5. NATIVE FILE SYNC
async function syncVaultToFile() {
    try {
        if (typeof Capacitor !== 'undefined' && Capacitor.Plugins.Filesystem) {
            const { Filesystem } = Capacitor.Plugins;
            await Filesystem.writeFile({
                path: 'voidstar_vault_mirror.json',
                data: JSON.stringify(db),
                directory: 'DOCUMENTS',
                encoding: 'utf8'
            });
        }
    } catch (e) {
        console.warn("Native Sync Unavailable.");
    }
}

// 💾 THE HEAVY STORAGE ENGINE (IndexedDB)
const DB_NAME = 'AuDherapyVault';
const STORE_NAME = 'mediaFiles';

// 1. Open the connection to the phone's hard drive
function initHeavyVault() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 2. Save the massive video file
async function saveMediaToVault(id, blob) {
    const db = await initHeavyVault();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(blob, id); // Saves the video using a unique ID tag
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// 3. Retrieve the video file
async function getMediaFromVault(id) {
    const db = await initHeavyVault();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
} 

// MASTER SECURITY & ROUTING PROTOCOL
function enforceSecurity() {
    const currentPage = window.location.pathname;
    const profile = localStorage.getItem('audherapy_profile');
    const isAuth = sessionStorage.getItem('aud_auth') === 'true';

    // RULE 1: No Profile? You MUST go to the Welcome screen. (Bypass all PIN checks).
    if (!profile) {
        if (!currentPage.includes('welcome.html')) {
            window.location.href = 'welcome.html';
        }
        return; // Stop reading any other rules
    }

    // RULE 2: Profile exists, but no PIN entered? You MUST go to the PIN screen.
    if (profile && !isAuth) {
        // Assuming index.html is your PIN screen
        if (!currentPage.includes('index.html') && !currentPage.includes('welcome.html')) {
            window.location.href = '../index.html'; 
        }
        return; // Stop reading any other rules
    }
    
    // RULE 3: You have a Profile AND entered your PIN? Go straight to Dashboard.
    if (profile && isAuth) {
        // If they are accidentally on the PIN or Welcome screen, push them to the Hub
        if (currentPage.includes('index.html') || currentPage.includes('welcome.html')) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Run the master check immediately when the app loads
enforceSecurity();
// UNIVERSAL HARDWARE BACK-BUTTON FIX
if (typeof Capacitor !== 'undefined') {
    const { App } = Capacitor.Plugins;

    App.addListener('backButton', () => {
        const overlay = document.getElementById('vaultOverlay');
        const player = document.getElementById('playerContainer');

        // Check if overlay is visible (not none and not empty)
        if (overlay && overlay.style.display !== 'none' && overlay.style.display !== '') {
            // 1. Kill the video/audio immediately
            if (player) player.innerHTML = ""; 
            // 2. Hide the element
            overlay.style.display = 'none';
            console.log("Vault closed via Hardware.");
        } 
        // If vault is already closed, go to Hub
        else if (window.location.pathname.includes('journal.html')) {
            window.location.href = '../dashboard.html';
        } else {
            window.history.back();
        }
    });
}

// 1. Define the smart configuration
let videoConfig = { 
    mimeType: 'video/webm;codecs=vp8', 
    videoBitsPerSecond: 100000 // Compressed to fit phone storage
};

// 🔴 WHEN THE RECORDING STOPS
mediaRecorder.onstop = async () => {
    // 1. Pack the raw video chunks into a Blob
    const blob = new Blob(chunks, { type: videoConfig.mimeType });
    chunks = []; // Clear the RAM
    
    // 2. Generate a unique tracking ID (e.g., "media_171249302")
    const mediaId = 'media_' + Date.now();
    
    // 3. Send the heavy video Blob directly to the hard drive
    await saveMediaToVault(mediaId, blob);
    
    // 4. Save ONLY the lightweight text ID to the 5MB localStorage box
    let db = JSON.parse(localStorage.getItem('audherapy_db')) || [];
    db.push({
        date: new Date().toLocaleDateString(),
        category: 'Journal',
        item: 'Video Log',
        value: mediaId, // We just save the tracking ID now!
        isHeavy: true   // A literal flag to tell the journal how to open it
    });
    
    localStorage.setItem('audherapy_db', JSON.stringify(db));
    alert("Video saved securely to the Heavy Vault!");
    
    // Turn the camera off
    const stream = document.getElementById('cameraPreview').srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    document.getElementById('cameraContainer').style.display = 'none';
};