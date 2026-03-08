// charts/trends.js

function loadMaintenanceChart() {
    const history = JSON.parse(localStorage.getItem('audherapy_db')) || [];
    const todayLocal = new Date().toLocaleDateString();
    const todayISO = new Date().toISOString().split('T')[0];

    let waterOunces = 0;
    let teethBrushed = 0;

    // Scan the vault for today's maintenance logs
    history.forEach(log => {
        // Only look at logs from today
        if (log.date === todayLocal || log.date === todayISO) {
            const item = log.item.toLowerCase();
            
            // Add 8oz for every water log
            if (item.includes('water')) {
                waterOunces += 8; 
            }
            
            // Set teeth to 1 if silicone brush is logged
            if (item.includes('teeth') || item.includes('brush')) {
                teethBrushed = 1;
            }
        }
    });

    // Calculate the percentage to fill the bars (caps at 100% so it doesn't break the box)
    const waterPercent = Math.min((waterOunces / 64) * 100, 100);
    const teethPercent = teethBrushed > 0 ? 100 : 0;

    // Wait a brief moment, then trigger the animation to fill the bars
    setTimeout(() => {
        const wBar = document.getElementById('waterBar');
        const tBar = document.getElementById('teethBar');
        
        if (wBar) wBar.style.width = waterPercent + '%';
        if (tBar) tBar.style.width = teethPercent + '%';
    }, 100);
}

// Automatically run this math as soon as the page loads
document.addEventListener("DOMContentLoaded", loadMaintenanceChart);