import React from 'react';
import { UserTaxProfile } from '../types/tax';
import { computeTaxAndPayroll, formatCurrency } from '../utils/taxCalculations';
import { Sparkles, Zap } from 'lucide-react';

interface SideBySideComparisonViewProps {
  currentProfile: UserTaxProfile;
  onApplyMaximized: () => void;
}

export const SideBySideComparisonView: React.FC<SideBySideComparisonViewProps> = ({
  currentProfile,
  onApplyMaximized,
}) => {
  // Scenario 1: Zero Deductions (The standard tax-heavy benchmark)
  const zeroProfile: UserTaxProfile = {
    ...currentProfile,
    deductions: {
      k401: 0,
      spousalIra: 0,
      hsa: 0,
      medical: 0,
      dental: 0,
      vision: 0,
      accident: 0,
      criticalIllness: 0,
    },
  };
  const zeroCalc = computeTaxAndPayroll(zeroProfile);

  // Scenario 2: Current Profile
  const currentCalc = computeTaxAndPayroll(currentProfile);

  // Scenario 3: 100% Maximized Profile
  const maxProfile: UserTaxProfile = {
    ...currentProfile,
    deductions: {
      ...currentProfile.deductions,
      k401: currentCalc.k401MaxLimit,
      hsa: currentCalc.hsaMaxLimit,
      spousalIra: currentCalc.iraMaxLimit,
    },
  };
  const maxCalc = computeTaxAndPayroll(maxProfile);

  // Annual wealth retained = Net Pay Annual + Retirement/HSA contributions
  const zeroWealth = zeroCalc.netPayAnnual;
  const currentWealth = currentCalc.netPayAnnual + (currentProfile.deductions.k401 + currentProfile.deductions.spousalIra + currentProfile.deductions.hsa);
  const maxWealth = maxCalc.netPayAnnual + (maxCalc.k401MaxLimit + maxCalc.iraMaxLimit + maxCalc.hsaMaxLimit);

  const paycheckDiff = currentCalc.netPayPerPay - maxCalc.netPayPerPay;
  const annualTaxSavedMaxVsCurrent = currentCalc.totalTaxAnnual - maxCalc.totalTaxAnnual;

  return (
    <div className="space-y-3">
      {/* Compact Top Summary Strip */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                The Tax Shield Tradeoff Matrix
              </h2>
              <p className="text-[11px] text-slate-300">
                Pre-tax contributions are heavily subsidized by tax savings. Your paycheck only dips slightly while total household wealth accelerates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {paycheckDiff > 0 && (
              <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Paycheck Dip:</span>
                  <span className="text-amber-400 font-bold">-{formatCurrency(paycheckDiff)}</span>
                </div>
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Tax Saved:</span>
                  <span className="text-emerald-400 font-bold">+{formatCurrency(annualTaxSavedMaxVsCurrent, false)}/yr</span>
                </div>
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Net Wealth:</span>
                  <span className="text-indigo-400 font-bold">+{formatCurrency(maxWealth - currentWealth, false)}/yr</span>
                </div>
              </div>
            )}

            {currentCalc.totalMoneyLostInTaxes > 0 && (
              <button
                onClick={onApplyMaximized}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Apply Maximized</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* High-Density Scenario Comparison Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2 px-3 w-1/4">Metric</th>
                <th className="py-2 px-3 w-1/4 text-right text-rose-400">
                  1. Zero Deductions
                </th>
                <th className="py-2 px-3 w-1/4 text-right text-indigo-400">
                  2. Current Setup
                </th>
                <th className="py-2 px-3 w-1/4 text-right text-emerald-400">
                  3. 100% Maximized
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {/* Gross Income */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-300 font-medium">Annual Gross Wages</td>
                <td className="py-1.5 px-3 text-right text-slate-300">{formatCurrency(zeroCalc.annualGross, false)}</td>
                <td className="py-1.5 px-3 text-right text-slate-300">{formatCurrency(currentCalc.annualGross, false)}</td>
                <td className="py-1.5 px-3 text-right text-slate-300">{formatCurrency(maxCalc.annualGross, false)}</td>
              </tr>

              {/* 401(k) / 403(b) */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-400">401(k) / 403(b) Deferrals</td>
                <td className="py-1.5 px-3 text-right text-slate-500">$0</td>
                <td className="py-1.5 px-3 text-right text-indigo-300">{formatCurrency(currentProfile.deductions.k401, false)}</td>
                <td className="py-1.5 px-3 text-right text-emerald-400 font-semibold">{formatCurrency(maxCalc.k401MaxLimit, false)}</td>
              </tr>

              {/* HSA */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-400">HSA Contributions (Sec 125)</td>
                <td className="py-1.5 px-3 text-right text-slate-500">$0</td>
                <td className="py-1.5 px-3 text-right text-indigo-300">{formatCurrency(currentProfile.deductions.hsa, false)}</td>
                <td className="py-1.5 px-3 text-right text-emerald-400 font-semibold">{formatCurrency(maxCalc.hsaMaxLimit, false)}</td>
              </tr>

              {/* Spousal IRA */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-400">Spousal Traditional IRA</td>
                <td className="py-1.5 px-3 text-right text-slate-500">$0</td>
                <td className="py-1.5 px-3 text-right text-indigo-300">{formatCurrency(currentProfile.deductions.spousalIra, false)}</td>
                <td className="py-1.5 px-3 text-right text-emerald-400 font-semibold">{formatCurrency(maxCalc.iraMaxLimit, false)}</td>
              </tr>

              {/* Total Pre-Tax Shield */}
              <tr className="bg-slate-950/40 font-semibold">
                <td className="py-1.5 px-3 font-sans text-slate-200">Total Pre-Tax Shield</td>
                <td className="py-1.5 px-3 text-right text-slate-500">$0</td>
                <td className="py-1.5 px-3 text-right text-indigo-300">{formatCurrency(currentCalc.totalPreTaxAnnual, false)}</td>
                <td className="py-1.5 px-3 text-right text-emerald-400">{formatCurrency(maxCalc.totalPreTaxAnnual, false)}</td>
              </tr>

              {/* Federal Tax */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-400">Federal Income Tax</td>
                <td className="py-1.5 px-3 text-right text-rose-400">{formatCurrency(zeroCalc.federalTaxAnnual)}</td>
                <td className="py-1.5 px-3 text-right text-slate-300">{formatCurrency(currentCalc.federalTaxAnnual)}</td>
                <td className="py-1.5 px-3 text-right text-emerald-300">{formatCurrency(maxCalc.federalTaxAnnual)}</td>
              </tr>

              {/* FICA Taxes */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-400">FICA (Social Security + Medicare)</td>
                <td className="py-1.5 px-3 text-right text-rose-400">{formatCurrency(zeroCalc.ficaTotalAnnual)}</td>
                <td className="py-1.5 px-3 text-right text-slate-300">{formatCurrency(currentCalc.ficaTotalAnnual)}</td>
                <td className="py-1.5 px-3 text-right text-slate-300">{formatCurrency(maxCalc.ficaTotalAnnual)}</td>
              </tr>

              {/* Total Annual Taxes Paid */}
              <tr className="bg-slate-950/60 font-semibold">
                <td className="py-1.5 px-3 font-sans text-slate-200">Total Annual Taxes Paid</td>
                <td className="py-1.5 px-3 text-right text-rose-400">{formatCurrency(zeroCalc.totalTaxAnnual)}</td>
                <td className="py-1.5 px-3 text-right text-amber-300">{formatCurrency(currentCalc.totalTaxAnnual)}</td>
                <td className="py-1.5 px-3 text-right text-emerald-400">{formatCurrency(maxCalc.totalTaxAnnual)}</td>
              </tr>

              {/* Effective Tax Rate */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-400">Effective Tax Rate</td>
                <td className="py-1.5 px-3 text-right text-rose-400">{zeroCalc.effectiveTaxRate}%</td>
                <td className="py-1.5 px-3 text-right text-amber-300">{currentCalc.effectiveTaxRate}%</td>
                <td className="py-1.5 px-3 text-right text-emerald-400">{maxCalc.effectiveTaxRate}%</td>
              </tr>

              {/* Avoidable Tax Lost */}
              <tr className="hover:bg-slate-800/20">
                <td className="py-1.5 px-3 font-sans text-slate-400 font-medium">Avoidable Tax Lost</td>
                <td className="py-1.5 px-3 text-right text-rose-500 font-bold">{formatCurrency(zeroCalc.totalMoneyLostInTaxes)}</td>
                <td className="py-1.5 px-3 text-right text-amber-400 font-bold">{formatCurrency(currentCalc.totalMoneyLostInTaxes)}</td>
                <td className="py-1.5 px-3 text-right text-emerald-400 font-bold">$0.00</td>
              </tr>

              {/* Net Pay Per Paycheck */}
              <tr className="bg-slate-950/90 font-bold text-xs">
                <td className="py-2 px-3 font-sans text-white">Net Pay Per Paycheck</td>
                <td className="py-2 px-3 text-right text-slate-200">{formatCurrency(zeroCalc.netPayPerPay)}</td>
                <td className="py-2 px-3 text-right text-indigo-300">{formatCurrency(currentCalc.netPayPerPay)}</td>
                <td className="py-2 px-3 text-right text-emerald-400">{formatCurrency(maxCalc.netPayPerPay)}</td>
              </tr>

              {/* Total Annual Household Wealth Kept */}
              <tr className="bg-emerald-950/20 font-bold text-xs border-t-2 border-emerald-500/40">
                <td className="py-2 px-3 font-sans text-emerald-300">
                  Total Wealth Kept (Net Pay + Saved Assets)
                </td>
                <td className="py-2 px-3 text-right text-slate-400">{formatCurrency(zeroWealth, false)}</td>
                <td className="py-2 px-3 text-right text-indigo-300">{formatCurrency(currentWealth, false)}</td>
                <td className="py-2 px-3 text-right text-emerald-400">{formatCurrency(maxWealth, false)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
