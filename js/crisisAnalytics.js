// js/crisisAnalytics.js - Universal Meltdown Tracking Plugin
window.renderCrisisAnalytics = function(targetIdSuffix, filteredLogs, isPrinting, days) {
    const canvasId = 'crisisChart' + targetIdSuffix;
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Filter specifically for Crisis events
    const crisisLogs = filteredLogs.filter(log => log.category === 'Crisis');
    
    if (crisisLogs.length === 0) {
        if (window.charts && window.charts[canvasId]) window.charts[canvasId].destroy();
        return;
    }

    // Group by the "Primary Category" selected in the buttons
    const uniqueTriggers = [...new Set(crisisLogs.map(log => log.item))];
    const dataCounts = uniqueTriggers.map(trigger => crisisLogs.filter(l => l.item === trigger).length);
    
    // Universal Crisis Color Palette
    const COLORS = { 
        'Sensory Overload': '#facc15', // Yellow
        'Routine Change': '#3b82f6',   // Blue
        'Social Exhaustion': '#a855f7',// Purple
        'Task Demand': '#f97316',      // Orange
        'Physical Pain': '#ef4444',    // Red
        'Other / Unknown': '#6b7280'   // Gray
    };
    const backgroundColors = uniqueTriggers.map(item => COLORS[item] || '#ef4444');

    // Switch chart style based on time scale as requested
    const chartType = (days > 1) ? 'bar' : 'doughnut';

    if (window.charts && window.charts[canvasId]) window.charts[canvasId].destroy();
    if (!window.charts) window.charts = {};

    window.charts[canvasId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: uniqueTriggers,
            datasets: [{ 
                label: 'Meltdown Frequency',
                data: dataCounts, 
                backgroundColor: backgroundColors, 
                borderWidth: 2, 
                borderColor: isPrinting ? '#fff' : '#111' 
            }]
        },
        options: {
            indexAxis: chartType === 'bar' ? 'y' : 'x', // Horizontal bars for readability
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: chartType === 'doughnut', 
                    position: 'bottom', 
                    labels: { color: isPrinting ? '#000' : '#fff', font: { size: 14 } } 
                }
            },
            scales: chartType === 'bar' ? {
                x: { 
                    beginAtZero: true, 
                    ticks: { stepSize: 1, color: isPrinting ? '#000' : '#888' }, // Whole numbers only for frequency
                    grid: { color: isPrinting ? '#eee' : '#333' }
                },
                y: { 
                    ticks: { color: isPrinting ? '#000' : '#fff', font: { weight: 'bold' } },
                    grid: { display: false }
                }
            } : {}
        }
    });
};