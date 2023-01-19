const Chart = require('chart.js/auto');
const Materialize = require('materialize-css/dist/js/materialize.min');
let chart = {};

document.addEventListener('DOMContentLoaded', function () {
    let startDate;
    let endDate;
    const inputStart = document.querySelectorAll('.datepicker-start');
    const inputEnd = document.querySelectorAll('.datepicker-end');
    M.Datepicker.init(inputStart, {
        onSelect: (date) => {
            startDate = date;
            if (startDate && endDate) {
                fetchData(startDate, endDate).then(data => changeChart(data));
            }
        },
        autoClose: true,
    });
    M.Datepicker.init(inputEnd, {
        onSelect: (date) => {
            endDate = date;
            if (startDate && endDate) {
                fetchData(startDate, endDate).then(data => changeChart(data));
            }
        },
        autoClose: true,
    });


});


(async () => {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    const data = await fetchData(new Date(), now);
    showChart(data);

})();

function showChart(data) {
    const ctx = document.getElementById('myChart');
    chart = new Chart(ctx, {
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

}

function changeChart(data) {
    chart.data.labels = data.time;
    chart.data.datasets[0].data = data.temperature_2m_max;
    chart.data.datasets[1].data = data.temperature_2m_min;
    chart.update();
}

function fetchData(startDate, endDate) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', '34.68');
    url.searchParams.set('longitude', '33.04');
    url.searchParams.set('longitude', '33.04');
    url.searchParams.set('daily', 'temperature_2m_max');
    url.searchParams.append('daily', 'temperature_2m_min');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('start_date', startDate.toISOString().slice(0, 10));
    url.searchParams.set('end_date', endDate.toISOString().slice(0, 10));
    return fetch(url).then(resp => resp.ok ? resp.json() : Promise.reject(resp)).then(res => res.daily).catch(err => {
        return {}
    });

}

