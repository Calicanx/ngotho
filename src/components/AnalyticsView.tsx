import React from 'react';
import { Property, Unit, Tenant, Payment, MaintenanceRequest } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Users 
} from 'lucide-react';

interface AnalyticsViewProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  payments: Payment[];
  maintenance: MaintenanceRequest[];
  settings: AppSettings;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  properties,
  units,
  tenants,
  payments,
  maintenance,
  settings,
}) => {
  // Monthly expected gross
  const expectedMonthlyRoll = units
    .filter((u) => u.status === 'occupied')
    .reduce((acc, u) => acc + u.monthlyRent, 0);

  // Full potential roll if 100% occupied
  const fullPotentialRoll = units.reduce((acc, u) => acc + u.monthlyRent, 0);

  // Total collected all-time
  const totalCollectedAllTime = payments.reduce((acc, p) => acc + p.amount, 0);

  // September 2026 collections
  const sepCollected = payments
    .filter((p) => p.forMonth.toLowerCase().includes('september 2026') || p.paymentDate.startsWith('2026-09'))
    .reduce((acc, p) => acc + p.amount, 0);

  // Total maintenance expenses all-time
  const totalMaintenanceExpense = maintenance.reduce(
    (acc, m) => acc + (m.actualCost || m.estimatedCost || 0),
    0
  );

  // Net Operating Income
  const netIncome = totalCollectedAllTime - totalMaintenanceExpense;

  // Arrears
  const totalArrears = tenants.reduce((acc, t) => acc + (t.balance > 0 ? t.balance : 0), 0);

  // Unit Types breakdown
  const unitTypeStats = units.reduce((acc, unit) => {
    if (!acc[unit.type]) {
      acc[unit.type] = { count: 0, occupied: 0, totalRent: 0 };
    }
    acc[unit.type].count++;
    if (unit.status === 'occupied') acc[unit.type].occupied++;
    acc[unit.type].totalRent += unit.monthlyRent;
    return acc;
  }, {} as Record<string, { count: number; occupied: number; totalRent: number }>);

  // Payment methods breakdown
  const paymentMethodsStats = payments.reduce((acc, p) => {
    acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          Financial Reports & Portfolio Analytics
        </h2>
        <p className="text-xs text-[#736E65]">
          Executive property yield metrics, collection performance, expense ratios, and occupancy health.
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold text-[#8F8A7E] uppercase tracking-wider">Gross Rent Roll (Monthly)</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
            {StorageService.formatCurrency(expectedMonthlyRoll, settings.currencySymbol)}
          </div>
          <p className="text-xs text-[#736E65] mt-1 font-serif italic">
            Potential 100%: {StorageService.formatCurrency(fullPotentialRoll, settings.currencySymbol)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold text-[#8F8A7E] uppercase tracking-wider">Net Operating Yield</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#24482B] mt-1">
            {StorageService.formatCurrency(netIncome, settings.currencySymbol)}
          </div>
          <p className="text-xs text-[#736E65] mt-1 font-serif italic">
            After {StorageService.formatCurrency(totalMaintenanceExpense, settings.currencySymbol)} repairs
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold text-[#8F8A7E] uppercase tracking-wider">Arrears Rate</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2C24] mt-1">
            {StorageService.formatCurrency(totalArrears, settings.currencySymbol)}
          </div>
          <p className="text-xs text-[#736E65] mt-1 font-serif italic">
            {tenants.filter((t) => t.balance > 0).length} overdue tenant accounts
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold text-[#8F8A7E] uppercase tracking-wider">Collection Efficiency</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
            {expectedMonthlyRoll > 0 ? Math.round((sepCollected / expectedMonthlyRoll) * 100) : 0}%
          </div>
          <p className="text-xs text-[#736E65] mt-1 font-serif italic">
            Sep 2026 remittances on schedule
          </p>
        </div>
      </div>

      {/* Estate Performance Comparison */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Estates Occupancy & Rent Yield Comparison</h3>
        <div className="space-y-4">
          {properties.map((prop) => {
            const propUnits = units.filter((u) => u.propertyId === prop.id);
            const occupied = propUnits.filter((u) => u.status === 'occupied').length;
            const rate = propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : 0;
            const roll = propUnits.reduce((acc, u) => acc + u.monthlyRent, 0);

            return (
              <div key={prop.id} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">{prop.name}</span>
                    <span className="text-[#736E65] font-serif italic">({prop.location})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#736E65] font-mono">
                      {occupied}/{propUnits.length} units
                    </span>
                    <span className="font-serif font-bold text-[#1A1A1A]">
                      {StorageService.formatCurrency(roll, settings.currencySymbol)}/mo
                    </span>
                    <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] border ${
                      rate >= 80 ? 'bg-[#EBF0EB] text-[#24482B] border-[#D0E0D2]' : 'bg-[#FBF5E8] text-[#7A571A] border-[#F2E3C6]'
                    }`}>
                      {rate}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      rate >= 80 ? 'bg-[#24482B]' : 'bg-[#7A571A]'
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns: Unit Types & Payment Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* House Type Analytics */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
          <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Portfolio by House Category</h3>
          <div className="divide-y divide-[#EFECE5] text-xs">
            {(Object.entries(unitTypeStats) as [string, { count: number; occupied: number; totalRent: number }][]).map(([type, stats]) => (
              <div key={type} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1A1A1A]">{type}</p>
                  <p className="text-[11px] text-[#736E65]">{stats.occupied} of {stats.count} occupied</p>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-[#1A1A1A]">
                    {StorageService.formatCurrency(stats.totalRent, settings.currencySymbol)}
                  </p>
                  <p className="text-[11px] text-[#8F8A7E]">
                    Avg {StorageService.formatCurrency(Math.round(stats.totalRent / stats.count), settings.currencySymbol)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
          <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Rent Collection Channels</h3>
          <div className="space-y-3 text-xs pt-1">
            {(Object.entries(paymentMethodsStats) as [string, number][]).map(([method, amount]) => {
              const pct = totalCollectedAllTime > 0 ? Math.round((amount / totalCollectedAllTime) * 100) : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#1A1A1A]">{method}</span>
                    <span className="font-serif font-bold text-[#1A1A1A]">
                      {StorageService.formatCurrency(amount, settings.currencySymbol)} <span className="font-sans font-normal text-xs text-[#736E65]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#1A1A1A] h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
