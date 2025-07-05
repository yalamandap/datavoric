
import Plot from 'react-plotly.js';
import { BarChart } from 'lucide-react';
import { getChartType } from './chartTypes';
import { StatisticalSummaryCard } from './StatisticalUtils';

interface ChartDisplayProps {
  plotData: any;
  chartType: string;
  fileName: string;
  xAxis: string;
  yAxis: string;
  data: any[];
}

export const ChartDisplay = ({ plotData, chartType, fileName, xAxis, yAxis, data }: ChartDisplayProps) => {
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

  // Extract numeric data for statistical summary
  const xNumericData = data.map(row => row[xAxis])
    .filter(val => typeof val === 'number' && !isNaN(val));
  const yNumericData = yAxis ? data.map(row => row[yAxis])
    .filter(val => typeof val === 'number' && !isNaN(val)) : [];

  const getLayoutConfig = () => {
    const baseLayout = {
      title: {
        text: `${currentChartType?.label} Analysis - ${fileName}`,
        font: { color: '#F8FAFC', size: 20 }
      },
      paper_bgcolor: '#1E293B',
      plot_bgcolor: '#334155',
      font: { color: '#F8FAFC' },
      autosize: true,
      showlegend: true,
      legend: {
        font: { color: '#F8FAFC' },
        bgcolor: 'rgba(30, 41, 59, 0.8)'
      }
    };

    // Special layout configurations for specific chart types
    switch (chartType) {
      case 'correlation':
        return {
          ...baseLayout,
          xaxis: {
            title: 'Variables',
            gridcolor: '#475569',
            color: '#F8FAFC'
          },
          yaxis: {
            title: 'Variables',
            gridcolor: '#475569',
            color: '#F8FAFC'
          }
        };
      
      case 'gauge':
        return {
          ...baseLayout,
          xaxis: { visible: false },
          yaxis: { visible: false }
        };
        
      case 'pie':
      case 'funnel':
        return {
          ...baseLayout,
          xaxis: { visible: false },
          yaxis: { visible: false }
        };
        
      default:
        return {
          ...baseLayout,
          xaxis: {
            title: xAxis,
            gridcolor: '#475569',
            color: '#F8FAFC'
          },
          yaxis: requiresYAxis ? {
            title: yAxis,
            gridcolor: '#475569',
            color: '#F8FAFC'
          } : undefined
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <Plot
          data={plotData}
          layout={getLayoutConfig()}
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

      {/* Statistical Summary for relevant chart types */}
      {(['histogram', 'box', 'violin', 'density', 'regression'].includes(chartType)) && (
        <div className="space-y-4">
          {xNumericData.length > 0 && (
            <StatisticalSummaryCard data={xNumericData} title={xAxis} />
          )}
          {yNumericData.length > 0 && requiresYAxis && (
            <StatisticalSummaryCard data={yNumericData} title={yAxis} />
          )}
        </div>
      )}
    </div>
  );
};
