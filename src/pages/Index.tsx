
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { ChartPanel } from '@/components/ChartPanel';
import { AdminControls } from '@/components/AdminControls';
import { DeveloperCard } from '@/components/DeveloperCard';

const Index = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'charts' | 'about'>('upload');
  
  // Admin configuration
  const adminEmail = "yalamandap6@gmail.com";
  const adminName = "Yalamanda Rao Papana";
  const currentUser = { name: adminName, email: adminEmail }; // Hardcoded admin
  const isAdmin = currentUser.email === adminEmail;

  const handleDataUpload = (data: any[], filename: string) => {
    setUploadedData(data);
    setFileName(filename);
    setActiveTab('preview');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          hasData={uploadedData.length > 0}
          isAdmin={isAdmin}
        />
        
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Data Visualization Dashboard
              </h1>
              <p className="text-slate-400">
                Upload your data and create stunning visualizations
              </p>
              {isAdmin && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-900 text-emerald-200">
                    👑 Admin Access
                  </span>
                </div>
              )}
            </div>

            {/* Main Content */}
            {activeTab === 'upload' && (
              <FileUpload onDataUpload={handleDataUpload} />
            )}

            {activeTab === 'preview' && uploadedData.length > 0 && (
              <div className="space-y-6">
                <DataPreview data={uploadedData} fileName={fileName} />
                {isAdmin && (
                  <AdminControls data={uploadedData} fileName={fileName} />
                )}
              </div>
            )}

            {activeTab === 'charts' && uploadedData.length > 0 && (
              <ChartPanel data={uploadedData} fileName={fileName} />
            )}

            {activeTab === 'about' && (
              <DeveloperCard />
            )}

            {activeTab !== 'upload' && uploadedData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">
                  Please upload data first to access this section.
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
