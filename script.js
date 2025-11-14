const ctx = document.getElementById('dashboardChart').getContext('2d');

// Chart types available
const chartTypes = ['bar', 'line', 'pie'];
let currentChartIndex = 0;
let currentRegion = 'north';
let dashboardChart;

// Sample data
const fullData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: {
    north: [1200, 1500, 1800, 1700, 1600, 1900],
    south: [1000, 1100, 1300, 1250, 1400, 1500],
    east: [900, 950, 1000, 1100, 1200, 1300],
    west: [800, 850, 900, 950, 1000, 1100]
  }
};

// Render chart based on type and region
function renderChart(type, region) {
  if (dashboardChart) dashboardChart.destroy();

  let data;
  let label;

  if (region === 'all') {
    data = Object.values(fullData.datasets).reduce((a, b) => a.map((v, i) => v + b[i]));
    label = 'Total Sales';
  } else {
    data = fullData.datasets[region];
    label = `Sales (${region.charAt(0).toUpperCase() + region.slice(1)})`;
  }

  const datasetConfig = {
    bar: [{
      label: label,
      data: data,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }],
    line: [{
      label: label,
      data: data,
      borderColor: 'rgba(255, 99, 132, 1)',
      fill: false,
      tension: 0.3
    }],
    pie: [{
      label: label,
      data: data,
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ]
    }]
  };

  dashboardChart = new Chart(ctx, {
    type: type,
    data: {
      labels: fullData.labels,
      datasets: datasetConfig[type]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: $${ctx.parsed}`
          }
        }
      },
      scales: type === 'bar' || type === 'line' ? {
        y: { beginAtZero: true }
      } : {}
    }
  });
}

// Handle region change
function filterData() {
  currentRegion = document.getElementById('regionSelect').value;
  const selectedType = document.getElementById('chartTypeSelect').value;
  renderChart(selectedType, currentRegion);
}

// Handle chart type change
function changeChartType() {
  const selectedType = document.getElementById('chartTypeSelect').value;
  currentChartIndex = chartTypes.indexOf(selectedType);
  renderChart(selectedType, currentRegion);
}

// Initial render
renderChart(chartTypes[currentChartIndex], currentRegion);