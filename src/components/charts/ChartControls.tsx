
import { chartTypes, getChartType } from './chartTypes';

interface ChartControlsProps {
  chartType: string;
  setChartType: (type: string) => void;
  xAxis: string;
  setXAxis: (axis: string) => void;
  yAxis: string;
  setYAxis: (axis: string) => void;
  groupBy: string;
  setGroupBy: (group: string) => void;
  columns: string[];
  categoricalColumns: string[];
}

export const ChartControls = ({
  chartType,
  setChartType,
  xAxis,
  setXAxis,
  yAxis,
  setYAxis,
  groupBy,
  setGroupBy,
  columns,
  categoricalColumns
}: ChartControlsProps) => {
  const currentChartType = getChartType(chartType);
  const requiresYAxis = currentChartType?.requiresYAxis || false;
  const supportsGroupBy = currentChartType?.supportsGroupBy || false;

  return (
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

      {supportsGroupBy && (
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
  );
};
