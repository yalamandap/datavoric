
import { useState } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { BarChart, Download } from 'lucide-react';

interface ChartPanelProps {
  data: any[];
  fileName: string;
}

export const ChartPanel = ({ data, fileName }: ChartPanelProps) => {
  const [chartType, setChartType] = useState<string>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const numericColumns = columns.filter(col => {
    return data.some(row => typeof row[col] === 'number' && !isNaN(row[col]));
  });

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'histogram', label: 'Histogram' }
  ];

  const generatePlotData = () => {
    if (!xAxis || (!yAxis && chartType !== 'histogram' && chartType !== 'pie')) {
      return null;
    }

    const xData = data.map(row => row[xAxis]);
    const yData = yAxis ? data.map(row => row[yAxis]) : [];

    switch (chartType) {
      case 'bar':
        return [{
          x: xData,
          y: yData,
          type: 'bar',
          marker: { color: '#3B82F6' }
        }];
      
      case 'line':
        return [{
          x: xData,
          y: yData,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#10B981' }
        }];
      
      case 'scatter':
        return [{
          x: xData,
          y: yData,
          mode: 'markers',
          type: 'scatter',
          marker: { color: '#8B5CF6', size: 8 }
        }];
      
      case 'pie':
        const pieData = {};
        xData.forEach(value => {
          pieData[value] = (pieData[value] || 0) + 1;
        });
        
        return [{
          values: Object.values(pieData),
          labels: Object.keys(pieData),
          type: 'pie',
          marker: {
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
          }
        }];
      
      case 'area':
        return [{
          x: xData,
          y: yData,
          fill: 'tonexty',
          type: 'scatter',
          mode: 'none',
          fillcolor: 'rgba(59, 130, 246, 0.3)',
          line: { color: '#3B82F6' }
        }];
      
      case 'histogram':
        return [{
          x: xData,
          type: 'histogram',
          marker: { color: '#F59E0B' }
        }];
      
      default:
        return null;
    }
  };

  const plotData = generatePlotData();

  const downloadChart = () => {
    const element = document.querySelector('.js-plotly-plot');
    if (element) {
      // Use Plotly's built-in download functionality
      const gd = element as any;
      window.Plotly.downloadImage(gd, {
        format: 'png',
        width: 1200,
        height: 800,
        filename: `${fileName}_chart`
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <BarChart size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Chart Visualization</h2>
            <p className="text-slate-400">Create interactive charts from your data</p>
          </div>
        </div>
        
        {plotData && (
          <button
            onClick={downloadChart}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Download size={20} />
            <span>Download PNG</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {chartTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            X-Axis
          </label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select column...</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

        {chartType !== 'histogram' && chartType !== 'pie' && (
          <div className="bg-slate-800 p-4 rounded-lg">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Y-Axis
            </label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select column...</option>
              {numericColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Display */}
      <div className="bg-slate-800 rounded-lg p-6">
        {plotData ? (
          <Plot
            data={plotData}
            layout={{
              title: {
                text: `${chartTypes.find(t => t.value === chartType)?.label} - ${fileName}`,
                font: { color: '#F8FAFC', size: 20 }
              },
              paper_bgcolor: '#1E293B',
              plot_bgcolor: '#334155',
              font: { color: '#F8FAFC' },
              xaxis: {
                title: xAxis,
                gridcolor: '#475569',
                color: '#F8FAFC'
              },
              yaxis: {
                title: yAxis,
                gridcolor: '#475569',
                color: '#F8FAFC'
              }
            }}
            style={{ width: '100%', height: '500px' }}
            config={{
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d']
            }}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              Select chart type and axes to generate visualization
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
