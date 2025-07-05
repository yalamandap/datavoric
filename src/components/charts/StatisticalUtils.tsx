
export interface StatisticalSummary {
  mean: number;
  median: number;
  mode: number | string;
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  count: number;
}

export const calculateStatistics = (data: number[]): StatisticalSummary => {
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  
  // Mean
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  
  // Median
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];
  
  // Mode (most frequent value)
  const frequency = {};
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  const mode = Object.keys(frequency).reduce((a, b) => 
    frequency[a] > frequency[b] ? a : b
  );
  
  // Standard deviation and variance
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const standardDeviation = Math.sqrt(variance);
  
  // Min, max, range
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  return {
    mean,
    median,
    mode: isNaN(Number(mode)) ? mode : Number(mode),
    standardDeviation,
    variance,
    min,
    max,
    range,
    count: n
  };
};

export const StatisticalSummaryCard = ({ data, title }: { data: number[], title: string }) => {
  if (!data || data.length === 0) return null;
  
  const stats = calculateStatistics(data);
  
  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-white mb-3">{title} - Statistical Summary</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <span className="text-slate-400">Mean:</span>
          <span className="text-white ml-2 font-medium">{stats.mean.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-slate-400">Median:</span>
          <span className="text-white ml-2 font-medium">{stats.median.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-slate-400">Std Dev:</span>
          <span className="text-white ml-2 font-medium">{stats.standardDeviation.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-slate-400">Range:</span>
          <span className="text-white ml-2 font-medium">{stats.range.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};
