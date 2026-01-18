'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Chart options
export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#111827',
      bodyColor: '#374151',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      boxPadding: 8,
      padding: 12,
      cornerRadius: 8,
      usePointStyle: true,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += context.parsed.y;
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter, sans-serif'
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(229, 231, 235, 0.5)'
      },
      ticks: {
        font: {
          family: 'Inter, sans-serif'
        }
      }
    }
  }
};

// Specific chart configurations
export const hourlyBarChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: false
    }
  }
};

export const trendsLineChartOptions = {
  ...chartOptions,
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 4,
      hoverRadius: 6
    }
  },
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: false
    }
  }
};

// Data formatters
export const formatTrendsData = (trendsData) => {
  if (!trendsData || !trendsData.trends) {
    return {
      labels: [],
      datasets: []
    };
  }

  const { trends } = trendsData;
  
  const labels = trends.map(item => item.label || item.name || '');
  
  return {
    labels,
    datasets: [
      {
        label: 'Total Calls',
        data: trends.map(item => item.callCount || 0),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Answered',
        data: trends.map(item => item.answeredCount || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      },
      {
        label: 'Missed',
        data: trends.map(item => item.missedCount || 0),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true
      }
    ]
  };
};

export const formatHourlyData = (hourlyData) => {
  if (!hourlyData || !hourlyData.distribution) {
    return {
      labels: [],
      datasets: []
    };
  }

  const { distribution } = hourlyData;
  
  const labels = distribution.map(item => item.hourLabel || '');
  
  return {
    labels,
    datasets: [
      {
        label: 'Call Volume',
        data: distribution.map(item => item.calls || 0),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };
};

export const formatHourlyDetailedData = (hourlyData) => {
  if (!hourlyData || !hourlyData.distribution) {
    return {
      labels: [],
      datasets: []
    };
  }

  const { distribution } = hourlyData;
  
  const labels = distribution.map(item => item.hourLabel || '');
  
  return {
    labels,
    datasets: [
      {
        label: 'Answered',
        data: distribution.map(item => item.answeredCalls || 0),
        backgroundColor: '#10b981',
        borderRadius: 6,
        borderSkipped: false
      },
      {
        label: 'Missed',
        data: distribution.map(item => item.missedCalls || 0),
        backgroundColor: '#ef4444',
        borderRadius: 6,
        borderSkipped: false
      },
      {
        label: 'Outgoing',
        data: distribution.map(item => item.outgoingCalls || 0),
        backgroundColor: '#8b5cf6',
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };
};