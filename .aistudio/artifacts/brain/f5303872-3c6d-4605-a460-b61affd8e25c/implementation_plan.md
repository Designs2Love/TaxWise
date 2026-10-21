# TaxWise: 2026 Payroll & Deduction Tax Maximizer

A responsive, high-density financial command center that recalculates annual taxes and per-paycheck stubs side-by-side in real-time as users adjust above-the-line, invisible pre-tax deductions and benefits. It highlights exactly where and how much money is lost to avoidable taxes, complete with informative tooltips and instant optimization presets.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed through Phase 1 user interview questions and direct analysis of the attached payroll document (`PE_85c65226.pdf`):

- **Confirmed Decision 1 (Tax Scope)**: Include optional State Tax with customizable effective rate alongside Federal income tax brackets (2026 projected rates/standard deductions) and statutory FICA taxes (Social Security at 6.2% up to $184,500 wage base, Medicare at 1.45% plus 0.9% additional tax over $250k for MFJ).
- **Confirmed Decision 2 (Layout & Responsive Fit)**: High-density dual-column command center with synchronized Annual Tax Overview and Pay Stub Breakdown, engineered to auto-scale and fit desktop, laptop, and mobile screens without horizontal or vertical clashing.
- **Confirmed Decision 3 (Quick Actions & Presets)**: Provide 1-click optimization presets ("Maximize Pre-Tax & Above-the-Line", "Reset to PDF Sample Data", "Zero Deductions Benchmark") alongside interactive sliders and currency inputs.

---

### 1. Overview & Core Concept

- **What It Does**: Bridges the disconnect between annual tax returns and regular paycheck deductions. As workers adjust pre-tax deductions (401(k)/403(b), HSA, Medical/Dental/Vision premiums, Section 125 supplemental insurance) and above-the-line deductions (Spousal Traditional IRA), the app continuously models:
  1. **Annual Tax Impact**: Gross income, adjusted gross income (AGI), taxable income, Federal tax liability (bracket-by-bracket), FICA taxes (Social Security & Medicare), and optional State tax.
  2. **Pay Stub Translation**: Exact per-period deductions and net take-home pay based on payroll frequency (Bi-Weekly 26 periods, Semi-Monthly 24, Monthly 12, Weekly 52).
  3. **"Money Lost in Taxes" Intelligence**: Visual amber/crimson callouts and tooltips showing dollar-for-dollar tax money surrendered to the IRS when tax-advantaged vehicles (401k, HSA, IRA) are underfunded below IRS statutory caps.
