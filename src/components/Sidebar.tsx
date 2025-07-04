
import { motion } from 'framer-motion';
import { Upload, BarChart, Eye, User } from 'lucide-react';

interface SidebarProps {
  activeTab: 'upload' | 'preview' | 'charts' | 'about';
  setActiveTab: (tab: 'upload' | 'preview' | 'charts' | 'about') => void;
  hasData: boolean;
  isAdmin: boolean;
}

export const Sidebar = ({ activeTab, setActiveTab, hasData, isAdmin }: SidebarProps) => {
  const menuItems = [
    { id: 'upload', label: 'Upload Data', icon: Upload, enabled: true },
    { id: 'preview', label: 'Data Preview', icon: Eye, enabled: hasData },
    { id: 'charts', label: 'Visualizations', icon: BarChart, enabled: hasData },
    { id: 'about', label: 'About', icon: User, enabled: true },
  ];

  return (
    <div className="w-64 bg-slate-800 min-h-screen p-6 border-r border-slate-700">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Dashboard</h2>
        {isAdmin && (
          <p className="text-xs text-emerald-400 font-medium">Admin Panel</p>
        )}
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isEnabled = item.enabled;

          return (
            <motion.button
              key={item.id}
              onClick={() => isEnabled && setActiveTab(item.id as any)}
              disabled={!isEnabled}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : isEnabled
                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'text-slate-500 cursor-not-allowed'
              }`}
              whileHover={isEnabled ? { scale: 1.02 } : undefined}
              whileTap={isEnabled ? { scale: 0.98 } : undefined}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
