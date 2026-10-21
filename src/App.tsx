/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ActiveTab, Header } from './components/Header';
import { StickyTaxShelterBar } from './components/StickyTaxShelterBar';
import { IncomeConfig } from './components/IncomeConfig';
import { DeductionSliders } from './components/DeductionSliders';
import { PayStubView } from './components/PayStubView';
import { SideBySideComparisonView } from './components/SideBySideComparisonView';
import { TaxLeaksInspectorView } from './components/TaxLeaksInspectorView';
import { IrsLimitsReferenceView } from './components/IrsLimitsReferenceView';
import { DeductionsState, UserTaxProfile } from './types/tax';
import { computeTaxAndPayroll, DEFAULT_PROFILE, PDF_BASELINE_PROFILE } from './utils/taxCalculations';
import { exportAnalysisToPdf } from './utils/exportPdf';

export default function App() {
  const [profile, setProfile] = useState<UserTaxProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Compute all taxes, payroll and metrics in real-time
  const calc = useMemo(() => computeTaxAndPayroll(profile), [profile]);

  // Handlers for profile updates
  const handleProfileChange = (updated: Partial<UserTaxProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleDeductionChange = (updated: Partial<DeductionsState>) => {
    setProfile((prev) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        ...updated,
      },
    }));
  };

  // Preset: Maximize all pre-tax statutory caps
  const handleMaximizePreTax = () => {
    setProfile((prev) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        k401: calc.k401MaxLimit,
        hsa: calc.hsaMaxLimit,
        spousalIra: calc.iraMaxLimit,
      },
    }));
  };

  // Reset all input values to 0
  const handleReset = () => {
    setProfile(DEFAULT_PROFILE);
  };

  // Export current summary analysis to PDF asynchronously
  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportAnalysisToPdf(profile, calc);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* 3-Zone Header Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        onMaximizePreTax={handleMaximizePreTax}
        onReset={handleReset}
      />

      {/* Main Viewport Container - Auto-fit max-w-6xl */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-3 space-y-3">
        
        {/* VIEW 1: COMMAND CENTER (AUTO-FIT SCREEN, BALANCED & COMPACT) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3">
            {/* Sticky Tax Shelters & Leaks Banner at the Very Top */}
            <StickyTaxShelterBar
              calc={calc}
              onMaximizePreTax={handleMaximizePreTax}
            />

            {/* Income & Profile Settings Toolbar */}
            <IncomeConfig
              profile={profile}
              onChange={handleProfileChange}
              annualGross={calc.annualGross}
              paycheckGross={calc.paycheckGross}
            />

            {/* Pre-Tax Deductions Sliders & Tweakers in Balanced 3-Card Grid */}
            <DeductionSliders
              deductions={profile.deductions}
              onChange={handleDeductionChange}
              frequency={profile.frequency}
              calc={calc}
            />
          </div>
        )}

        {/* VIEW 2: SIDE-BY-SIDE TRADEOFF SCENARIO ANALYSIS */}
        {activeTab === 'comparison' && (
          <SideBySideComparisonView
            currentProfile={profile}
            onApplyMaximized={handleMaximizePreTax}
          />
        )}

        {/* VIEW 3: TAX LEAKS & ALPHA AUDIT */}
        {activeTab === 'leaks' && (
          <TaxLeaksInspectorView
            calc={calc}
            profile={profile}
            onUpdateDeduction={(key, val) => handleDeductionChange({ [key]: val })}
            onMaximizeAll={handleMaximizePreTax}
          />
        )}

        {/* VIEW 4: OFFICIAL PAY STATEMENT (VOUCHER BREAKDOWN) */}
        {activeTab === 'pay_stub' && (
          <div className="max-w-4xl mx-auto py-1">
            <PayStubView
              calc={calc}
              frequency={profile.frequency}
              hourlyRate={profile.hourlyRate}
              annualHours={profile.annualHours}
            />
          </div>
        )}

        {/* VIEW 5: 2026 IRS STATUTORY LIMITS REFERENCE */}
        {activeTab === 'irs_limits' && (
          <IrsLimitsReferenceView />
        )}

      </main>

      {/* Footer: Developed by Designs2Love */}
      <footer className="border-t border-slate-900 bg-slate-950 py-2.5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            TaxWise · Payroll & Deduction Tax Maximizer
          </span>
          <div className="text-slate-400">
            Developed by <span className="text-slate-200 font-semibold">Designs2Love</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>SS Cap: $184,500</span>
            <span>·</span>
            <span>401(k): $24,500</span>
            <span>·</span>
            <span>HSA Family: $8,750</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
