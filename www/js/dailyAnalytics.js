// js/dailyAnalytics.js - Universal Functioning Plugin
window.renderDailyAnalytics = function(targetIdSuffix, filteredLogs, isPrinting, days) {
    const canvasId = 'dailyChart' + targetIdSuffix;
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Filter for DailyFunction category
    const functionLogs = filteredLogs.filter(log => log.category === 'DailyFunction');
    
    if (functionLogs.length === 0) {
        if (window.charts && window.charts[canvasId]) window.charts[canvasId].destroy();
        return;
    }

    // Sort chronologically
    functionLogs.sort((a, b) => a.timestamp - b.timestamp);

    // Extract unique timestamps for the X-axis labels
    const uniqueTimestamps = [...new Set(functionLogs.map(l => l.timestamp))].sort();
    
    const labels = uniqueTimestamps.map(ts => {
        const d = new Date(Number(ts));
        return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    });

    // Map the Pain and Energy values to the timestamps
    const painData = uniqueTimestamps.map(ts => {
        const log = functionLogs.find(l => l.timestamp === ts && l.item === 'Pain');
        return log ? log.value : null; // null allows the line to span gaps seamlessly
    });

    const energyData = uniqueTimestamps.map(ts => {
        const log = functionLogs.find(l => l.timestamp === ts && l.item === 'Energy');
        return log ? log.value : null;
    });

    if (window.charts && window.charts[canvasId]) window.charts[canvasId].destroy();
    if (!window.charts) window.charts = {};

    // Render the Dual-Axis Line Chart
    window.charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pain Level (0-10)',
                    data: painData,
                    borderColor: '#ef4444',
                    backgroundColor: '#ef4444',
                    borderWidth: 3,
                    pointRadius: 5,
                    spanGaps: true,
                    yAxisID: 'yPain'
                },
                {
                    label: 'Energy Capacity (%)',
                    data: energyData,
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderWidth: 3,
                    pointRadius: 5,
                    spanGaps: true,
                    yAxisID: 'yEnergy'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    ticks: { color: isPrinting ? '#000' : '#888' },
                    grid: { color: isPrinting ? '#eee' : '#333' }
                },
                yPain: { 
                    type: 'linear', 
                    display: true, 
                    position: 'left', 
                    min: 0, 
                    max: 10, 
                    title: { display: true, text: 'Pain', color: '#ef4444', font: { weight: 'bold' } },
                    ticks: { color: isPrinting ? '#000' : '#ef4444' }
                },
                yEnergy: { 
                    type: 'linear', 
                    display: true, 
                    position: 'right', 
                    min: 0, 
                    max: 100, 
                    grid: { drawOnChartArea: false }, // Prevents crossing grid lines
                    title: { display: true, text: 'Energy %', color: '#3b82f6', font: { weight: 'bold' } },
                    ticks: { color: isPrinting ? '#000' : '#3b82f6' }
                }
            },
            plugins: {
                legend: { labels: { color: isPrinting ? '#000' : '#fff' } }
            }
        }
    });
};