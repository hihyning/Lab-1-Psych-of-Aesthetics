// Experiment Configuration
const experimentConfig = {
    totalTrials: 10,
    currentTrial: 0,
    results: [],
    startTime: null
};

// Arrow Image Library
const arrowLibrary = {
    inwardFacing: [
        { id: 'i1', src: './inward/2.png', description: "Inward Arrow 1" },
        { id: 'i2', src: './inward/3.png', description: "Inward Arrow 2" },
        { id: 'i3', src: './inward/4.png', description: "Inward Arrow 3" },
        { id: 'i4', src: './inward/5.png', description: "Inward Arrow 4" },
        { id: 'i5', src: './inward/6.png', description: "Inward Arrow 5" },
        { id: 'i6', src: './inward/7.png', description: "Inward Arrow 6" },
        { id: 'i7', src: './inward/8.png', description: "Inward Arrow 7" },
        { id: 'i8', src: './inward/9.png', description: "Inward Arrow 8" },
        { id: 'i9', src: './inward/10.png', description: "Inward Arrow 9" },
        { id: 'i10', src: './inward/11.png', description: "Inward Arrow 10" }
    ],
    outwardFacing: [
        { id: 'o1', src: './outward/3.png', description: "Outward Arrow 1" },
        { id: 'o2', src: './outward/5.png', description: "Outward Arrow 2" },
        { id: 'o3', src: './outward/7.png', description: "Outward Arrow 3" },
        { id: 'o4', src: './outward/9.png', description: "Outward Arrow 4" },
        { id: 'o5', src: './outward/11.png', description: "Outward Arrow 5" },
        { id: 'o6', src: './outward/13.png', description: "Outward Arrow 6" },
        { id: 'o7', src: './outward/15.png', description: "Outward Arrow 7" },
        { id: 'o8', src: './outward/17.png', description: "Outward Arrow 8" },
        { id: 'o9', src: './outward/19.png', description: "Outward Arrow 9" },
        { id: 'o10', src: './outward/21.png', description: "Outward Arrow 10" }
    ]
};

let trials = [];

// Utility Functions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateTrialPairs() {
    const inwardArrows = [...arrowLibrary.inwardFacing];
    const outwardArrows = [...arrowLibrary.outwardFacing];
    
    // Shuffle both arrays
    shuffle(inwardArrows);
    shuffle(outwardArrows);
    
    const pairs = [];
    
    // Create 10 unique pairs
    for (let i = 0; i < experimentConfig.totalTrials; i++) {
        const isInwardLeft = Math.random() < 0.5;
        pairs.push({
            left: isInwardLeft ? inwardArrows[i] : outwardArrows[i],
            right: isInwardLeft ? outwardArrows[i] : inwardArrows[i],
            inwardPosition: isInwardLeft ? 'left' : 'right',
            trialStartTime: null
        });
    }
    
    return pairs;
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const width = (experimentConfig.currentTrial / experimentConfig.totalTrials) * 100;
    progress.style.width = `${width}%`;
    document.getElementById('trial-number').textContent = experimentConfig.currentTrial + 1;
}

// Experiment Flow Functions
function startExperiment() {
    experimentConfig.startTime = Date.now();
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('instructions').classList.remove('hidden');
}

function startTrials() {
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('experiment').classList.remove('hidden');
    trials = generateTrialPairs();
    showTrial();
}

function showTrial() {
    if (experimentConfig.currentTrial >= experimentConfig.totalTrials) {
        showResults();
        return;
    }
    
    const trial = trials[experimentConfig.currentTrial];
    trial.trialStartTime = Date.now();
    
    // Update images
    const leftStimulus = document.getElementById('stimulus-left');
    const rightStimulus = document.getElementById('stimulus-right');
    
    leftStimulus.innerHTML = `<img src="${trial.left.src}" alt="${trial.left.description}">`;
    rightStimulus.innerHTML = `<img src="${trial.right.src}" alt="${trial.right.description}">`;
    
    updateProgress();
}

