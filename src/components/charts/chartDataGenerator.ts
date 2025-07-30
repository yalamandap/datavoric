
// Statistical helper functions
const calculateMean = (values: number[]): number => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const calculateStdDev = (values: number[]): number => {
  const mean = calculateMean(values);
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return Math.sqrt(calculateMean(squaredDiffs));
};

const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

const calculateQuantiles = (values: number[]): { q1: number; median: number; q3: number; min: number; max: number } => {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  return {
    min: sorted[0],
    q1: sorted[Math.floor(n * 0.25)],
    median: sorted[Math.floor(n * 0.5)],
    q3: sorted[Math.floor(n * 0.75)],
    max: sorted[n - 1]
  };
};

// Improved numeric detection function
const isNumericValue = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};

const toNumericArray = (data: any[]): number[] => {
  return data.filter(isNumericValue).map(val => Number(val));
};

export const generateChartData = (
  data: any[],
  chartType: string,
  xAxis: string,
  yAxis: string = '',
  groupBy: string = ''
) => {
  console.log('generateChartData called with:', { chartType, xAxis, yAxis, groupBy, dataLength: data?.length });
  
  if (!data || data.length === 0 || !xAxis) {
    console.log('Early return: missing data or xAxis');
    return null;
  }

  const xData = data.map(row => row[xAxis]).filter(val => val !== null && val !== undefined);
  const yData = yAxis ? data.map(row => row[yAxis]).filter(val => val !== null && val !== undefined) : [];
  const groupData = groupBy ? data.map(row => row[groupBy]) : [];
  
  console.log('Processed data:', { xDataLength: xData.length, yDataLength: yData.length, groupDataLength: groupData.length });
  console.log('Sample xData:', xData.slice(0, 5));

  switch (chartType) {
    case 'bar':
      if (!yAxis || yData.length === 0) return null;
      if (groupBy && groupData.length > 0) {
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
      if (!yAxis || yData.length === 0) return null;
      if (groupBy && groupData.length > 0) {
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
      if (!yAxis || yData.length === 0) return null;
      return [{
        x: xData,
        y: yData,
        mode: 'markers',
        type: 'scatter',
        marker: { 
          color: groupBy && groupData.length > 0 ? 
            groupData.map((_, idx) => `hsl(${idx * 30}, 70%, 50%)`) : '#8B5CF6',
          size: 8 
        },
        text: groupBy && groupData.length > 0 ? groupData : undefined
      }];

    case 'pie':
      const pieData = {};
      xData.forEach(value => {
        const key = String(value);
        pieData[key] = (pieData[key] || 0) + 1;
      });
      return [{
        values: Object.values(pieData),
        labels: Object.keys(pieData),
        type: 'pie',
        textinfo: 'label+percent',
        marker: {
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
        }
      }];

    case 'histogram':
      console.log('Generating histogram for xData:', xData);
      const numericData = toNumericArray(xData);
      console.log('Filtered numeric data:', numericData);
      if (numericData.length === 0) {
        console.log('No numeric data for histogram');
        return null;
      }
      const histogramResult = [{
        x: numericData,
        type: 'histogram',
        nbinsx: Math.min(20, Math.max(5, Math.floor(numericData.length / 10))),
        marker: { color: '#F59E0B', opacity: 0.7 }
      }];
      console.log('Histogram result:', histogramResult);
      return histogramResult;

    case 'box':
      const boxData = toNumericArray(xData);
      console.log('Box plot data:', boxData);
      if (boxData.length === 0) {
        console.log('No numeric data for box plot');
        return null;
      }
      if (groupBy && groupData.length > 0) {
        const groups = [...new Set(groupData)];
        return groups.map((group, idx) => ({
          y: toNumericArray(data.filter(row => row[groupBy] === group).map(row => row[xAxis])),
          type: 'box',
          name: String(group),
          marker: { color: `hsl(${idx * 60}, 70%, 50%)` }
        }));
      }
      return [{
        y: boxData,
        type: 'box',
        marker: { color: '#06B6D4' },
        name: xAxis
      }];

    case 'violin':
      const violinData = toNumericArray(xData);
      console.log('Violin plot data:', violinData);
      if (violinData.length === 0) {
        console.log('No numeric data for violin plot');
        return null;
      }
      return [{
        y: violinData,
        type: 'violin',
        box: { visible: true },
        meanline: { visible: true },
        name: xAxis,
        marker: { color: '#8B5CF6' }
      }];

    case 'density':
      console.log('Generating density plot');
      const densityData = toNumericArray(xData);
      console.log('Density data:', densityData);
      if (densityData.length === 0) {
        console.log('No numeric data for density plot');
        return null;
      }
      
      // Create density estimation using histogram approach
      const sorted = [...densityData].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const bins = 50;
      const binWidth = (max - min) / bins;
      
      if (binWidth === 0) {
        // All values are the same
        return [{
          x: [min],
          y: [densityData.length],
          type: 'scatter',
          mode: 'markers',
          name: 'Density',
          marker: { color: '#10B981', size: 10 }
        }];
      }
      
      const densityX = [];
      const densityY = [];
      
      for (let i = 0; i <= bins; i++) {
        const x = min + i * binWidth;
        const count = densityData.filter(val => 
          val >= x - binWidth/2 && val < x + binWidth/2
        ).length;
        densityX.push(x);
        densityY.push(count / (densityData.length * binWidth));
      }
      
      return [{
        x: densityX,
        y: densityY,
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        name: 'Density',
        line: { color: '#10B981', width: 2 }
      }];

    case 'correlation':
      console.log('Generating correlation matrix');
      const allColumns = Object.keys(data[0] || {});
      console.log('All columns:', allColumns);
      
      // Improved numeric column detection
      const numericColumns = allColumns.filter(col => {
        const columnData = data.map(row => row[col]);
        const numericCount = columnData.filter(isNumericValue).length;
        const isNumeric = numericCount > 0 && numericCount >= columnData.length * 0.8; // At least 80% numeric
        console.log(`Column ${col}: ${numericCount}/${columnData.length} numeric values, isNumeric: ${isNumeric}`);
        return isNumeric;
      });
      
      console.log('Numeric columns found:', numericColumns);
      
      if (numericColumns.length < 2) {
        console.log('Not enough numeric columns for correlation');
        return null;
      }
      
      const correlationMatrix = [];
      const labels = numericColumns;
      
      for (let i = 0; i < numericColumns.length; i++) {
        const row = [];
        for (let j = 0; j < numericColumns.length; j++) {
          if (i === j) {
            row.push(1);
          } else {
            const xVals = toNumericArray(data.map(d => d[numericColumns[i]]));
            const yVals = toNumericArray(data.map(d => d[numericColumns[j]]));
            row.push(calculateCorrelation(xVals, yVals));
          }
        }
        correlationMatrix.push(row);
      }
      
      return [{
        z: correlationMatrix,
        x: labels,
        y: labels,
        type: 'heatmap',
        colorscale: 'RdBu',
        zmid: 0,
        texttemplate: '%{z:.2f}',
        textfont: { color: 'white' }
      }];

    case 'regression':
      if (!yAxis || yData.length === 0) return null;
      const validXData = toNumericArray(data.map(d => d[xAxis]));
      const validYData = toNumericArray(data.map(d => d[yAxis]));
      
      if (validXData.length === 0 || validYData.length === 0 || validXData.length !== validYData.length) {
        console.log('Invalid data for regression');
        return null;
      }
      
      // Simple linear regression
      const n = validXData.length;
      const sumX = validXData.reduce((a, b) => a + b, 0);
      const sumY = validYData.reduce((a, b) => a + b, 0);
      const sumXY = validXData.reduce((sum, x, i) => sum + x * validYData[i], 0);
      const sumXX = validXData.reduce((sum, x) => sum + x * x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      const minX = Math.min(...validXData);
      const maxX = Math.max(...validXData);
      
      return [
        {
          x: validXData,
          y: validYData,
          mode: 'markers',
          type: 'scatter',
          name: 'Data Points',
          marker: { color: '#8B5CF6', size: 6 }
        },
        {
          x: [minX, maxX],
          y: [slope * minX + intercept, slope * maxX + intercept],
          mode: 'lines',
          type: 'scatter',
          name: `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`,
          line: { color: '#EF4444', width: 2 }
        }
      ];

    case 'heatmap':
      if (!yAxis || yData.length === 0) return null;
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
        colorscale: 'Viridis'
      }];

    case 'bubble':
      if (!yAxis || yData.length === 0) return null;
      const bubbleXData = toNumericArray(xData);
      const bubbleYData = toNumericArray(yData);
      
      if (bubbleXData.length === 0 || bubbleYData.length === 0) return null;
      
      const sizes = bubbleYData.map(y => Math.abs(y || 1));
      const maxSize = Math.max(...sizes);
      
      return [{
        x: bubbleXData,
        y: bubbleYData,
        mode: 'markers',
        marker: {
          size: sizes.map(s => Math.max(5, (s / maxSize) * 50)),
          color: sizes,
          colorscale: 'Viridis',
          showscale: true,
          opacity: 0.7
        },
        type: 'scatter'
      }];

    case 'waterfall':
      if (!yAxis || yData.length === 0) return null;
      const waterfallYData = toNumericArray(yData);
      if (waterfallYData.length === 0) return null;
      
      const waterfallY = [];
      let cumulative = 0;
      
      waterfallYData.forEach((value, idx) => {
        if (idx === 0) {
          waterfallY.push(value);
          cumulative = value;
        } else {
          cumulative += value;
          waterfallY.push(cumulative);
        }
      });
      
      return [{
        x: xData.slice(0, waterfallYData.length),
        y: waterfallY,
        type: 'waterfall',
        orientation: 'v',
        measure: waterfallYData.map((_, idx) => idx === 0 ? 'absolute' : 'relative'),
        textposition: 'outside',
        connector: { line: { color: 'rgb(63, 63, 63)' } }
      }];

    case 'funnel':
      if (!yAxis || yData.length === 0) return null;
      const funnelYData = toNumericArray(yData);
      if (funnelYData.length === 0) return null;
      
      return [{
        type: 'funnel',
        y: xData.slice(0, funnelYData.length),
        x: funnelYData,
        textinfo: 'value+percent initial'
      }];

    case 'gauge':
      if (!yAxis || yData.length === 0) return null;
      const gaugeYData = toNumericArray(yData);
      if (gaugeYData.length === 0) return null;
      
      const gaugeValue = gaugeYData[0] || 0;
      const maxGaugeValue = Math.max(...gaugeYData);
      
      return [{
        domain: { x: [0, 1], y: [0, 1] },
        value: gaugeValue,
        title: { text: xAxis },
        type: 'indicator',
        mode: 'gauge+number+delta',
        gauge: {
          axis: { range: [null, maxGaugeValue] },
          bar: { color: '#1f77b4' },
          steps: [
            { range: [0, maxGaugeValue * 0.5], color: 'lightgray' },
            { range: [maxGaugeValue * 0.5, maxGaugeValue * 0.8], color: 'gray' }
          ],
          threshold: {
            line: { color: 'red', width: 4 },
            thickness: 0.75,
            value: maxGaugeValue * 0.9
          }
        }
      }];

    default:
      console.log('Unknown chart type:', chartType);
      return null;
  }
};

console.log('Chart data generator loaded successfully');
