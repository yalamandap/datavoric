
import { motion } from 'framer-motion';
import { FileText, Database } from 'lucide-react';

interface DataPreviewProps {
  data: any[];
  fileName: string;
}

export const DataPreview = ({ data, fileName }: DataPreviewProps) => {
  const previewData = data.slice(0, 20);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const getDataSummary = () => {
    if (data.length === 0) return null;
    
    const numericColumns = columns.filter(col => {
      return data.some(row => typeof row[col] === 'number' && !isNaN(row[col]));
    });

    return {
      totalRows: data.length,
      totalColumns: columns.length,
      numericColumns: numericColumns.length,
      textColumns: columns.length - numericColumns.length
    };
  };

  const summary = getDataSummary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{fileName}</h2>
            <p className="text-slate-400">Data Preview</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database size={16} className="text-blue-400" />
              <span className="text-slate-400 text-sm">Total Rows</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{summary.totalRows.toLocaleString()}</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database size={16} className="text-emerald-400" />
              <span className="text-slate-400 text-sm">Columns</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{summary.totalColumns}</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database size={16} className="text-purple-400" />
              <span className="text-slate-400 text-sm">Numeric</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{summary.numericColumns}</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database size={16} className="text-orange-400" />
              <span className="text-slate-400 text-sm">Text</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{summary.textColumns}</p>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">
            Data Preview (showing {previewData.length} of {data.length} rows)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-sm font-medium text-slate-200 whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-700/50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap"
                    >
                      {row[column]?.toString() || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
