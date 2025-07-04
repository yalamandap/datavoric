
import { motion } from 'framer-motion';
import { User, MapPin, Mail } from 'lucide-react';

export const DeveloperCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Yalamanda Rao Papana</h2>
          <p className="text-slate-400">Full Stack Developer & Data Enthusiast</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <MapPin size={20} className="text-blue-400" />
            <span className="text-slate-300">Martur, Andhra Pradesh, India</span>
          </div>

          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-emerald-400" />
            <a
              href="mailto:yalamandap6@gmail.com"
              className="text-slate-300 hover:text-white transition-colors"
            >
              yalamandap6@gmail.com
            </a>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Me</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yalamandap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <span>GitHub</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/yalamanda-rao-papana-5309b9284"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">About This Dashboard</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              This data visualization dashboard was built with React, TypeScript, Tailwind CSS, 
              and Plotly.js. It supports multiple file formats and provides interactive 
              charting capabilities with admin-level controls for data management.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
