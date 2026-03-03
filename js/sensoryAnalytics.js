// sensoryAnalytics.js - Forensic Plugin for Standard Sensory Categories
window.renderSensoryAnalytics = function(targetIdSuffix, filteredLogs, isPrinting, days) {
    const canvasId = 'sensoryChart' + targetIdSuffix;
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Filter for logs in the 'Sensory' category
    const sensoryLogs = filteredLogs.filter(log => log.category === 'Sensory');
    
    if (sensoryLogs.length === 0) {
        if (window.charts && window.charts[canvasId]) window.charts[canvasId].destroy();
        return;
    }

    const uniqueItems = [...new Set(sensoryLogs.map(log => log.item))];
    const dataCounts = uniqueItems.map(item => sensoryLogs.filter(l => l.item === item).length);
    
    // Stable color map for the 4 defaults
    const COLORS = { 'SMELL': '#A78BFA', 'TOUCH': '#60A5FA', 'LIGHT': '#FBBF24', 'NOISE': '#F87171' };
    const backgroundColors = uniqueItems.map(item => COLORS[item] || `hsl(${Math.random() * 360}, 60%, 60%)`);

    const chartType = (days > 1) ? 'bar' : 'doughnut';

    if (window.charts && window.charts[canvasId]) window.charts[canvasId].destroy();
    if (!window.charts) window.charts = {};

    window.charts[canvasId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: uniqueItems,
            datasets: [{
                data: dataCounts,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: isPrinting ? '#fff' : '#111'
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
                    labels: { color: isPrinting ? '#000' : '#fff', font: { size: 14, family: 'monospace' } }
                }
            },
            scales: chartType === 'bar' ? {
                x: { beginAtZero: true, grid: { color: '#333' }, ticks: { color: isPrinting ? '#000' : '#888' } },
                y: { grid: { display: false }, ticks: { color: isPrinting ? '#000' : '#fff', font: { weight: 'bold', size: 14 } } }
            } : {}
        }
    });
};