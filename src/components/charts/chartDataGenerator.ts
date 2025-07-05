
export const generateChartData = (
  data: any[],
  chartType: string,
  xAxis: string,
  yAxis: string = '',
  groupBy: string = ''
) => {
  if (!data || data.length === 0 || !xAxis) return null;

  const xData = data.map(row => row[xAxis]).filter(val => val !== null && val !== undefined);
  const yData = yAxis ? data.map(row => row[yAxis]).filter(val => val !== null && val !== undefined) : [];
  const groupData = groupBy ? data.map(row => row[groupBy]) : [];

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
      const numericData = xData.filter(val => typeof val === 'number' && !isNaN(val));
      if (numericData.length === 0) return null;
      return [{
        x: numericData,
        type: 'histogram',
        nbinsx: Math.min(20, Math.max(5, Math.floor(numericData.length / 10))),
        marker: { color: '#F59E0B', opacity: 0.7 }
      }];

    case 'box':
      const boxData = xData.filter(val => typeof val === 'number' && !isNaN(val));
      if (boxData.length === 0) return null;
      if (groupBy && groupData.length > 0) {
        const groups = [...new Set(groupData)];
        return groups.map((group, idx) => ({
          y: data.filter(row => row[groupBy] === group).map(row => row[xAxis])
            .filter(val => typeof val === 'number' && !isNaN(val)),
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
      const sizes = yData.map(y => Math.abs(Number(y) || 1));
      const maxSize = Math.max(...sizes);
      
      return [{
        x: xData,
        y: yData,
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

    case 'regression':
      if (!yAxis || yData.length === 0) return null;
      const validPoints = data.filter(d => 
        typeof d[xAxis] === 'number' && !isNaN(d[xAxis]) &&
        typeof d[yAxis] === 'number' && !isNaN(d[yAxis])
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
          x: [minX, maxX],
          y: [slope * minX + intercept, slope * maxX + intercept],
          mode: 'lines',
          type: 'scatter',
          name: `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`,
          line: { color: '#EF4444', width: 2 }
        }
      ];

    default:
      return null;
  }
};
