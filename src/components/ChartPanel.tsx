
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp } from 'lucide-react';
import { ChartControls } from './charts/ChartControls';
import { ChartDisplay } from './charts/ChartDisplay';
import { generateChartData } from './charts/chartDataGenerator';
import { chartTypes, getChartType } from './charts/chartTypes';

interface ChartPanelProps {
  data: any[];
  fileName: string;
}

export const ChartPanel = ({ data, fileName }: ChartPanelProps) => {
  const [chartType, setChartType] = useState<string>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [groupBy, setGroupBy] = useState<string>('');

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const categoricalColumns = columns.filter(col => {
    return data.some(row => typeof row[col] === 'string' || typeof row[col] === 'boolean');
  });

  const plotData = generateChartData(data, chartType, xAxis, yAxis, groupBy);

  const downloadChart = () => {
    const element = document.querySelector('.js-plotly-plot') as any;
    if (element && (window as any).Plotly) {
      (window as any).Plotly.downloadImage(element, {
        format: 'png',
        width: 1200,
        height: 800,
        filename: `${fileName}_${chartType}_analysis`
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
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Advanced Analytics Dashboard</h2>
            <p className="text-slate-400">Professional data visualization and statistical analysis</p>
          </div>
        </div>
        
        {plotData && (
          <button
            onClick={downloadChart}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Download size={20} />
            <span>Export Chart</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <ChartControls
        chartType={chartType}
        setChartType={setChartType}
        xAxis={xAxis}
        setXAxis={setXAxis}
        yAxis={yAxis}
        setYAxis={setYAxis}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        columns={columns}
        categoricalColumns={categoricalColumns}
      />

      {/* Chart Display */}
      <ChartDisplay
        plotData={plotData}
        chartType={chartType}
        fileName={fileName}
        xAxis={xAxis}
        yAxis={yAxis}
      />

      {/* Analytics Info */}
      {plotData && (
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Analysis Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Data Points:</span>
              <span className="text-white ml-2 font-medium">{data.length}</span>
            </div>
            <div>
              <span className="text-slate-400">Chart Type:</span>
              <span className="text-white ml-2 font-medium">
                {getChartType(chartType)?.label}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Variables:</span>
              <span className="text-white ml-2 font-medium">
                {[xAxis, yAxis, groupBy].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
