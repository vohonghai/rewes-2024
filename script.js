let tempHumiChart, cpsDoseChart; // Global variables for charts
let allTemperatures = [], allHumidities = []; // Data arrays for temperature and humidity
let allCps = [], allDoses = []; // Data arrays for Cps and Dose (uSv)
let allTimestamps = []; // Array for timestamps

function fetchData() {
    const url = 'http://localhost:3000/proxy'; // URL of your running proxy server

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            accumulateData(data); // Accumulate new data points
            updateCharts(); // Update all charts with accumulated data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function accumulateData(data) {
    // Extract the latest data values
    const latestTemperature = data[0].Temperature;
    const latestHumidity = data[0].Humidity;
    const latestCps = data[0].Cps;
    const latestDose = data[0].uSv;
    const latestTimestamp = data[0].LocalTime;

    // Add new data points to the arrays
    allTemperatures.push(latestTemperature);
    allHumidities.push(latestHumidity);
    allCps.push(latestCps);
    allDoses.push(latestDose);
    allTimestamps.push(latestTimestamp);

    // Limit the number of data points to keep the graph manageable
    if (allTemperatures.length > 50) {
        allTemperatures.shift();
        allHumidities.shift();
        allCps.shift();
        allDoses.shift();
        allTimestamps.shift();
    }
}

function updateCharts() {
    // Update or create Temperature and Humidity Chart
    if (tempHumiChart) {
        tempHumiChart.data.labels = allTimestamps;
        tempHumiChart.data.datasets[0].data = allTemperatures;
        tempHumiChart.data.datasets[1].data = allHumidities;
        tempHumiChart.update();
    } else {
        const ctx = document.getElementById('tempHumiChart').getContext('2d');
        tempHumiChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: allTimestamps,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: allTemperatures,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Humidity (%)',
                        data: allHumidities,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderWidth: 1,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Local Time'
                        },
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                },
            },
        });
    }

    // Update or create Cps and Dose Chart
    if (cpsDoseChart) {
        cpsDoseChart.data.labels = allTimestamps;
        cpsDoseChart.data.datasets[0].data = allCps;
        cpsDoseChart.data.datasets[1].data = allDoses;
        cpsDoseChart.update();
    } else {
        const ctx = document.getElementById('cpsDoseChart').getContext('2d');
        cpsDoseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: allTimestamps,
                datasets: [
                    {
                        label: 'Cps (Counts per Second)',
                        data: allCps,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 1,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Dose (uSv)',
                        data: allDoses,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderWidth: 1,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Local Time'
                        },
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Cps (Counts per Second)'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Dose (uSv)'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                },
            },
        });
    }
}

// Automatically fetch data every 10 seconds and update the charts
setInterval(fetchData, 10000); // 10000 milliseconds = 10 seconds

// Fetch data once immediately to load data when the page loads
fetchData();
