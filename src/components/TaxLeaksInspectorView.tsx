import React, { useState } from 'react';
import { TaxCalculationResult, UserTaxProfile } from '../types/tax';
import { formatCurrency } from '../utils/taxCalculations';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TaxLeaksInspectorViewProps {
  calc: TaxCalculationResult;
  profile: UserTaxProfile;
  onUpdateDeduction: (key: 'k401' | 'hsa' | 'spousalIra', value: number) => void;
  onMaximizeAll: () => void;
}

export const TaxLeaksInspectorView: React.FC<TaxLeaksInspectorViewProps> = ({
  calc,
  profile,
  onUpdateDeduction,
  onMaximizeAll,
}) => {
  const [boostAmount, setBoostAmount] = useState<number>(50);

  // Marginal tax rate for calculations
  const marginalRate = calc.marginalFederalTaxRate / 100;
  const stateRate = (profile.stateTaxRate || 0) / 100;
  const combinedRate = marginalRate + stateRate;
  const hsaCombinedRate = combinedRate + 0.0765;

  return (
    <div className="space-y-3">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Avoidable Tax Leakage Audit
              </h2>
              <p className="text-[11px] text-slate-300">
                Every dollar below IRS statutory caps is taxed at your highest marginal bracket. HSAs also forfeit 7.65% in avoidable FICA taxes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="block text-[10px] text-slate-400">Total Leaking:</span>
              <span className="font-mono text-base font-bold text-amber-400">
                {formatCurrency(calc.totalMoneyLostInTaxes)}/yr
              </span>
            </div>
            {calc.totalMoneyLostInTaxes > 0 && (
              <button
                onClick={onMaximizeAll}
                className="px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors shadow-sm active:scale-95 whitespace-nowrap"
              >
                Plug All Leaks
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Detail Audit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: 401(k) / 403(b) */}
        <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
          calc.k401LostMoney > 0 ? 'bg-amber-950/20 border-amber-800/50' : 'bg-emerald-950/20 border-emerald-800/50'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                401(k) / 403(b)
              </span>
              {calc.k401LostMoney > 0 ? (
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 font-mono">
                  <AlertTriangle className="w-3 h-3" /> Leak
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Maximized
                </span>
              )}
            </div>

            <div className="space-y-1 text-xs font-mono my-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>IRS Limit:</span>
                <span className="text-slate-200">{formatCurrency(calc.k401MaxLimit, false)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Contributed:</span>
                <span className="text-indigo-400">{formatCurrency(profile.deductions.k401, false)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unused Gap:</span>
                <span className="text-amber-400 font-bold">{formatCurrency(Math.max(0, calc.k401MaxLimit - profile.deductions.k401))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Marginal Rate:</span>
                <span className="text-slate-200">{Math.round(combinedRate * 100)}%</span>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">Avoidable Tax Paid to IRS:</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {formatCurrency(calc.k401LostMoney)}
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800">
            {calc.k401LostMoney > 0 ? (
              <button
                onClick={() => onUpdateDeduction('k401', calc.k401MaxLimit)}
                className="w-full py-1 px-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded transition-colors"
              >
                Max Out 401(k)
              </button>
            ) : (
              <div className="text-center text-xs font-medium text-emerald-400 py-0.5">
                ✓ Full Tax Shield Captured
              </div>
            )}
          </div>
        </div>

        {/* Card 2: HSA (Triple Tax Advantaged) */}
        <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
          calc.hsaLostMoney > 0 ? 'bg-amber-950/20 border-amber-800/50' : 'bg-emerald-950/20 border-emerald-800/50'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Health Savings Account
              </span>
              {calc.hsaLostMoney > 0 ? (
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 font-mono">
                  <AlertTriangle className="w-3 h-3" /> Double Leak
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Maximized
                </span>
              )}
            </div>

            <div className="space-y-1 text-xs font-mono my-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>IRS Limit:</span>
                <span className="text-slate-200">{formatCurrency(calc.hsaMaxLimit, false)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Contributed:</span>
                <span className="text-emerald-400">{formatCurrency(profile.deductions.hsa, false)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unused Gap:</span>
                <span className="text-amber-400 font-bold">{formatCurrency(Math.max(0, calc.hsaMaxLimit - profile.deductions.hsa))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Combined (Fed+FICA):</span>
                <span className="text-slate-200">{Math.round(hsaCombinedRate * 100)}%</span>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">Avoidable Tax Paid (Inc + FICA):</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {formatCurrency(calc.hsaLostMoney)}
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800">
            {calc.hsaLostMoney > 0 ? (
              <button
                onClick={() => onUpdateDeduction('hsa', calc.hsaMaxLimit)}
                className="w-full py-1 px-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded transition-colors"
              >
                Max Out HSA
              </button>
            ) : (
              <div className="text-center text-xs font-medium text-emerald-400 py-0.5">
                ✓ Full Triple-Tax Shield Captured
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Spousal IRA */}
        <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
          calc.iraLostMoney > 0 ? 'bg-amber-950/20 border-amber-800/50' : 'bg-emerald-950/20 border-emerald-800/50'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Spousal Traditional IRA
              </span>
              {calc.iraLostMoney > 0 ? (
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 font-mono">
                  <AlertTriangle className="w-3 h-3" /> Leak
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Maximized
                </span>
              )}
            </div>

            <div className="space-y-1 text-xs font-mono my-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>IRS Limit:</span>
                <span className="text-slate-200">{formatCurrency(calc.iraMaxLimit, false)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Contributed:</span>
                <span className="text-indigo-400">{formatCurrency(profile.deductions.spousalIra, false)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unused Gap:</span>
                <span className="text-amber-400 font-bold">{formatCurrency(Math.max(0, calc.iraMaxLimit - profile.deductions.spousalIra))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Marginal Rate:</span>
                <span className="text-slate-200">{Math.round(combinedRate * 100)}%</span>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">Avoidable Tax Paid to IRS:</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {formatCurrency(calc.iraLostMoney)}
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800">
            {calc.iraLostMoney > 0 ? (
              <button
                onClick={() => onUpdateDeduction('spousalIra', calc.iraMaxLimit)}
                className="w-full py-1 px-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded transition-colors"
              >
                Max Out Spousal IRA
              </button>
            ) : (
              <div className="text-center text-xs font-medium text-emerald-400 py-0.5">
                ✓ Full Tax Shield Captured
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Interactive Paycheck Subsidization Calculator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Interactive Paycheck Subsidization Calculator
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Boost by:</span>
            {[25, 50, 100, 200].map((amt) => (
              <button
                key={amt}
                onClick={() => setBoostAmount(amt)}
                className={`px-2 py-0.5 text-xs font-mono font-medium rounded border transition-colors ${
                  boostAmount === amt
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ${amt}/paycheck
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">You Invest:</span>
            <span className="text-sm font-bold font-mono text-indigo-400">
              +{formatCurrency(boostAmount)}
            </span>
            <span className="text-[10px] text-slate-500 block">into retirement / HSA</span>
          </div>

          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">IRS Tax Subsidy:</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              +{formatCurrency(calc.annualGross > 0 ? boostAmount * combinedRate : 0)}
            </span>
            <span className="text-[10px] text-slate-500 block">in avoided tax</span>
          </div>

          <div className="p-2 bg-emerald-950/20 rounded border border-emerald-800/40 text-xs">
            <span className="text-emerald-300 font-semibold block text-[10px]">Your Actual Paycheck Impact:</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              Only -{formatCurrency(calc.annualGross > 0 ? boostAmount * (1 - combinedRate) : boostAmount)}
            </span>
            <span className="text-[10px] text-slate-400 block">net out of pocket</span>
          </div>
        </div>
      </div>
    </div>
  );
};
