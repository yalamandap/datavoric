
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataUpload: (data: any[], filename: string) => void;
}

export const FileUpload = ({ onDataUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedFormats = ['.csv', '.json', '.xlsx', '.xls', '.tsv'];

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const extension = file.name.toLowerCase().split('.').pop();
      let data: any[] = [];

      switch (extension) {
        case 'csv':
        case 'tsv':
          const csvText = await file.text();
          const csvResult = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            delimiter: extension === 'tsv' ? '\t' : ','
          });
          data = csvResult.data;
          break;

        case 'json':
          const jsonText = await file.text();
          const jsonData = JSON.parse(jsonText);
          data = Array.isArray(jsonData) ? jsonData : [jsonData];
          break;

        case 'xlsx':
        case 'xls':
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
          break;

        default:
          throw new Error(`Unsupported file format: .${extension}`);
      }

      if (data.length === 0) {
        throw new Error('No data found in the file');
      }

      onDataUpload(data, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  }, [onDataUpload]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-400 bg-blue-900/20'
            : 'border-slate-600 hover:border-slate-500'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
            <Upload size={32} className="text-slate-300" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isProcessing ? 'Processing...' : 'Upload Your Data File'}
            </h3>
            <p className="text-slate-400 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            
            <input
              type="file"
              accept={supportedFormats.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
              <FileText size={20} className="mr-2" />
              Choose File
            </label>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-white font-medium">Processing file...</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-3 p-4 bg-red-900/30 border border-red-700 rounded-lg"
        >
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Supported Formats */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-3">Supported Formats</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {supportedFormats.map((format) => (
            <div
              key={format}
              className="flex items-center justify-center py-2 px-3 bg-slate-700 rounded-lg text-slate-300 text-sm font-medium"
            >
              {format.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
