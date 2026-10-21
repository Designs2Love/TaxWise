/**
 * Tax & Payroll Profile Types and Statutory 2026 Limits
 */

export type FilingStatus = 'MFJ' | 'SINGLE' | 'HOH' | 'MFS';

export type PayrollFrequency = 'BI_WEEKLY' | 'SEMI_MONTHLY' | 'MONTHLY' | 'WEEKLY';

export interface FrequencyConfig {
  id: PayrollFrequency;
  label: string;
  periodsPerYear: number;
}

export const FREQUENCIES: Record<PayrollFrequency, FrequencyConfig> = {
  BI_WEEKLY: { id: 'BI_WEEKLY', label: 'Bi-Weekly (26 paychecks)', periodsPerYear: 26 },
  SEMI_MONTHLY: { id: 'SEMI_MONTHLY', label: 'Semi-Monthly (24 paychecks)', periodsPerYear: 24 },
  MONTHLY: { id: 'MONTHLY', label: 'Monthly (12 paychecks)', periodsPerYear: 12 },
  WEEKLY: { id: 'WEEKLY', label: 'Weekly (52 paychecks)', periodsPerYear: 52 },
};

export interface StatutoryLimits2026 {
  socialSecurityWageBase: number; // $184,500
  socialSecurityRate: number; // 6.2%
  medicareRate: number; // 1.45%
  additionalMedicareRate: number; // 0.9%
  additionalMedicareThreshold: Record<FilingStatus, number>; // MFJ: 250k, Single: 200k, HOH: 200k, MFS: 125k
  k401Limit: number; // $24,500
  k401CatchUp: number; // $7,500
  hsaFamilyLimit: number; // $8,750
  hsaIndividualLimit: number; // $4,300
  hsaCatchUp: number; // $1,000 (age 55+)
  iraLimit: number; // $7,500
  iraCatchUp: number; // $1,000 (age 50+)
  standardDeduction: Record<FilingStatus, number>; // MFJ: $30,000, Single: $15,000, HOH: $22,500, MFS: $15,000
}

export const STATUTORY_LIMITS_2026: StatutoryLimits2026 = {
  socialSecurityWageBase: 184500,
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: {
    MFJ: 250000,
    SINGLE: 200000,
    HOH: 200000,
    MFS: 125000,
  },
  k401Limit: 24500,
  k401CatchUp: 7500,
  hsaFamilyLimit: 8750,
  hsaIndividualLimit: 4300,
  hsaCatchUp: 1000,
  iraLimit: 7500,
  iraCatchUp: 1000,
  standardDeduction: {
    MFJ: 30000,
    SINGLE: 15000,
    HOH: 22500,
    MFS: 15000,
  },
};

export interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
}

// 2026 Projected Federal Tax Brackets
export const FEDERAL_TAX_BRACKETS_2026: Record<FilingStatus, TaxBracket[]> = {
  MFJ: [
    { rate: 0.10, min: 0, max: 23850 },
    { rate: 0.12, min: 23850, max: 96950 },
    { rate: 0.22, min: 96950, max: 206700 },
    { rate: 0.24, min: 206700, max: 394600 },
    { rate: 0.32, min: 394600, max: 501050 },
    { rate: 0.35, min: 501050, max: 751600 },
    { rate: 0.37, min: 751600, max: null },
  ],
  SINGLE: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: null },
  ],
  HOH: [
    { rate: 0.10, min: 0, max: 17000 },
    { rate: 0.12, min: 17000, max: 64850 },
    { rate: 0.22, min: 64850, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250500 },
    { rate: 0.35, min: 250500, max: 626350 },
    { rate: 0.37, min: 626350, max: null },
  ],
  MFS: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 375800 },
    { rate: 0.37, min: 375800, max: null },
  ],
};

export interface DeductionsState {
  // Pre-Tax Retirement & Above-The-Line (subject to FICA, exempt from Fed/State tax)
  k401: number; // annual
  spousalIra: number; // annual
  
  // Invisible / Section 125 Pre-Tax (Exempt from BOTH FICA and Fed/State tax!)
  hsa: number; // annual
  medical: number; // per paycheck
  dental: number; // per paycheck
  vision: number; // per paycheck
  accident: number; // per paycheck
  criticalIllness: number; // per paycheck
}

export interface UserTaxProfile {
  taxYear: number;
  filingStatus: FilingStatus;
  frequency: PayrollFrequency;
  incomeMode: 'HOURLY' | 'SALARY';
  hourlyRate: number;
  annualHours: number;
  annualGrossSalary: number;
  stateTaxRate: number; // percentage (e.g., 4.5 for 4.5%)
  isAge50Plus: boolean;
  hsaPlanType: 'FAMILY' | 'INDIVIDUAL';
  deductions: DeductionsState;
}

export interface TaxCalculationResult {
  // Income figures
  annualGross: number;
  paycheckGross: number;
  
  // Deductions Breakdown (Annual)
  totalSection125Annual: number; // Health + Dental + Vision + Accident + Critical + HSA
  totalRetirementAnnual: number; // 401k + Spousal IRA
  totalPreTaxAnnual: number;
  
  // Deductions Breakdown (Per Paycheck)
  medicalPerPay: number;
  dentalPerPay: number;
  visionPerPay: number;
  accidentPerPay: number;
  criticalIllnessPerPay: number;
  hsaPerPay: number;
  k401PerPay: number;
  spousalIraPerPay: number;
  totalDeductionsPerPay: number;

  // Taxable Wages
  ficaTaxableWages: number;
  federalTaxableIncome: number;
  stateTaxableIncome: number;
  standardDeduction: number;
  
  // Taxes (Annual)
  socialSecurityTaxAnnual: number;
  medicareTaxAnnual: number;
  ficaTotalAnnual: number;
  federalTaxAnnual: number;
  stateTaxAnnual: number;
  totalTaxAnnual: number;
  
  // Taxes (Per Paycheck)
  socialSecurityTaxPerPay: number;
  medicareTaxPerPay: number;
  ficaTotalPerPay: number;
  federalTaxPerPay: number;
  stateTaxPerPay: number;
  totalTaxPerPay: number;
  
  // Net Take Home Pay
  netPayAnnual: number;
  netPayPerPay: number;
  
  // Tax Rates & Alpha
  effectiveTaxRate: number;
  marginalFederalTaxRate: number;
  combinedMarginalTaxRate: number; // Fed + State + (FICA if applicable)
  
  // Tax Savings & Money Lost Analysis
  annualTaxSavingsVsZeroDeduction: number;
  k401MaxLimit: number;
  hsaMaxLimit: number;
  iraMaxLimit: number;
  k401LostMoney: number;
  hsaLostMoney: number;
  iraLostMoney: number;
  totalMoneyLostInTaxes: number;
  
  // PDF Matching Flag (for reference verification)
  isMatchingPdfBaseline: boolean;
}
