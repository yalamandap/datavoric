
export interface ChartType {
  value: string;
  label: string;
  category: string;
  requiresYAxis: boolean;
  supportsGroupBy: boolean;
}

export const chartTypes: ChartType[] = [
  // Basic Charts
  { value: 'bar', label: 'Bar Chart', category: 'Basic', requiresYAxis: true, supportsGroupBy: true },
  { value: 'line', label: 'Line Chart', category: 'Basic', requiresYAxis: true, supportsGroupBy: true },
  { value: 'scatter', label: 'Scatter Plot', category: 'Basic', requiresYAxis: true, supportsGroupBy: true },
  { value: 'pie', label: 'Pie Chart', category: 'Basic', requiresYAxis: false, supportsGroupBy: false },
  
  // Statistical Charts
  { value: 'histogram', label: 'Histogram', category: 'Statistical', requiresYAxis: false, supportsGroupBy: false },
  { value: 'box', label: 'Box Plot', category: 'Statistical', requiresYAxis: false, supportsGroupBy: true },
  { value: 'violin', label: 'Violin Plot', category: 'Statistical', requiresYAxis: false, supportsGroupBy: false },
  { value: 'density', label: 'Density Plot', category: 'Statistical', requiresYAxis: false, supportsGroupBy: false },
  
  // Advanced Analytics
  { value: 'correlation', label: 'Correlation Matrix', category: 'Analytics', requiresYAxis: false, supportsGroupBy: false },
  { value: 'regression', label: 'Regression Analysis', category: 'Analytics', requiresYAxis: true, supportsGroupBy: false },
  { value: 'heatmap', label: 'Heatmap', category: 'Analytics', requiresYAxis: true, supportsGroupBy: false },
  
  // Specialized Charts
  { value: 'bubble', label: 'Bubble Chart', category: 'Specialized', requiresYAxis: true, supportsGroupBy: false },
  { value: 'waterfall', label: 'Waterfall Chart', category: 'Specialized', requiresYAxis: true, supportsGroupBy: false },
  { value: 'funnel', label: 'Funnel Chart', category: 'Specialized', requiresYAxis: true, supportsGroupBy: false },
  { value: 'gauge', label: 'Gauge Chart', category: 'Specialized', requiresYAxis: true, supportsGroupBy: false },
];

export const getChartType = (value: string): ChartType | undefined => {
  return chartTypes.find(type => type.value === value);
};
