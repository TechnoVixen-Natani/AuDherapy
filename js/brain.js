// js/brain.js - The Forensic Data Brain
let db = JSON.parse(localStorage.getItem('audherapy_db')) || [];
let appConfig = JSON.parse(localStorage.getItem('audherapy_config')) || {}; 

// Initialize Default Config if empty
if (Object.keys(appConfig).length === 0) {
    appConfig = {
        maintenance: [
            {label: '💧 Water', item: 'Water', color: '#4A90E2'}, 
            {label: '🪥 Teeth', item: 'Teeth', color: '#FF3366'},
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

function log(cat, item, val = null, note = "") {
    db.push({ 
        timestamp: Date.now(), 
        date: new Date().toLocaleDateString(), 
        time: new Date().toLocaleTimeString(), 
        category: cat, item: item, value: val, note: note 
    });
    localStorage.setItem('audherapy_db', JSON.stringify(db));
    alert("Logged to Vault!");
}

// Session Security: Check if user is "validated"
function checkAuth() {
    if (sessionStorage.getItem('aud_auth') !== 'true') {
        window.location.href = 'index.html';
    }
}