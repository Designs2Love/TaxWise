import { TaxCalculationResult, UserTaxProfile, FREQUENCIES } from '../types/tax';
import { formatCurrency } from './taxCalculations';

export async function exportAnalysisToPdf(profile: UserTaxProfile, calc: TaxCalculationResult): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 45;

  // Helper for alternating row backgrounds
  const setRowBg = (isEven: boolean) => {
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
  };

  // Header Bar / Branding
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('TaxWise', margin, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Payroll & Tax Deduction Optimization Summary', margin, 54);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Generated: ${currentDate}`, pageWidth - margin - 120, 54);

  y = 95;

  // Profile Overview Card
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 54, 4, 4, 'FD');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFILE CONFIGURATION', margin + 12, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const freqLabel = FREQUENCIES[profile.frequency]?.label || profile.frequency;
  const statusLabels: Record<string, string> = {
    MFJ: 'Married Filing Jointly',
    SINGLE: 'Single',
    HOH: 'Head of Household',
    MFS: 'Married Filing Separately',
  };

  doc.text(`Tax Filing Status: ${statusLabels[profile.filingStatus] || profile.filingStatus}`, margin + 12, y + 32);
  doc.text(`Pay Frequency: ${freqLabel}`, margin + 12, y + 45);

  doc.text(`Annual Gross: ${formatCurrency(calc.annualGross, false)}`, margin + 260, y + 32);
  doc.text(`Paycheck Gross: ${formatCurrency(calc.paycheckGross)}`, margin + 260, y + 45);

  doc.text(`State Tax Rate: ${profile.stateTaxRate}%`, margin + 400, y + 32);
  doc.text(`Age 50+ Catch-up: ${profile.isAge50Plus ? 'Yes' : 'No'}`, margin + 400, y + 45);

  y += 70;

  // Key Results Highlight Strip
  const colW = (contentWidth - 16) / 3;

  // Box 1: Take-Home Pay
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, y, colW, 48, 4, 4, 'FD');
  doc.setTextColor(6, 95, 70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('NET TAKE-HOME PER CHECK', margin + 10, y + 15);
  doc.setFontSize(14);
  doc.text(formatCurrency(calc.netPayPerPay), margin + 10, y + 36);

  // Box 2: Annual Tax Saved
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(margin + colW + 8, y, colW, 48, 4, 4, 'FD');
  doc.setTextColor(55, 48, 163);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ANNUAL TAX SHIELD CREATED', margin + colW + 18, y + 15);
  doc.setFontSize(14);
  doc.text(formatCurrency(calc.annualTaxSavingsVsZeroDeduction, false), margin + colW + 18, y + 36);

  // Box 3: Avoidable Tax Leaks
  const isLeaking = calc.totalMoneyLostInTaxes > 0;
  if (isLeaking) {
    doc.setFillColor(255, 251, 235); // amber-50
    doc.setDrawColor(253, 230, 138); // amber-200
  } else {
    doc.setFillColor(240, 253, 244); // emerald-50
    doc.setDrawColor(187, 247, 208); // emerald-200
  }
  doc.roundedRect(margin + (colW + 8) * 2, y, colW, 48, 4, 4, 'FD');
  if (isLeaking) {
    doc.setTextColor(146, 64, 14);
  } else {
    doc.setTextColor(22, 101, 52);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(isLeaking ? 'AVOIDABLE TAX LEAK' : 'TAX SHELTERS STATUS', margin + (colW + 8) * 2 + 10, y + 15);
  doc.setFontSize(14);
  doc.text(isLeaking ? `-${formatCurrency(calc.totalMoneyLostInTaxes, false)}/yr` : '100% Maximized', margin + (colW + 8) * 2 + 10, y + 36);

  y += 64;

  // Section: Deductions & Taxes Breakdown (2 Column Table)
  const halfW = (contentWidth - 12) / 2;

  // Left Table: Pre-Tax Deductions
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, halfW, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PRE-TAX DEDUCTIONS', margin + 8, y + 14);
  doc.text('PER CHECK', margin + halfW - 70, y + 14);

  let leftY = y + 20;
  const deductionsList = [
    { name: '401(k) / 403(b) Retirement', perPay: calc.k401PerPay },
    { name: 'Health Savings Account (HSA)', perPay: calc.hsaPerPay },
    { name: 'Spousal Traditional IRA', perPay: calc.spousalIraPerPay },
    { name: 'Medical Insurance Premium', perPay: calc.medicalPerPay },
    { name: 'Dental Insurance Premium', perPay: calc.dentalPerPay },
    { name: 'Vision Insurance Premium', perPay: calc.visionPerPay },
    { name: 'Accident Insurance', perPay: calc.accidentPerPay },
    { name: 'Critical Illness Insurance', perPay: calc.criticalIllnessPerPay },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  deductionsList.forEach((item, idx) => {
    setRowBg(idx % 2 === 0);
    doc.rect(margin, leftY, halfW, 16, 'F');
    doc.setTextColor(51, 65, 85);
    doc.text(item.name, margin + 8, leftY + 11);
    doc.text(formatCurrency(item.perPay), margin + halfW - 65, leftY + 11);
    leftY += 16;
  });

  // Total Deductions Row
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, leftY, halfW, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Total Pre-Tax Deductions', margin + 8, leftY + 12);
  doc.text(formatCurrency(calc.totalDeductionsPerPay), margin + halfW - 65, leftY + 12);

  // Right Table: Taxes Withheld
  const rightX = margin + halfW + 12;
  doc.setFillColor(15, 23, 42);
  doc.rect(rightX, y, halfW, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TAXES WITHHELD', rightX + 8, y + 14);
  doc.text('PER CHECK', rightX + halfW - 70, y + 14);

  let rightY = y + 20;
  const taxesList = [
    { name: 'Federal Income Tax', perPay: calc.federalTaxPerPay },
    { name: 'Social Security Tax (6.2%)', perPay: calc.socialSecurityTaxPerPay },
    { name: 'Medicare Tax (1.45%)', perPay: calc.medicareTaxPerPay },
    { name: `State Income Tax (${profile.stateTaxRate}%)`, perPay: calc.stateTaxPerPay },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  taxesList.forEach((item, idx) => {
    setRowBg(idx % 2 === 0);
    doc.rect(rightX, rightY, halfW, 16, 'F');
    doc.setTextColor(51, 65, 85);
    doc.text(item.name, rightX + 8, rightY + 11);
    doc.text(formatCurrency(item.perPay), rightX + halfW - 65, rightY + 11);
    rightY += 16;
  });

  // Fill remaining space to match left table height
  for (let i = 0; i < 4; i++) {
    setRowBg(i % 2 === 0);
    doc.rect(rightX, rightY, halfW, 16, 'F');
    rightY += 16;
  }

  // Total Taxes Row
  doc.setFillColor(241, 245, 249);
  doc.rect(rightX, rightY, halfW, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Total Taxes Withheld', rightX + 8, rightY + 12);
  doc.text(formatCurrency(calc.totalTaxPerPay), rightX + halfW - 65, rightY + 12);

  y = Math.max(leftY, rightY) + 30;

  // Annual Totals Summary Banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 54, 4, 4, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ANNUALIZED TOTALS SUMMARY', margin + 12, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Annual Gross: ${formatCurrency(calc.annualGross, false)}`, margin + 12, y + 32);
  doc.text(`Pre-Tax Deductions: ${formatCurrency(calc.totalPreTaxAnnual, false)}`, margin + 12, y + 45);

  doc.text(`Federal Taxable Income: ${formatCurrency(calc.federalTaxableIncome, false)}`, margin + 180, y + 32);
  doc.text(`Total Annual Taxes: ${formatCurrency(calc.totalTaxAnnual, false)}`, margin + 180, y + 45);

  doc.text(`Effective Tax Rate: ${calc.effectiveTaxRate}%`, margin + 370, y + 32);
  doc.text(`Net Take-Home Pay (Yr): ${formatCurrency(calc.netPayAnnual, false)}`, margin + 370, y + 45);

  y += 75;

  // Avoidable Tax Leaks Breakdown (if applicable)
  if (isLeaking) {
    doc.setFillColor(254, 242, 242); // rose-50
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, contentWidth, 48, 4, 4, 'FD');

    doc.setTextColor(153, 27, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('UNRECLAIMED TAX SHELTERS & LEAKS', margin + 12, y + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    const leakDetails = [];
    if (calc.k401LostMoney > 0) leakDetails.push(`401(k) Unused: -${formatCurrency(calc.k401LostMoney, false)} in taxes`);
    if (calc.hsaLostMoney > 0) leakDetails.push(`HSA Unused: -${formatCurrency(calc.hsaLostMoney, false)} (Fed + FICA)`);
    if (calc.iraLostMoney > 0) leakDetails.push(`Spousal IRA Unused: -${formatCurrency(calc.iraLostMoney, false)} in taxes`);

    doc.text(leakDetails.join('   |   '), margin + 12, y + 34);
    y += 60;
  }

  // Footer: Developed by Designs2Love
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 740, pageWidth - margin, 740);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by TaxWise · Payroll & Tax Deduction Maximizer', margin, 755);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Developed by Designs2Love', pageWidth - margin - 130, 755);

  doc.save('TaxWise_Analysis_Summary.pdf');
}
