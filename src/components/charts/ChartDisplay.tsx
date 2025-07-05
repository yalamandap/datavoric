
import Plot from 'react-plotly.js';
import { BarChart } from 'lucide-react';
import { getChartType } from './chartTypes';

interface ChartDisplayProps {
  plotData: any;
  chartType: string;
  fileName: string;
  xAxis: string;
  yAxis: string;
}

export const ChartDisplay = ({ plotData, chartType, fileName, xAxis, yAxis }: ChartDisplayProps) => {
  const currentChartType = getChartType(chartType);
  const requiresYAxis = currentChartType?.requiresYAxis || false;

  if (!plotData) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="text-center py-12">
          <BarChart size={48} className="text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">
            Configure your analysis parameters
          </p>
          <p className="text-slate-500 text-sm">
            Select chart type and required variables to generate professional visualizations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <Plot
        data={plotData}
        layout={{
          title: {
            text: `${currentChartType?.label} Analysis - ${fileName}`,
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
    </div>
  );
};
