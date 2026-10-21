import React from 'react';
import { Sparkles, FileDown, RotateCcw } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'comparison' | 'leaks' | 'pay_stub' | 'irs_limits';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onExportPdf: () => void;
  isExporting?: boolean;
  onMaximizePreTax: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onExportPdf,
  isExporting = false,
  onMaximizePreTax,
  onReset,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
        
        {/* Zone 1: Brand Wordmark (Renamed to TaxWise) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-sm">
            $
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
            TaxWise
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-800">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Command Center
          </button>
          <button
            onClick={() => onTabChange('comparison')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'comparison'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tradeoffs
          </button>
          <button
            onClick={() => onTabChange('leaks')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'leaks'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tax Leaks
          </button>
          <button
            onClick={() => onTabChange('pay_stub')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'pay_stub'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pay Stub
          </button>
          <button
            onClick={() => onTabChange('irs_limits')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'irs_limits'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IRS Limits
          </button>
        </nav>

        {/* Zone 3: Primary Optimization, Export, and Reset Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Export to PDF Button */}
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            title="Generate and download a comprehensive PDF report summary of your analysis"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap shrink-0 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export to PDF'}</span>
          </button>

          {/* Maximize All Button */}
          <button
            onClick={onMaximizePreTax}
            title="Instantly set 401(k), HSA, and Spousal IRA to maximum allowable statutory limits"
            className="hidden xs:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Maximize All</span>
          </button>

          {/* Reset All Values to 0 Button */}
          <button
            onClick={onReset}
            title="Reset all input values to 0"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex sm:hidden border-t border-slate-800 px-4 py-1.5 overflow-x-auto gap-1 bg-slate-950/95">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Command Center
        </button>
        <button
          onClick={() => onTabChange('comparison')}
          className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'comparison' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Tradeoffs
        </button>
        <button
          onClick={() => onTabChange('leaks')}
          className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'leaks' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Tax Leaks
        </button>
        <button
          onClick={() => onTabChange('pay_stub')}
          className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'pay_stub' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Pay Stub
        </button>
        <button
          onClick={() => onTabChange('irs_limits')}
          className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'irs_limits' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          IRS Limits
        </button>
      </div>
    </header>
  );
};
