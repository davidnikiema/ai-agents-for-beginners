import React from 'react';
import { Download, FileText, FileSpreadsheet, Code } from 'lucide-react';

export default function ExportPanel({ onExport }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Export des résultats</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onExport('pdf')}
          className="flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FileText className="w-5 h-5 mr-2" />
          Rapport PDF complet
        </button>

        <button
          onClick={() => onExport('excel')}
          className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileSpreadsheet className="w-5 h-5 mr-2" />
          Excel (multi-sheets)
        </button>

        <button
          onClick={() => onExport('csv')}
          className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          CSV (données)
        </button>

        <button
          onClick={() => onExport('json')}
          className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Code className="w-5 h-5 mr-2" />
          JSON (résultats)
        </button>
      </div>
    </div>
  );
}
