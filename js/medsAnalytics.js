// medsAnalytics.js - Forensic Medication Plugin
window.renderMedsAnalytics = function(targetIdSuffix, filteredLogs, isPrinting, days) {
    const canvasId = 'medsChart' + targetIdSuffix;
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // THE FIX: Define the chart type so it doesn't crash
    const chartType = 'bar'; 

    // 1. Filter for Medication logs (Catches 'Meds', 'Medication', 'MEDS', etc.)
    const medLogs = filteredLogs.filter(log => {
        if (!log || !log.category) return false;
        const cat = log.category.toLowerCase();
        return cat.includes('med');
    });
    
    console.log(`[Meds Debug] Found ${medLogs.length} medication entries for the last ${days} day(s).`);

    if (medLogs.length === 0) {
        if (window.charts && window.charts[canvasId]) window.charts[canvasId].destroy();
        return;
    }

    // 2. Aggregate unique medications and count totals
    const uniqueMeds = [...new Set(medLogs.map(log => log.item))];
    const dataCounts = uniqueMeds.map(medName => {
        return medLogs.filter(log => log.item === medName).length;
    });

    // 3. Generate Stable Colors based on Medication Name
    const backgroundColors = uniqueMeds.map((med) => {
        let hash = 0;
        for (let i = 0; i < med.length; i++) {
            hash = med.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + ('00000'.substring(0, 6 - c.length) + c);
    });

    // 4. Destroy existing chart instance to prevent overlaps
    if (window.charts && window.charts[canvasId]) {
        window.charts[canvasId].destroy();
    }
    if (!window.charts) window.charts = {};

    // 5. Render Chart
    window.charts[canvasId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: uniqueMeds,
            datasets: [{
                label: 'Doses Logged',
                data: dataCounts,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: isPrinting ? '#fff' : '#1a1a1a'
            }]
        },
        options: {
            indexAxis: chartType === 'bar' ? 'y' : 'x',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: chartType === 'doughnut',
                    position: 'bottom',
                    labels: { 
                        color: isPrinting ? '#000' : '#fff', 
                        font: { size: 14, family: 'monospace', weight: 'bold' }
                    }
                }
            },
            scales: chartType === 'bar' ? {
                x: { 
                    beginAtZero: true, 
                    grid: { color: '#333' },
                    ticks: { 
                        color: isPrinting ? '#000' : '#888', 
                        font: { size: 14 },
                        stepSize: 1 
                    } 
                },
                y: { 
                    grid: { display: false },
                    ticks: { color: isPrinting ? '#000' : '#fff', font: { size: 14, weight: 'bold' } } 
                }
            } : {}
        }
    });
};