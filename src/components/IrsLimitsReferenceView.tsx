import React from 'react';
import { FEDERAL_TAX_BRACKETS_2026, FilingStatus, STATUTORY_LIMITS_2026 } from '../types/tax';
import { formatCurrency } from '../utils/taxCalculations';
import { BookOpen, Scale } from 'lucide-react';

export const IrsLimitsReferenceView: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = React.useState<FilingStatus>('MFJ');

  return (
    <div className="space-y-3">
      {/* Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              2026 IRS Statutory Caps & Progressive Brackets
            </h2>
            <p className="text-[11px] text-slate-300">
              Statutory limits modeled for tax year 2026. Pre-tax contributions bypass income tax up to these statutory thresholds.
            </p>
          </div>
        </div>
      </div>

      {/* Statutory Limits 4-Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Social Security */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Social Security Cap
          </div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            {formatCurrency(STATUTORY_LIMITS_2026.socialSecurityWageBase, false)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            6.2% FICA on wages up to $184,500. Wages above are exempt.
          </p>
        </div>

        {/* Medicare */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Medicare Threshold
          </div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            $250,000 <span className="text-[10px] font-sans text-slate-400 font-normal">(MFJ)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            1.45% base, plus 0.9% additional tax above threshold.
          </p>
        </div>

        {/* 401(k) / 403(b) */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            401(k) / 403(b) Deferral
          </div>
          <div className="text-base font-bold font-mono text-indigo-400 mt-0.5">
            {formatCurrency(STATUTORY_LIMITS_2026.k401Limit, false)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            Elective employee cap. Age 50+ catch-up: +$7,500 ($32,000).
          </p>
        </div>

        {/* HSA */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            HSA Family Cap
          </div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            {formatCurrency(STATUTORY_LIMITS_2026.hsaFamilyLimit, false)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            Single: $4,300. Age 55+: +$1,000. Exempt from FICA + Fed tax.
          </p>
        </div>
      </div>

      {/* Federal Income Tax Brackets Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white">
              Projected 2026 Progressive Federal Brackets
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
            <button
              onClick={() => setSelectedStatus('MFJ')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedStatus === 'MFJ' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Married Joint
            </button>
            <button
              onClick={() => setSelectedStatus('SINGLE')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedStatus === 'SINGLE' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setSelectedStatus('HOH')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedStatus === 'HOH' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Head of Household
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-1.5 px-3">Bracket Rate</th>
                <th className="py-1.5 px-3">Taxable Income Range (After Standard & Pre-Tax Deductions)</th>
                <th className="py-1.5 px-3 text-right">Tax Owed in Bracket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {FEDERAL_TAX_BRACKETS_2026[selectedStatus].map((bracket, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-1 px-3 font-sans font-semibold text-emerald-400">
                    {Math.round(bracket.rate * 100)}%
                  </td>
                  <td className="py-1 px-3 text-slate-300">
                    {bracket.max !== null ? (
                      <>
                        {formatCurrency(bracket.min, false)} to {formatCurrency(bracket.max, false)}
                      </>
                    ) : (
                      <>Over {formatCurrency(bracket.min, false)}</>
                    )}
                  </td>
                  <td className="py-1 px-3 text-right text-slate-400">
                    {bracket.max !== null
                      ? `Max ${formatCurrency((bracket.max - bracket.min) * bracket.rate, false)}`
                      : `${Math.round(bracket.rate * 100)}% on excess`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
