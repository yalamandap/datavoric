
import { useState } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { BarChart, Download, TrendingUp } from 'lucide-react';

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
  const numericColumns = columns.filter(col => {
    return data.some(row => typeof row[col] === 'number' && !isNaN(row[col]));
  });
  const categoricalColumns = columns.filter(col => {
    return data.some(row => typeof row[col] === 'string' || typeof row[col] === 'boolean');
  });

  const chartTypes = [
    // Basic Charts
    { value: 'bar', label: 'Bar Chart', category: 'Basic' },
    { value: 'line', label: 'Line Chart', category: 'Basic' },
    { value: 'scatter', label: 'Scatter Plot', category: 'Basic' },
    { value: 'pie', label: 'Pie Chart', category: 'Basic' },
    
    // Statistical Charts
    { value: 'histogram', label: 'Histogram', category: 'Statistical' },
    { value: 'box', label: 'Box Plot', category: 'Statistical' },
    { value: 'violin', label: 'Violin Plot', category: 'Statistical' },
    { value: 'density', label: 'Density Plot', category: 'Statistical' },
    { value: 'qq', label: 'Q-Q Plot', category: 'Statistical' },
    
    // Advanced Analytics
    { value: 'correlation', label: 'Correlation Matrix', category: 'Analytics' },
    { value: 'regression', label: 'Regression Analysis', category: 'Analytics' },
    { value: 'time_series', label: 'Time Series', category: 'Analytics' },
    { value: 'waterfall', label: 'Waterfall Chart', category: 'Analytics' },
    
    // Specialized Charts
    { value: 'heatmap', label: 'Heatmap', category: 'Specialized' },
    { value: 'bubble', label: 'Bubble Chart', category: 'Specialized' },
    { value: 'candlestick', label: 'Candlestick', category: 'Specialized' },
    { value: 'funnel', label: 'Funnel Chart', category: 'Specialized' },
    { value: 'gauge', label: 'Gauge Chart', category: 'Specialized' },
    { value: 'sankey', label: 'Sankey Diagram', category: 'Specialized' },
    { value: 'treemap', label: 'Treemap', category: 'Specialized' },
    { value: 'sunburst', label: 'Sunburst Chart', category: 'Specialized' }
  ];

  const generatePlotData = () => {
    if (!xAxis) return null;

    const xData = data.map(row => row[xAxis]);
    const yData = yAxis ? data.map(row => row[yAxis]) : [];
    const groupData = groupBy ? data.map(row => row[groupBy]) : [];

    switch (chartType) {
      case 'bar':
        if (!yAxis) return null;
        if (groupBy) {
          const groups = [...new Set(groupData)];
          return groups.map((group, idx) => ({
            x: data.filter(row => row[groupBy] === group).map(row => row[xAxis]),
            y: data.filter(row => row[groupBy] === group).map(row => row[yAxis]),
            type: 'bar',
            name: String(group),
            marker: { color: `hsl(${idx * 60}, 70%, 50%)` }
          }));
        }
        return [{
          x: xData,
          y: yData,
          type: 'bar',
          marker: { color: '#3B82F6' }
        }];

      case 'line':
        if (!yAxis) return null;
        if (groupBy) {
          const groups = [...new Set(groupData)];
          return groups.map((group, idx) => ({
            x: data.filter(row => row[groupBy] === group).map(row => row[xAxis]),
            y: data.filter(row => row[groupBy] === group).map(row => row[yAxis]),
            type: 'scatter',
            mode: 'lines+markers',
            name: String(group),
            line: { color: `hsl(${idx * 60}, 70%, 50%)` }
          }));
        }
        return [{
          x: xData,
          y: yData,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#10B981' }
        }];

      case 'scatter':
        if (!yAxis) return null;
        return [{
          x: xData,
          y: yData,
          mode: 'markers',
          type: 'scatter',
          marker: { 
            color: groupBy ? groupData.map((_, idx) => `hsl(${idx * 30}, 70%, 50%)`) : '#8B5CF6',
            size: 8 
          },
          text: groupBy ? groupData : undefined
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
          textinfo: 'label+percent+value',
          marker: {
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
          }
        }];

      case 'histogram':
        return [{
          x: xData,
          type: 'histogram',
          nbinsx: 20,
          marker: { color: '#F59E0B', opacity: 0.7 },
          name: 'Frequency'
        }];

      case 'box':
        if (groupBy) {
          const groups = [...new Set(groupData)];
          return groups.map((group, idx) => ({
            y: data.filter(row => row[groupBy] === group).map(row => row[xAxis]),
            type: 'box',
            name: String(group),
            marker: { color: `hsl(${idx * 60}, 70%, 50%)` }
          }));
        }
        return [{
          y: xData,
          type: 'box',
          marker: { color: '#06B6D4' },
          name: xAxis
        }];

      case 'violin':
        return [{
          y: xData,
          type: 'violin',
          box: { visible: true },
          meanline: { visible: true },
          marker: { color: '#8B5CF6' },
          name: xAxis
        }];

      case 'density':
        // Kernel density estimation approximation
        const sortedData = [...xData].sort((a, b) => a - b);
        const min = Math.min(...sortedData);
        const max = Math.max(...sortedData);
        const step = (max - min) / 100;
        const densityX = [];
        const densityY = [];
        
        for (let i = min; i <= max; i += step) {
          densityX.push(i);
          // Simple gaussian kernel approximation
          const density = sortedData.reduce((sum, val) => {
            const diff = (i - val) / (step * 5);
            return sum + Math.exp(-0.5 * diff * diff);
          }, 0) / (sortedData.length * Math.sqrt(2 * Math.PI) * step * 5);
          densityY.push(density);
        }
        
        return [{
          x: densityX,
          y: densityY,
          type: 'scatter',
          mode: 'lines',
          fill: 'tonexty',
          fillcolor: 'rgba(59, 130, 246, 0.3)',
          line: { color: '#3B82F6', width: 2 },
          name: 'Density'
        }];

      case 'correlation':
        if (numericColumns.length < 2) return null;
        const corrMatrix = [];
        const corrLabels = numericColumns.slice(0, 10); // Limit to 10 columns for readability
        
        corrLabels.forEach((col1, i) => {
          const row = [];
          corrLabels.forEach((col2, j) => {
            const values1 = data.map(d => Number(d[col1])).filter(v => !isNaN(v));
            const values2 = data.map(d => Number(d[col2])).filter(v => !isNaN(v));
            
            if (values1.length === 0 || values2.length === 0) {
              row.push(0);
              return;
            }
            
            // Simple correlation calculation
            const mean1 = values1.reduce((a, b) => a + b) / values1.length;
            const mean2 = values2.reduce((a, b) => a + b) / values2.length;
            
            const numerator = values1.reduce((sum, val, idx) => 
              sum + (val - mean1) * (values2[idx] - mean2), 0);
            const denominator = Math.sqrt(
              values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
              values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
            );
            
            row.push(denominator === 0 ? 0 : numerator / denominator);
          });
          corrMatrix.push(row);
        });

        return [{
          z: corrMatrix,
          x: corrLabels,
          y: corrLabels,
          type: 'heatmap',
          colorscale: 'RdBu',
          zmid: 0,
          colorbar: { title: 'Correlation' }
        }];

      case 'regression':
        if (!yAxis) return null;
        const validPoints = data.filter(d => 
          !isNaN(Number(d[xAxis])) && !isNaN(Number(d[yAxis]))
        );
        
        if (validPoints.length < 2) return null;
        
        const xVals = validPoints.map(d => Number(d[xAxis]));
        const yVals = validPoints.map(d => Number(d[yAxis]));
        
        // Simple linear regression
        const n = xVals.length;
        const sumX = xVals.reduce((a, b) => a + b, 0);
        const sumY = yVals.reduce((a, b) => a + b, 0);
        const sumXY = xVals.reduce((sum, x, i) => sum + x * yVals[i], 0);
        const sumXX = xVals.reduce((sum, x) => sum + x * x, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        const minX = Math.min(...xVals);
        const maxX = Math.max(...xVals);
        const regressionLine = [
          { x: minX, y: slope * minX + intercept },
          { x: maxX, y: slope * maxX + intercept }
        ];
        
        return [
          {
            x: xVals,
            y: yVals,
            mode: 'markers',
            type: 'scatter',
            name: 'Data Points',
            marker: { color: '#8B5CF6', size: 6 }
          },
          {
            x: regressionLine.map(p => p.x),
            y: regressionLine.map(p => p.y),
            mode: 'lines',
            type: 'scatter',
            name: `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`,
            line: { color: '#EF4444', width: 2 }
          }
        ];

      case 'heatmap':
        if (!yAxis) return null;
        const uniqueX = [...new Set(xData)];
        const uniqueY = [...new Set(yData)];
        const heatmapZ = [];
        
        for (let i = 0; i < uniqueY.length; i++) {
          const row = [];
          for (let j = 0; j < uniqueX.length; j++) {
            const count = data.filter(d => d[xAxis] === uniqueX[j] && d[yAxis] === uniqueY[i]).length;
            row.push(count);
          }
          heatmapZ.push(row);
        }

        return [{
          z: heatmapZ,
          x: uniqueX,
          y: uniqueY,
          type: 'heatmap',
          colorscale: 'Viridis',
          colorbar: { title: 'Count' }
        }];

      case 'bubble':
        if (!yAxis) return null;
        const sizes = yData.map(y => Math.abs(Number(y) || 0));
        const maxSize = Math.max(...sizes);
        
        return [{
          x: xData,
          y: yData,
          mode: 'markers',
          marker: {
            size: sizes.map(s => (s / maxSize) * 50 + 10),
            color: sizes,
            colorscale: 'Viridis',
            showscale: true,
            opacity: 0.7,
            colorbar: { title: 'Size Value' }
          },
          type: 'scatter',
          text: data.map((d, i) => `${xAxis}: ${d[xAxis]}<br>${yAxis}: ${d[yAxis]}`)
        }];

      case 'waterfall':
        if (!yAxis) return null;
        const waterfallData = data.map(d => Number(d[yAxis]) || 0);
        let cumulative = 0;
        const measures = [];
        const yWaterfall = [];
        const textWaterfall = [];
        
        waterfallData.forEach((value, i) => {
          if (i === 0) {
            measures.push('absolute');
            yWaterfall.push(value);
            cumulative = value;
          } else {
            measures.push('relative');
            yWaterfall.push(value);
            cumulative += value;
          }
          textWaterfall.push(value.toFixed(2));
        });
        
        return [{
          x: xData,
          y: yWaterfall,
          type: 'waterfall',
          measure: measures,
          text: textWaterfall,
          textposition: 'outside',
          connector: { line: { color: '#63748A' } }
        }];

      case 'funnel':
        if (!yAxis) return null;
        return [{
          type: 'funnel',
          y: xData,
          x: yData,
          textinfo: 'value+percent initial',
          marker: { colorscale: 'Blues' }
        }];

      case 'gauge':
        if (!yAxis) return null;
        const gaugeValue = yData.reduce((sum, val) => sum + (Number(val) || 0), 0) / yData.length;
        const maxGauge = Math.max(...yData.map(v => Number(v) || 0));
        
        return [{
          type: 'indicator',
          mode: 'gauge+number+delta',
          value: gaugeValue,
          domain: { x: [0, 1], y: [0, 1] },
          title: { text: `Average ${yAxis}` },
          gauge: {
            axis: { range: [null, maxGauge] },
            bar: { color: '#3B82F6' },
            steps: [
              { range: [0, maxGauge * 0.5], color: '#E5E7EB' },
              { range: [maxGauge * 0.5, maxGauge * 0.8], color: '#D1D5DB' }
            ],
            threshold: {
              line: { color: '#EF4444', width: 4 },
              thickness: 0.75,
              value: maxGauge * 0.9
            }
          }
        }];

      default:
        return null;
    }
  };

  const plotData = generatePlotData();

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

  const requiresYAxis = !['histogram', 'pie', 'box', 'violin', 'density', 'correlation', 'gauge'].includes(chartType);
  const showGroupBy = ['bar', 'line', 'scatter', 'box'].includes(chartType);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['Basic', 'Statistical', 'Analytics', 'Specialized'].map(category => (
              <optgroup key={category} label={category}>
                {chartTypes.filter(type => type.category === category).map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            X-Axis / Primary Variable
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

        {requiresYAxis && (
          <div className="bg-slate-800 p-4 rounded-lg">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Y-Axis / Secondary Variable
            </label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
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
        )}

        {showGroupBy && (
          <div className="bg-slate-800 p-4 rounded-lg">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Group By (Optional)
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No grouping</option>
              {categoricalColumns.map((column) => (
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
                text: `${chartTypes.find(t => t.value === chartType)?.label} Analysis - ${fileName}`,
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
              yaxis: requiresYAxis ? {
                title: yAxis,
                gridcolor: '#475569',
                color: '#F8FAFC'
              } : undefined,
              autosize: true,
              showlegend: true,
              legend: {
                font: { color: '#F8FAFC' },
                bgcolor: 'rgba(30, 41, 59, 0.8)'
              }
            }}
            style={{ width: '100%', height: '600px' }}
            config={{
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
              toImageButtonOptions: {
                format: 'png',
                filename: `${fileName}_${chartType}_analysis`,
                height: 800,
                width: 1200,
                scale: 2
              }
            }}
            useResizeHandler={true}
          />
        ) : (
          <div className="text-center py-12">
            <BarChart size={48} className="text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">
              Configure your analysis parameters
            </p>
            <p className="text-slate-500 text-sm">
              Select chart type and required variables to generate professional visualizations
            </p>
          </div>
        )}
      </div>

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
                {chartTypes.find(t => t.value === chartType)?.label}
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
