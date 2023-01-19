var Chart = require('chart.js/auto');

const ctx = document.getElementById('myChart');


(async () => {
    const data = await fetch('https://api.open-meteo.com/v1/forecast?latitude=34.68&longitude=33.04&daily=temperature_2m_max,temperature_2m_min&timezone=auto&past_days=7').then(resp => resp.json()).then(res => res.daily);
    console.log(data)

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.time,
            datasets: [{
                label: 'температура макс',
                data: data.temperature_2m_max,
                borderWidth: 1
            },
            {
                label: 'температура мин',
                data: data.temperature_2m_min,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}) ();

