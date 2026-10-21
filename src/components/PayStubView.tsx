import React from 'react';
import { PayrollFrequency, TaxCalculationResult } from '../types/tax';
import { FREQUENCIES } from '../types/tax';
import { formatCurrency } from '../utils/taxCalculations';
import { Tooltip } from './Tooltip';
import { Receipt, Wallet, Sparkles } from 'lucide-react';

interface PayStubViewProps {
  calc: TaxCalculationResult;
  frequency: PayrollFrequency;
  hourlyRate: number;
  annualHours: number;
}

export const PayStubView: React.FC<PayStubViewProps> = ({
  calc,
  frequency,
  hourlyRate,
  annualHours,
}) => {
  const freqConfig = FREQUENCIES[frequency] || FREQUENCIES.BI_WEEKLY;
  const periodHours = Math.round((annualHours / freqConfig.periodsPerYear) * 100) / 100;

  // Percentage distribution of paycheck
  const netPayPercent = calc.paycheckGross > 0
    ? Math.round((calc.netPayPerPay / calc.paycheckGross) * 1000) / 10
    : 0;
  const deductionsPercent = calc.paycheckGross > 0
    ? Math.round((calc.totalDeductionsPerPay / calc.paycheckGross) * 1000) / 10
    : 0;
  const taxesPercent = calc.paycheckGross > 0
    ? Math.round((calc.totalTaxPerPay / calc.paycheckGross) * 1000) / 10
    : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg overflow-hidden shadow-xl">
      {/* Pay Voucher Header */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Receipt className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              Official Pay Statement Voucher
              <Tooltip
                title="Synchronized Paycheck"
                content="Itemized earnings statement showing exact deductions, statutory tax withholdings, and take-home pay per pay period."
              />
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              Period 1 of {freqConfig.periodsPerYear} ({freqConfig.label.split('(')[0].trim()}) · {periodHours} hrs @ {formatCurrency(hourlyRate)}/hr
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            Gross Wages
          </span>
          <span className="text-sm font-bold font-mono text-emerald-400">
            {formatCurrency(calc.paycheckGross)}
          </span>
        </div>
      </div>

      {/* Paycheck Distribution Progress Bar */}
      <div className="px-4 py-1.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">Net Take-Home: {netPayPercent}%</span>
          <span className="text-slate-600">·</span>
          <span className="text-indigo-400">Pre-Tax Deductions: {deductionsPercent}%</span>
          <span className="text-slate-600">·</span>
          <span className="text-rose-400">Taxes: {taxesPercent}%</span>
        </div>

        <div className="w-48 h-1.5 bg-slate-950 rounded-full overflow-hidden hidden sm:flex">
          <div style={{ width: `${Math.max(0, netPayPercent)}%` }} className="bg-emerald-500" />
          <div style={{ width: `${Math.max(0, deductionsPercent)}%` }} className="bg-indigo-500" />
          <div style={{ width: `${Math.max(0, taxesPercent)}%` }} className="bg-rose-500" />
        </div>
      </div>

      {/* 2-Column Split: Deductions on Left, Taxes & Net Pay Voucher on Right */}
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        
        {/* Column 1: Pre-Tax Deductions Breakdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            <span>Pre-Tax Deductions & Savings</span>
            <span className="font-mono text-indigo-400">-{formatCurrency(calc.totalDeductionsPerPay)}</span>
          </div>

          <div className="bg-slate-950/70 rounded border border-slate-800 divide-y divide-slate-800/60 font-mono text-[11px]">
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-slate-400">Medical Premium</span>
              <span className="text-slate-200">-{formatCurrency(calc.medicalPerPay)}</span>
            </div>
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-slate-400">Dental Premium</span>
              <span className="text-slate-200">-{formatCurrency(calc.dentalPerPay)}</span>
            </div>
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-slate-400">Vision Premium</span>
              <span className="text-slate-200">-{formatCurrency(calc.visionPerPay)}</span>
            </div>
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-slate-400">Accident Insurance</span>
              <span className="text-slate-200">-{formatCurrency(calc.accidentPerPay)}</span>
            </div>
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-slate-400">Critical Illness</span>
              <span className="text-slate-200">-{formatCurrency(calc.criticalIllnessPerPay)}</span>
            </div>
            <div className="px-2.5 py-1 flex items-center justify-between bg-emerald-950/10">
              <span className="text-emerald-300 font-semibold">HSA Contribution</span>
              <span className="text-emerald-400 font-semibold">-{formatCurrency(calc.hsaPerPay)}</span>
            </div>
            <div className="px-2.5 py-1 flex items-center justify-between bg-indigo-950/10">
              <span className="text-indigo-300 font-semibold">401(k) / 403(b) Deferral</span>
              <span className="text-indigo-400 font-semibold">-{formatCurrency(calc.k401PerPay)}</span>
            </div>
            <div className="px-2.5 py-1 flex items-center justify-between bg-indigo-950/10">
              <span className="text-indigo-300 font-semibold">Spousal Traditional IRA</span>
              <span className="text-indigo-400 font-semibold">-{formatCurrency(calc.spousalIraPerPay)}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Taxes Withheld + Net Take-Home Voucher */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              <span>Statutory Taxes Withheld</span>
              <span className="font-mono text-rose-400">-{formatCurrency(calc.totalTaxPerPay)}</span>
            </div>

            <div className="bg-slate-950/70 rounded border border-slate-800 divide-y divide-slate-800/60 font-mono text-[11px]">
              <div className="px-2.5 py-1 flex items-center justify-between">
                <span className="text-slate-400">Federal Income Tax</span>
                <span className="text-rose-400">-{formatCurrency(calc.federalTaxPerPay)}</span>
              </div>
              <div className="px-2.5 py-1 flex items-center justify-between">
                <span className="text-slate-400">Social Security (OASDI 6.2%)</span>
                <span className="text-rose-400">-{formatCurrency(calc.socialSecurityTaxPerPay)}</span>
              </div>
              <div className="px-2.5 py-1 flex items-center justify-between">
                <span className="text-slate-400">Medicare (HI 1.45%)</span>
                <span className="text-rose-400">-{formatCurrency(calc.medicareTaxPerPay)}</span>
              </div>
              {calc.stateTaxPerPay > 0 && (
                <div className="px-2.5 py-1 flex items-center justify-between">
                  <span className="text-slate-400">State Income Tax</span>
                  <span className="text-rose-400">-{formatCurrency(calc.stateTaxPerPay)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Big Highlight Voucher */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                  Net Take-Home Pay
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {formatCurrency(calc.netPayPerPay)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Annualized:</span>
              <span className="text-xs font-mono text-slate-200 font-semibold">
                {formatCurrency(calc.netPayAnnual, false)}/yr
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
