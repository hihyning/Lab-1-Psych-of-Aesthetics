// Experiment Configuration
const config = {
    totalTrials: 10,
    currentTrial: 0,
    results: [],
    startTime: null
};

// Arrow Image Library
const arrowLibrary = {
    inwardFacing: [
        { id: 'i1', src: 'images/inward/arrow1.png', description: "Inward Arrow 1" },
        { id: 'i2', src: 'images/inward/arrow2.png', description: "Inward Arrow 2" },
        { id: 'i3', src: 'images/inward/arrow3.png', description: "Inward Arrow 3" },
        { id: 'i4', src: 'images/inward/arrow4.png', description: "Inward Arrow 4" },
        { id: 'i5', src: 'images/inward/arrow5.png', description: "Inward Arrow 5" },
        { id: 'i6', src: 'images/inward/arrow6.png', description: "Inward Arrow 6" },
        { id: 'i7', src: 'images/inward/arrow7.png', description: "Inward Arrow 7" },
        { id: 'i8', src: 'images/inward/arrow8.png', description: "Inward Arrow 8" },
        { id: 'i9', src: 'images/inward/arrow9.png', description: "Inward Arrow 9" },
        { id: 'i10', src: 'images/inward/arrow10.png', description: "Inward Arrow 10" }
    ],
    outwardFacing: [
        { id: 'o1', src: 'images/outward/arrow1.png', description: "Outward Arrow 1" },
        { id: 'o2', src: 'images/outward/arrow2.png', description: "Outward Arrow 2" },
        { id: 'o3', src: 'images/outward/arrow3.png', description: "Outward Arrow 3" },
        { id: 'o4', src: 'images/outward/arrow4.png', description: "Outward Arrow 4" },
        { id: 'o5', src: 'images/outward/arrow5.png', description: "Outward Arrow 5" },
        { id: 'o6', src: 'images/outward/arrow6.png', description: "Outward Arrow 6" },
        { id: 'o7', src: 'images/outward/arrow7.png', description: "Outward Arrow 7" },
        { id: 'o8', src: 'images/outward/arrow8.png', description: "Outward Arrow 8" },
        { id: 'o9', src: 'images/outward/arrow9.png', description: "Outward Arrow 9" },
        { id: 'o10', src: 'images/outward/arrow10.png', description: "Outward Arrow 10" }
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
    for (let i = 0; i < config.totalTrials; i++) {
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
    const width = (config.currentTrial / config.totalTrials) * 100;
    progress.style.width = `${width}%`;
    document.getElementById('trial-number').textContent = config.currentTrial + 1;
}

// Experiment Flow Functions
function startExperiment() {
    config.startTime = Date.now();
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
    if (config.currentTrial >= config.totalTrials) {
        showResults();
        return;
    }
    
    const trial = trials[config.currentTrial];
    trial.trialStartTime = Date.now();
    
    // Update images
    const leftStimulus = document.getElementById('stimulus-left');
    const rightStimulus = document.getElementById('stimulus-right');
    
    leftStimulus.innerHTML = `<img src="${trial.left.src}" alt="${trial.left.description}">`;
    rightStimulus.innerHTML = `<img src="${trial.right.src}" alt="${trial.right.description}">`;
    
    updateProgress();
}

function recordResponse(choice) {
    const trial = trials[config.currentTrial];
    const chosenImage = choice === 'left' ? trial.left : trial.right;
    const isInwardChoice = (choice === trial.inwardPosition);
    
    config.results.push({
        trial: config.currentTrial + 1,
        chosenImageId: chosenImage.id,
        chosenImageDescription: chosenImage.description,
        chosenImageType: isInwardChoice ? 'inward' : 'outward',
        reactionTime: Date.now() - trial.trialStartTime,
        position: choice
    });
    
    config.currentTrial++;
    showTrial();
}

function showResults() {
    document.getElementById('experiment').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    createResultsChart();
}

function calculateResults() {
    const totalTrials = config.results.length;
    const inwardChoices = config.results.filter(r => r.chosenImageType === 'inward').length;
    const inwardPercentage = (inwardChoices / totalTrials) * 100;
    const averageReactionTime = config.results.reduce((acc, r) => acc + r.reactionTime, 0) / totalTrials;
    
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
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Choices'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Preference for Inward vs. Outward Facing Compositions'
                }
            }
        }
    });

    // Add percentage results text
    const percentageResults = document.getElementById('percentage-results');
    percentageResults.innerHTML = `
        <p>Results Summary:</p>
        <p>You chose inward-facing compositions ${results.inwardPercentage}% of the time (${results.inwardCount} out of ${results.total} trials)</p>
        <p>Average reaction time: ${results.averageReactionTime} seconds</p>
    `;
}

function downloadResults() {
    const results = {
        timestamp: new Date().toISOString(),
        summary: calculateResults(),
        totalDuration: ((Date.now() - config.startTime) / 1000).toFixed(2) + ' seconds',
        detailedResults: config.results
    };

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