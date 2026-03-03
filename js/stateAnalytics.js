// stateAnalytics.js - Adaptive Visualization & Forensic Color Consistency
window.renderStateAnalytics = function(targetIdSuffix, filteredLogs, isPrinting, days) {
    const canvasId = 'stateChart' + targetIdSuffix;
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // 1. Forensic Color Map - Ensures your core states never change colors
    const STATE_COLORS = {
        'Meltdown': '#ff4444',     // Red
        'Shutdown': '#444444',     // Dark Grey
        'Anxiety': '#ffbb33',      // Amber
        'Neutral': '#0099cc',      // Blue
        'Calm': '#00c851',         // Green
        'Hyperfocus': '#aa66cc',   // Purple
        'Social Battery Low': '#ff8800' // Orange
    };

    // 2. Filter for System State logs
    const stateLogs = filteredLogs.filter(log => log.category === 'SystemState');
    
    // 3. Identify unique states and count occurrences
    const uniqueStates = [...new Set(stateLogs.map(log => log.item))];
    const dataCounts = uniqueStates.map(stateName => {
        return stateLogs.filter(log => log.item === stateName).length;
    });

    // 4. Assign Colors: Use the Map OR a stable HSL Hash for custom buttons
    const backgroundColors = uniqueStates.map((state) => {
        if (STATE_COLORS[state]) return STATE_COLORS[state];
        
        // Generate a stable color based on the text of the custom button
        let hash = 0;
        for (let i = 0; i < state.length; i++) {
            hash = state.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`;
    });

    // 5. Adaptive Logic: Doughnut for Daily, Bar for Weekly/Monthly
    const chartType = (days > 1) ? 'bar' : 'doughnut';

    // 6. Destroy old chart instance to prevent "ghosting" glitches
    if (window.charts && window.charts[canvasId]) {
        window.charts[canvasId].destroy();
    }
    if (!window.charts) window.charts = {};

    // 7. Render the Adaptive Chart
    window.charts[canvasId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: uniqueStates,
            datasets: [{
                label: 'Occurrences',
                data: dataCounts,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: isPrinting ? '#fff' : '#1a1a1a'
            }]
        },
        options: {
            // Flips the bar chart to horizontal for better mobile long-term viewing
            indexAxis: chartType === 'bar' ? 'y' : 'x', 
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: {
                    // Legend is useful for Doughnut but redundant for Bar
                    display: chartType === 'doughnut', 
                    position: 'bottom',
                    labels: { 
                        color: isPrinting ? '#000' : '#fff', 
                        font: { size: 14, family: 'monospace', weight: 'bold' },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => ` ${context.label}: ${context.raw} entries`
                    }
                }
            },
            scales: chartType === 'bar' ? {
                x: { 
                    beginAtZero: true, 
                    grid: { color: '#333' },
                    ticks: { color: isPrinting ? '#000' : '#888', font: { size: 14 } } 
                },
                y: { 
                    grid: { display: false },
                    ticks: { color: isPrinting ? '#000' : '#fff', font: { size: 14, weight: 'bold' } } 
                }
            } : {}
        }
    });
};