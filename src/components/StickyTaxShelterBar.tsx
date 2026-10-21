import React from 'react';
import { TaxCalculationResult } from '../types/tax';
import { formatCurrency } from '../utils/taxCalculations';
import { Tooltip } from './Tooltip';
import { AlertCircle, CheckCircle2, Sparkles, Wallet } from 'lucide-react';

interface StickyTaxShelterBarProps {
  calc: TaxCalculationResult;
  onMaximizePreTax: () => void;
}

export const StickyTaxShelterBar: React.FC<StickyTaxShelterBarProps> = ({
  calc,
  onMaximizePreTax,
}) => {
  const isLeaking = calc.totalMoneyLostInTaxes > 0;

  return (
    <div className="sticky top-12 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md shadow-black/30 transition-all">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Tax Shelter Status & Leak Breakdown */}
        <div className="flex items-center gap-2">
          {isLeaking ? (
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300">
                  Avoidable Tax Leak:
                </span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {formatCurrency(calc.totalMoneyLostInTaxes)}/yr
                </span>
                <Tooltip
                  title="Avoidable Tax Surrender"
                  content="Tax savings surrendered to the IRS due to underutilized 401(k), HSA, or Spousal IRA caps. Maximizing these keeps this cash in your household."
                />

                {/* Sub-leak badges */}
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-slate-600">·</span>
                  {calc.k401LostMoney > 0 && (
                    <span>401(k): <span className="text-amber-400">-{formatCurrency(calc.k401LostMoney, false)}</span></span>
                  )}
                  {calc.hsaLostMoney > 0 && (
                    <span>HSA: <span className="text-amber-400">-{formatCurrency(calc.hsaLostMoney, false)}</span></span>
                  )}
                  {calc.iraLostMoney > 0 && (
                    <span>IRA: <span className="text-amber-400">-{formatCurrency(calc.iraLostMoney, false)}</span></span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                Tax Shelters 100% Maximized
                <Tooltip
                  title="Optimal Tax Shield"
                  content="All 2026 pre-tax statutory caps (401k, HSA, IRA) are fully captured. $0 in avoidable taxes are leaking."
                />
              </span>
              <span className="text-xs text-slate-400 hidden md:inline font-mono">
                · Zero tax leakage
              </span>
            </div>
          )}
        </div>

        {/* Right: Key Live Financial Metrics & Quick Maximize Button */}
        <div className="flex items-center gap-3">
          {/* Live Paycheck Take-Home */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-xs">Paycheck Net:</span>
            <span className="font-bold text-emerald-400 text-sm">
              {formatCurrency(calc.netPayPerPay)}
            </span>
          </div>

          {/* Maximize Action Button */}
          {isLeaking && (
            <button
              onClick={onMaximizePreTax}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm active:scale-95 whitespace-nowrap shrink-0"
              title="Instantly set 401(k), HSA, and IRA to maximum statutory limits"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Maximize All</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
