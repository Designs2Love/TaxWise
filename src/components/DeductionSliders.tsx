import React from 'react';
import { DeductionsState, PayrollFrequency, TaxCalculationResult } from '../types/tax';
import { FREQUENCIES } from '../types/tax';
import { formatCurrency } from '../utils/taxCalculations';
import { Tooltip } from './Tooltip';
import { AlertTriangle, CheckCircle2, PiggyBank, HeartPulse } from 'lucide-react';

interface DeductionSlidersProps {
  deductions: DeductionsState;
  onChange: (updated: Partial<DeductionsState>) => void;
  frequency: PayrollFrequency;
  calc: TaxCalculationResult;
}

export const DeductionSliders: React.FC<DeductionSlidersProps> = ({
  deductions,
  onChange,
  frequency,
  calc,
}) => {
  const periods = FREQUENCIES[frequency]?.periodsPerYear || 26;

  const update401k = (val: number) => {
    onChange({ k401: Math.min(calc.k401MaxLimit, Math.max(0, val)) });
  };

  const updateHsa = (val: number) => {
    onChange({ hsa: Math.min(calc.hsaMaxLimit, Math.max(0, val)) });
  };

  const updateIra = (val: number) => {
    onChange({ spousalIra: Math.min(calc.iraMaxLimit, Math.max(0, val)) });
  };

  return (
    <div className="space-y-3">
      {/* ─────────────────────────────────────────────────────────────
          1. 3 TAX SHELTERS GRID (401k, HSA, IRA) - 3 CARDS SIDE BY SIDE
          ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Pre-Tax Retirement & HSA Shelters
            </h3>
            <Tooltip
              title="Statutory Pre-Tax Shelters"
              content="401(k), HSA, and Spousal IRA shield your money from progressive income taxes. HSA also avoids 7.65% FICA payroll taxes!"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            Sheltered Total: <span className="text-indigo-400 font-bold">{formatCurrency(calc.totalRetirementAnnual + deductions.hsa, false)}/yr</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: 401(k) / 403(b) */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
            calc.k401LostMoney > 0 ? 'bg-amber-950/20 border-amber-800/50' : 'bg-emerald-950/20 border-emerald-800/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-100">
                  401(k) / 403(b)
                </span>
                {calc.k401LostMoney > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold font-mono">
                    <AlertTriangle className="w-3 h-3" />
                    -{formatCurrency(calc.k401LostMoney)} lost
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Maximized
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                <span>Cap: {formatCurrency(calc.k401MaxLimit, false)}</span>
                <span className="text-indigo-300 font-semibold">{formatCurrency(calc.k401PerPay)}/check</span>
              </div>

              <input
                type="range"
                min="0"
                max={calc.k401MaxLimit}
                step="26"
                value={deductions.k401}
                onChange={(e) => update401k(parseFloat(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-950 rounded cursor-pointer mb-2.5"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  max={calc.k401MaxLimit}
                  value={deductions.k401}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => update401k(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
              <button
                type="button"
                onClick={() => update401k(calc.k401MaxLimit)}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded shrink-0 transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Card 2: Health Savings Account (HSA) */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
            calc.hsaLostMoney > 0 ? 'bg-amber-950/20 border-amber-800/50' : 'bg-emerald-950/20 border-emerald-800/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-100">
                  Health Savings Account
                </span>
                {calc.hsaLostMoney > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold font-mono">
                    <AlertTriangle className="w-3 h-3" />
                    -{formatCurrency(calc.hsaLostMoney)} lost
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Maximized
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                <span>Cap: {formatCurrency(calc.hsaMaxLimit, false)}</span>
                <span className="text-emerald-300 font-semibold">{formatCurrency(calc.hsaPerPay)}/check</span>
              </div>

              <input
                type="range"
                min="0"
                max={calc.hsaMaxLimit}
                step="26"
                value={deductions.hsa}
                onChange={(e) => updateHsa(parseFloat(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-950 rounded cursor-pointer mb-2.5"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  max={calc.hsaMaxLimit}
                  value={deductions.hsa}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => updateHsa(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>
              <button
                type="button"
                onClick={() => updateHsa(calc.hsaMaxLimit)}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded shrink-0 transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Card 3: Spousal Traditional IRA */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
            calc.iraLostMoney > 0 ? 'bg-amber-950/20 border-amber-800/50' : 'bg-emerald-950/20 border-emerald-800/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-100">
                  Spousal Traditional IRA
                </span>
                {calc.iraLostMoney > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold font-mono">
                    <AlertTriangle className="w-3 h-3" />
                    -{formatCurrency(calc.iraLostMoney)} lost
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Maximized
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                <span>Cap: {formatCurrency(calc.iraMaxLimit, false)}</span>
                <span className="text-indigo-300 font-semibold">{formatCurrency(calc.spousalIraPerPay)}/check</span>
              </div>

              <input
                type="range"
                min="0"
                max={calc.iraMaxLimit}
                step="26"
                value={deductions.spousalIra}
                onChange={(e) => updateIra(parseFloat(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-950 rounded cursor-pointer mb-2.5"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  max={calc.iraMaxLimit}
                  value={deductions.spousalIra}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => updateIra(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
              <button
                type="button"
                onClick={() => updateIra(calc.iraMaxLimit)}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded shrink-0 transition-colors"
              >
                Max
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION 125 HEALTH & SUPPLEMENTAL (5 EQUAL COLUMNS)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Health & Supplemental Premiums (Per Paycheck)
            </h3>
            <Tooltip
              title="Section 125 Cafeteria Plans"
              content="Health insurance premiums are exempt from Federal/State income tax and FICA taxes."
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Premiums: <span className="text-emerald-400 font-bold">{formatCurrency((calc.totalSection125Annual - deductions.hsa), false)}/yr</span>
          </span>
        </div>

        {/* 5-column grid across the full width */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Medical */}
          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Medical</span>
              <span className="text-[10px] font-mono text-slate-500">{formatCurrency(deductions.medical * periods, false)}/yr</span>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deductions.medical}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onChange({ medical: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>

          {/* Dental */}
          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Dental</span>
              <span className="text-[10px] font-mono text-slate-500">{formatCurrency(deductions.dental * periods, false)}/yr</span>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deductions.dental}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onChange({ dental: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>

          {/* Vision */}
          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Vision</span>
              <span className="text-[10px] font-mono text-slate-500">{formatCurrency(deductions.vision * periods, false)}/yr</span>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deductions.vision}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onChange({ vision: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>

          {/* Accident */}
          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Accident</span>
              <span className="text-[10px] font-mono text-slate-500">{formatCurrency(deductions.accident * periods, false)}/yr</span>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deductions.accident}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onChange({ accident: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>

          {/* Critical Illness */}
          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Critical</span>
              <span className="text-[10px] font-mono text-slate-500">{formatCurrency(deductions.criticalIllness * periods, false)}/yr</span>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deductions.criticalIllness}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onChange({ criticalIllness: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 pl-5 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