- **Target Audience / Persona**: Salaried and hourly W-2 employees, married couples filing jointly, dual-earner households, and HR/financial planners seeking to optimize take-home pay and tax alpha.
- **Key Value**: Immediate clarity on how a $100 pre-tax deduction only reduces paycheck take-home by $65-$75 due to pre-tax tax shielding, preventing tax forfeiture.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Income & Profile Configuration*: Select filing year (2026), status (Married Filing Jointly, Single, Head of Household), payroll frequency (Bi-Weekly default), wage inputs (Hourly $73.85 × 2080 hrs or Annual Salary $153,608).
  2. *Interactive Deduction Tuning*: Tweak 401(k)/403(b), HSA, Medical, Dental, Vision, Accident, Critical Illness, and Spousal IRA using numeric inputs, sliders, or 1-click preset buttons.
  3. *Side-by-Side Live Synchrony*:
     - **Left Column**: Annual Overview & Tax Shield Analytics (Gross Income, Pre-tax deductions, FICA, Federal Tax, Net Annual Savings, and Unused Deduction Tax Loss Warning).
     - **Right Column**: Authentic Pay Stub breakdown (Gross per pay period, statutory withholdings, health & supplemental pre-tax premiums, retirement deductions, and Net Take-Home Pay).
  4. *Visual Heat & Tax Loss Indicators*: Subtle crimson/amber color-coded badges and hover tooltips showing:
     - 401(k) underfunding tax penalty (e.g., $8 under max = lost tax savings at user's marginal rate).
     - HSA underfunding (e.g., under $8,750 family cap avoids FICA 7.65% + Federal marginal rate!).
     - Spousal IRA underfunding below $7,500 limit.
  5. *Preset Quick Shifts*: "Maximize All Pre-Tax" instantly sets deductions to IRS limits; "Load PDF Sample" matches the attached document numbers ($153,608 gross, $24,492 401k, $8,499.92 HSA, $7,499.96 IRA, exact insurance premiums).

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Refined Swiss financial ledger meets modern SaaS analytics. Crisp hairline borders, high-density tabular typography, zero-pill metadata restraint.
  - *Color Palette & Tokens*:
    - Canvas Background: Crisp neutral slate (`#0B0F19` dark / `#F8FAFC` light; dark/light mode toggle with default high-contrast dark financial slate).
    - Surfaces & Cards: Subdued dark slate surface (`#111827`) with 1px neutral hairline dividers (`border-slate-800`).
    - Accent / Primary: Emerald Green (`#10B981`) for tax savings and maximized benefits.
    - Warning / Tax Loss: Amber (`#F59E0B`) and Rose/Crimson (`#F43F5E`) highlighting uncaptured tax shelters.
    - Informational: Indigo/Sky (`#38BDF8`) for statutory limits and tooltips.
  - *Typography & Hierarchy*:
    - Display & Headings: `Plus Jakarta Sans` or modern clean geometric sans, bold 600/700 with `text-wrap: balance`.
    - Data Figures & Pay Stub: Monospace tabular numerals (`font-mono tabular-nums`) with right-alignment for financial metrics.
  - *Responsive Auto-Scale*:
    - Uses CSS grid `grid-cols-1 xl:grid-cols-12` with flex containers, dynamic clamp sizing, and compact spacing (`p-3 sm:p-4 md:p-6`) to comfortably fit viewport heights without cramped vertical or horizontal scrollbars on desktop viewports.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: 2026 Federal Tax Bracket & Statutory Limits Engine**
  - *Chosen Approach*: Implement an exact progressive bracket calculator using projected 2026 IRS tax brackets for MFJ, Single, and HOH, incorporating standard deductions ($30,000 for MFJ in 2026 projection) and FICA wage caps ($184,500 Social Security cap at 6.2%, Medicare 1.45% + 0.9% additional surtax over $250k for MFJ).
  - *Why*: Accurate tax figures matching the attached PDF's numbers down to cents.
  - *Alternatives Considered*: Flat tax approximation (rejected as misleading for progressive brackets).

- **Decision 2: Section 125 vs Retirement Pre-Tax Distinction**
  - *Chosen Approach*: Accurately differentiate deductions that reduce FICA + Federal Tax (HSA, Medical, Dental, Vision) from deductions that reduce Federal Tax only but are subject to FICA (401k/403b, Traditional IRA).
  - *Why*: HSA and Section 125 health premiums save an additional 7.65% in FICA taxes that 401(k) does not; explicitly demonstrating this in tooltips teaches users true tax alpha.

- **Decision 3: Standalone Client-Side React Architecture**
  - *Chosen Approach*: Zero external network dependencies for calculations; reactive Zustand-style or pure React state with instant recalculation on slider or input change.
  - *Why*: Instant sub-millisecond feedback on every keystroke, fully functional offline and in sandbox iframe.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TaxWise Main Dashboard                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Top Bar: Title Wordmark · Mode / Presets · Export / Reset Action   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────┐  ┌───────────────────────────────────┐ │
│ │    Left: Annual Tax Engine  │  │      Right: Live Pay Stub View    │ │
│ │ ├─ Income & Profile Config  │  │ ├─ Pay Period Selector (Bi-Weekly)│ │
│ │ ├─ Pre-Tax Benefit Sliders  │  │ ├─ Gross Paycheck Amount          │ │
│ │ ├─ Tax Liability Breakdown  │  │ ├─ Pre-Tax Health Deductions     │ │
│ │ │  (Fed, FICA, State)       │  │ ├─ Retirement Deductions          │ │
│ │ ├─ ⚠ Tax Loss Alert Matrix  │  │ ├─ Statutory Tax Withholdings     │ │
│ │ └─ Maximize Savings Presets │  │ └─ Net Take-Home Pay Banner       │ │
│ └─────────────────────────────┘  └───────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  Bottom Bar: Tax Shield Summary & Marginal vs Effective Tax Rates  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

- **Core Data Model (`TaxProfile`)**:
  - `filingStatus`: `'MFJ' | 'SINGLE' | 'HOH'`
  - `taxYear`: `2026`
  - `frequency`: `'BI_WEEKLY' (26) | 'SEMI_MONTHLY' (24) | 'MONTHLY' (12) | 'WEEKLY' (52)`
  - `incomeMode`: `'SALARY' | 'HOURLY'`
  - `hourlyRate`: `number` (default: 73.85)
  - `annualHours`: `number` (default: 2080)
  - `annualGross`: `number` (default: 153608)
  - `stateTaxRate`: `number` (default: 0%, user customizable)
  - `deductions`:
    - `k401`: `number` (cap: 24,500)
    - `hsa`: `number` (cap: 8,750)
    - `spousalIra`: `number` (cap: 7,500)
    - `medical`: `number` (annualized from per-period)
    - `dental`: `number`
    - `vision`: `number`
    - `accident`: `number`
    - `criticalIllness`: `number`
- **Output Metrics & Calculations**:
  - `ficaWages`: `gross - (medical + dental + vision + hsa)`
  - `socialSecurityTax`: `6.2% * min(ficaWages, 184500)`
  - `medicareTax`: `1.45% * ficaWages + (ficaWages > threshold ? 0.9% * (ficaWages - threshold) : 0)`
  - `federalTaxableWages`: `gross - (all pre-tax + above-the-line) - standardDeduction`
  - `federalTax`: progressive bracket calculation
  - `taxSavingsVsZeroDeduction`: taxes paid with 0 deductions minus current taxes paid
  - `moneyLostInTaxes`: tax savings forgone by not contributing up to maximum caps for 401(k), HSA, and IRA.
