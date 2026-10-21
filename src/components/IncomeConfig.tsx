import React from 'react';
import { FilingStatus, PayrollFrequency, UserTaxProfile } from '../types/tax';
import { formatCurrency } from '../utils/taxCalculations';

interface IncomeConfigProps {
  profile: UserTaxProfile;
  onChange: (updated: Partial<UserTaxProfile>) => void;
  annualGross: number;
  paycheckGross: number;
}

export const IncomeConfig: React.FC<IncomeConfigProps> = ({
  profile,
  onChange,
  annualGross,
  paycheckGross,
}) => {
  const handleHourlyChange = (rate: number) => {
    onChange({
      hourlyRate: rate,
      annualGrossSalary: Math.round(rate * profile.annualHours),
    });
  };

  const handleSalaryChange = (salary: number) => {
    onChange({
      annualGrossSalary: salary,
      hourlyRate: Math.round((salary / profile.annualHours) * 100) / 100,
    });
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        
        {/* Gross Wages */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 font-medium">Annual Gross Income:</span>
          <span className="font-mono font-bold text-emerald-400">
            {formatCurrency(annualGross, false)}
          </span>
          <span className="font-mono text-slate-500 text-[10px]">
            ({formatCurrency(paycheckGross)}/ck)
          </span>
        </div>

        {/* Inputs Group: Rate, Status, Frequency, State */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rate / Salary */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onChange({ incomeMode: profile.incomeMode === 'HOURLY' ? 'SALARY' : 'HOURLY' })}
              className="text-[10px] text-slate-400 underline hover:text-slate-200 font-medium"
            >
              {profile.incomeMode === 'HOURLY' ? 'Hourly Rate:' : 'Annual Salary:'}
            </button>
            <div className="relative">
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 font-mono">$</span>
              {profile.incomeMode === 'HOURLY' ? (
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={profile.hourlyRate}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleHourlyChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 bg-slate-950 border border-slate-700 rounded px-1 pl-3.5 py-0.5 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={profile.annualGrossSalary}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleSalaryChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-20 bg-slate-950 border border-slate-700 rounded px-1 pl-3.5 py-0.5 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              )}
            </div>
          </div>

          {/* Tax Filing Status */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium">Tax Filing Status:</span>
            <select
              value={profile.filingStatus}
              onChange={(e) => onChange({ filingStatus: e.target.value as FilingStatus })}
              className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="MFJ">MFJ (Joint)</option>
              <option value="SINGLE">Single</option>
              <option value="HOH">HOH</option>
              <option value="MFS">MFS</option>
            </select>
          </div>

          {/* Pay Frequency */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium">Pay Frequency:</span>
            <select
              value={profile.frequency}
              onChange={(e) => onChange({ frequency: e.target.value as PayrollFrequency })}
              className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="BI_WEEKLY">Bi-Weekly (26)</option>
              <option value="SEMI_MONTHLY">Semi-Monthly (24)</option>
              <option value="MONTHLY">Monthly (12)</option>
              <option value="WEEKLY">Weekly (52)</option>
            </select>
          </div>

          {/* State Tax Rate */}
          <div className="flex items-center gap-0.5">
            <span className="text-slate-400">State:</span>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="13.3"
                value={profile.stateTaxRate}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onChange({ stateTaxRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-12 bg-slate-950 border border-slate-700 rounded px-1 pr-3.5 py-0.5 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-emerald-500 text-right"
              />
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-500">%</span>
            </div>
          </div>

          {/* Catch-Up */}
          <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer hover:text-slate-200 shrink-0">
            <input
              type="checkbox"
              checked={profile.isAge50Plus}
              onChange={(e) => onChange({ isAge50Plus: e.target.checked })}
              className="rounded border-slate-700 text-emerald-500 bg-slate-950 w-3 h-3"
            />
            <span>50+</span>
          </label>
        </div>

      </div>
    </div>
  );
};
