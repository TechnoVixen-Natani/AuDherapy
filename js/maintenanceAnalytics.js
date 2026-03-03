// maintenanceAnalytics.js - High-Visibility Forensic Plugin
window.renderMaintenanceAnalytics = function(targetIdSuffix, filteredLogs, isPrinting, days) {
    const containerId = 'dailyMaintenanceBars' + targetIdSuffix;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 

    const now = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // 1. Filter logs for this specific day with Epoch & String safety
        const dayLogs = filteredLogs.filter(log => {
            if (!log || !log.timestamp) return false;
            const logDate = new Date(isNaN(log.timestamp) ? log.timestamp : Number(log.timestamp));
            return logDate.toISOString().split('T')[0] === dateStr;
        });
        
        // 2. Calculate Water Progress (Goal: 64oz)
        const waterLogs = dayLogs.filter(log => 
            log.category === 'Maintenance' && (log.item === 'Water' || log.item === 'Water Intake')
        );
        const totalWater = waterLogs.reduce((sum, log) => sum + (parseFloat(log.value) || 0), 0);
        const waterPercent = Math.min((totalWater / 64) * 100, 100);

        // 3. Find Weight Entry (Tracking the 300lb+ transformation)
        const weightLog = dayLogs.find(log => log.category === 'Maintenance' && log.item === 'Weight');
        const weightDisplay = weightLog ? `${weightLog.value} lbs` : '--';

        // 4. Find Teeth Brushing Entry
        const dentalLog = dayLogs.find(log => log.category === 'Maintenance' && log.item === 'Teeth Brushing');
        const dentalStatus = dentalLog ? '✅' : '❌';

        // 5. Build the UI Row with Increased Scale
        const row = document.createElement('div');
        row.style.marginBottom = '25px'; // More space between days
        row.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 16px; margin-bottom: 8px; color: ${isPrinting ? '#000' : '#fff'}; font-family: monospace; font-weight: bold;">
                <span>${i === 0 ? 'TODAY' : date.toLocaleDateString(undefined, {weekday: 'short', month: 'numeric', day: 'numeric'}).toUpperCase()}</span>
                <span>
                    🪥 ${dentalStatus} | 
                    ⚖️ <span style="color: #A78BFA;">${weightDisplay}</span> | 
                    💧 ${totalWater}oz
                </span>
            </div>
            <div style="width: 100%; height: 18px; background: ${isPrinting ? '#eee' : '#222'}; border-radius: 9px; overflow: hidden; border: 2px solid #444;">
                <div style="width: ${waterPercent}%; height: 100%; background: #60A5FA; transition: width 0.4s ease-out; box-shadow: inset 0 0 10px rgba(0,0,0,0.3);"></div>
            </div>
        `;
        container.appendChild(row);
    }
};