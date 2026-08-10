import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import HeatmapCalendar from '../components/HeatmapCalendar';
import QuickStatsBar from '../components/QuickStatsBar';
import { fetchAnalyticsApi } from '../services/api';
import { BarChart2, TrendingUp, Layers, Calendar, Filter } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function History() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchAnalyticsApi();
      setAnalytics(res);
      setLoading(false);
    }
    load();
  }, []);

  const line30d = analytics?.line_chart_30d || [];
  const bar14d = analytics?.stacked_bar_14d || [];
  const heatmap = analytics?.heatmap_30d || [];

  // Line Chart Config (Scenario 4)
  const lineChartData = {
    labels: line30d.map(d => d.date ? d.date.split('-').slice(1).join('/') : ''),
    datasets: [
      {
        label: 'Daily Footprint (kg CO₂e)',
        data: line30d.map(d => d.total_kg),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointHoverRadius: 6
      },
      {
        label: 'Daily Budget Baseline (10 kg CO₂e)',
        data: line30d.map(() => 10.0),
        borderColor: '#f59e0b',
        borderDash: [6, 6],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 11 } }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#10b981',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#34d399'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
        suggestedMax: 14
      }
    }
  };

  // Stacked Bar Config (Scenario 4)
  const barChartData = {
    labels: bar14d.map(d => d.date ? d.date.split('-').slice(1).join('/') : ''),
    datasets: [
      {
        label: 'Travel',
        data: bar14d.map(d => d.travel_kg),
        backgroundColor: '#10b981',
        borderRadius: 4
      },
      {
        label: 'Food',
        data: bar14d.map(d => d.food_kg),
        backgroundColor: '#f59e0b',
        borderRadius: 4
      },
      {
        label: 'Energy',
        data: bar14d.map(d => d.energy_kg),
        backgroundColor: '#06b6d4',
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 11 } }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              Scenario 4: Carbon Analytics
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight mt-1">
            Historical Trends & Footprint Analytics
          </h2>
          <p className="text-sm text-slate-400">
            Review 30-day daily footprint line chart against target budget, 14-day category breakdown, and heatmap calendar.
          </p>
        </div>
      </div>

      {/* Summary Statistics Header */}
      <QuickStatsBar metrics={analytics?.metrics} />

      {/* 30-Day Line Chart */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">30-Day Carbon Footprint Trend</h3>
              <p className="text-xs text-slate-400">Daily total emission vs 10 kg CO₂e budget baseline</p>
            </div>
          </div>
        </div>
        <div className="h-72 w-full">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* 14-Day Stacked Bar & Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Bar */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">14-Day Category Breakdown</h3>
              <p className="text-xs text-slate-400">Stacked emissions by Travel, Food, and Energy</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Heatmap Calendar */}
        <HeatmapCalendar data={heatmap} />
      </div>
    </div>
  );
}