function recordResponse(choice) {
    const trial = trials[experimentConfig.currentTrial];
    const chosenImage = choice === 'left' ? trial.left : trial.right;
    const isInwardChoice = (choice === trial.inwardPosition);
    
    experimentConfig.results.push({
        trial: experimentConfig.currentTrial + 1,
        chosenImageId: chosenImage.id,
        chosenImageDescription: chosenImage.description,
        chosenImageType: isInwardChoice ? 'inward' : 'outward',
        reactionTime: Date.now() - trial.trialStartTime,
        position: choice
    });
    
    experimentConfig.currentTrial++;
    showTrial();
}

function showResults() {
    document.getElementById('experiment').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    createResultsChart();
}

function calculateResults() {
    const totalTrials = experimentConfig.results.length;
    const inwardChoices = experimentConfig.results.filter(r => r.chosenImageType === 'inward').length;
    const inwardPercentage = (inwardChoices / totalTrials) * 100;
    const averageReactionTime = experimentConfig.results.reduce((acc, r) => acc + r.reactionTime, 0) / totalTrials;
    
    return {
        total: totalTrials,
        inwardCount: inwardChoices,
        outwardCount: totalTrials - inwardChoices,
        inwardPercentage: inwardPercentage.toFixed(1),
        outwardPercentage: (100 - inwardPercentage).toFixed(1),
        averageReactionTime: (averageReactionTime / 1000).toFixed(2)
    };
}

function createResultsChart() {
    const results = calculateResults();
    const ctx = document.getElementById('resultsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [`Inward-Facing (${results.inwardPercentage}%)`, 
                    `Outward-Facing (${results.outwardPercentage}%)`],
            datasets: [{
                label: 'Compositional Preferences',
                data: [results.inwardCount, results.outwardCount],
                backgroundColor: 'rgb(255,69,0)',
                borderRadius: 5, // Rounded corners
                borderWidth: 0, // No border
                hoverBackgroundColor: 'rgba(255,69,0,0.7)' // Hover effect
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E5E5E5', // Light grid lines
                        borderDash: [5, 5] // Dashed grid lines
                    },
                    ticks: {
                        font: {
                            family: 'Space Grotesk',
                            size: 14
                        },
                        color: '#111111'
                    },
                    title: {
                        display: true,
                        text: 'Number of Choices',
                        font: {
                            family: 'Space Grotesk',
                            size: 16
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // No vertical grid lines
                    },
                    ticks: {
                        font: {
                            family: 'Space Grotesk',
                            size: 14
                        },
                        color: '#111111'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend
                },
                title: {
                    display: true,
                    text: 'Preference for Inward vs. Outward Facing Compositions',
                    font: {
                        family: 'Space Grotesk',
                        size: 18,
                        weight: 'normal'
                    },
                    padding: 20,
                    color: '#111111'
                }
            }
        }
    });

    // Add percentage results text
    const percentageResults = document.getElementById('percentage-results');
    percentageResults.innerHTML = `
        <h3>Results Summary</h3>
        <p>You chose inward-facing compositions <span class="dynamic-text">${results.inwardPercentage}%</span> of the time (<span class="dynamic-text">${results.inwardCount}</span> out of ${results.total} trials)</p>
        <p>Average reaction time: <span class="dynamic-text">${results.averageReactionTime}</span> seconds</p>
    `;
}

async function downloadResults() {
    const results = {
        timestamp: new Date().toISOString(),
        summary: calculateResults(),
        totalDuration: ((Date.now() - experimentConfig.startTime) / 1000).toFixed(2) + ' seconds',
        detailedResults: experimentConfig.results
    };

    // Send to Google Sheet
    try {
        await appendToSheet(results);
        console.log('Results successfully sent to Google Sheets');
    } catch (error) {
        console.error('Failed to send results to Google Sheets:', error);
    }

    // Download JSON results
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inward-bias-detailed-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Download chart image
    const canvas = document.getElementById('resultsChart');
    const image = canvas.toDataURL('image/png');
    const screenshotLink = document.createElement('a');
    screenshotLink.href = image;
    screenshotLink.download = 'inward-bias-results-chart.png';
    document.body.appendChild(screenshotLink);
    screenshotLink.click();
    document.body.removeChild(screenshotLink);
}