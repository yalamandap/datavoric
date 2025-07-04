
import { motion } from 'framer-motion';
import { Download, FileText, Trash2 } from 'lucide-react';

interface AdminControlsProps {
  data: any[];
  fileName: string;
}

export const AdminControls = ({ data, fileName }: AdminControlsProps) => {
  const downloadData = (format: 'csv' | 'json') => {
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');
      
      content = csvContent;
      mimeType = 'text/csv';
      fileExtension = 'csv';
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.split('.')[0]}_export.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-700/50 rounded-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-emerald-600 rounded-lg">
          <FileText size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Admin Controls</h3>
          <p className="text-emerald-200 text-sm">Special privileges for Yalamanda Rao Papana</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => downloadData('csv')}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download size={20} />
          <span>Export CSV</span>
        </button>

        <button
          onClick={() => downloadData('json')}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Download size={20} />
          <span>Export JSON</span>
        </button>

        <button
          onClick={clearData}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Trash2 size={20} />
          <span>Clear Data</span>
        </button>
      </div>
    </motion.div>
  );
};
