import React from 'react';
import { 
  Property, 
  Unit, 
  Tenant, 
  Payment, 
  MaintenanceRequest 
} from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { 
  TrendingUp, 
  Home, 
  Users, 
  AlertCircle, 
  Wrench, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Printer,
  ChevronRight,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  payments: Payment[];
  maintenance: MaintenanceRequest[];
  settings: AppSettings;
  onNavigateTab: (tab: string) => void;
  onOpenRecordPayment: (tenantId?: string) => void;
  onViewReceipt: (payment: Payment) => void;
  onGenerateNotice: (tenant: Tenant) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  units,
  tenants,
  payments,
  maintenance,
  settings,
  onNavigateTab,
  onOpenRecordPayment,
  onViewReceipt,
  onGenerateNotice,
}) => {
  // Calculations
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === 'occupied').length;
  const vacantUnits = units.filter((u) => u.status === 'vacant').length;
  const maintenanceUnits = units.filter((u) => u.status === 'maintenance').length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Revenue for current month (September 2026)
  const currentMonthPayments = payments.filter(
    (p) => p.forMonth.toLowerCase().includes('september 2026') || p.paymentDate.startsWith('2026-09')
  );
  const collectedRent = currentMonthPayments.reduce((acc, p) => acc + p.amount, 0);

  // Expected monthly rent from all occupied units
  const expectedMonthlyRent = units
    .filter((u) => u.status === 'occupied')
    .reduce((acc, u) => acc + u.monthlyRent, 0);

  // Total arrears across all active tenants
  const totalArrears = tenants.reduce((acc, t) => acc + (t.balance > 0 ? t.balance : 0), 0);

  const collectionRate = expectedMonthlyRent > 0 ? Math.min(100, Math.round((collectedRent / expectedMonthlyRent) * 100)) : 0;

  // Active maintenance issues
  const activeMaintenance = maintenance.filter(
    (m) => m.status === 'reported' || m.status === 'in_progress'
  );

  // Tenants in arrears
  const tenantsInArrears = tenants.filter((t) => t.balance > 0);

  // Recent payments (sorted by date descending)
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 sm:p-7 text-[#F9F7F2] border border-[#2E2B27] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-[#2E2A25] text-[#E5D7B7] border border-[#423C34]">
              Portfolio Registry
            </span>
            <span className="text-[#A39E92] text-xs font-serif italic">
              {properties.length} Estates • {totalUnits} Units Total
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mt-2 text-[#FAF8F5]">
            Ngotho Rental Management Ledger
          </h2>
          <p className="text-xs text-[#B5AFA4] mt-1.5 max-w-xl font-sans leading-relaxed">
            Real-time occupancy tracking, rent collection efficiency, maintenance dispatch, and tenant billing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            id="dash-btn-record-rent"
            onClick={() => onOpenRecordPayment()}
            className="px-4 py-2 text-xs font-semibold bg-[#F9F7F2] hover:bg-[#EAE4D6] active:bg-[#DFD8C7] text-[#1A1A1A] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs border border-[#F9F7F2]"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#1A1A1A]" />
            Record Payment
          </button>
          <button
            id="dash-btn-view-units"
            onClick={() => onNavigateTab('properties')}
            className="px-4 py-2 text-xs font-medium bg-transparent hover:bg-[#2E2A25] text-[#E5D7B7] border border-[#423C34] rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            Explore Houses
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Card */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D3CCBE] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#736E65] uppercase tracking-wider">Occupancy Rate</span>
            <div className="p-2 rounded-lg bg-[#F4F0E8] text-[#1A1A1A]">
              <Home className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#1A1A1A]">{occupancyRate}%</span>
            <span className="text-xs text-[#8A857B] font-mono">
              ({occupiedUnits}/{totalUnits} units)
            </span>
          </div>
          <div className="mt-3.5 flex items-center justify-between text-xs text-[#736E65] pt-2.5 border-t border-[#EFECE5]">
            <span className="text-[#2D5A34] font-medium">{vacantUnits} vacant</span>
            <span className="text-[#966224] font-medium">{maintenanceUnits} in repairs</span>
          </div>
        </div>

        {/* Collected Rent Card */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D3CCBE] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#736E65] uppercase tracking-wider">Collected Rent (Sep)</span>
            <div className="p-2 rounded-lg bg-[#EBF0EB] text-[#24482B]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              {StorageService.formatCurrency(collectedRent, settings.currencySymbol)}
            </span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            <div className="flex justify-between text-[11px] text-[#736E65]">
              <span className="font-serif italic">Target: {StorageService.formatCurrency(expectedMonthlyRent, settings.currencySymbol)}</span>
              <span className="font-semibold text-[#2D5A34] font-mono">{collectionRate}%</span>
            </div>
            <div className="w-full bg-[#EFECE5] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#2D5A34] h-full rounded-full transition-all duration-500" 
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Outstanding Arrears */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D3CCBE] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#736E65] uppercase tracking-wider">Unpaid Arrears</span>
            <div className="p-2 rounded-lg bg-[#FDF0EE] text-[#8C2C24]">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2C24]">
              {StorageService.formatCurrency(totalArrears, settings.currencySymbol)}
            </span>
          </div>
          <div className="mt-3.5 flex items-center justify-between text-xs text-[#736E65] pt-2.5 border-t border-[#EFECE5]">
            <span className="font-medium text-[#736E65]">{tenantsInArrears.length} tenant{tenantsInArrears.length === 1 ? '' : 's'} owing</span>
            <button 
              onClick={() => onNavigateTab('tenants')}
              className="text-[#8C2C24] hover:text-[#641A14] font-semibold text-[11px] hover:underline"
            >
              Review
            </button>
          </div>
        </div>

        {/* Maintenance Tickets */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D3CCBE] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#736E65] uppercase tracking-wider">Maintenance</span>
            <div className="p-2 rounded-lg bg-[#FBF5E8] text-[#7A571A]">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#1A1A1A]">{activeMaintenance.length}</span>
            <span className="text-xs text-[#8A857B] italic font-serif">tickets active</span>
          </div>
          <div className="mt-3.5 flex items-center justify-between text-xs text-[#736E65] pt-2.5 border-t border-[#EFECE5]">
            <span className="text-[#7A571A] font-medium">Fundis on site</span>
            <button 
              onClick={() => onNavigateTab('maintenance')}
              className="text-[#7A571A] hover:text-[#523A0F] font-semibold text-[11px] hover:underline"
            >
              Open Board
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Actionable Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions & Official Receipts (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3.5">
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Recent Rent Ledger</h3>
              <p className="text-xs text-[#7A756B]">Printable legal receipts with verified transaction references</p>
            </div>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-semibold text-[#1A1A1A] hover:text-[#423D35] inline-flex items-center gap-1 border-b border-[#1A1A1A] pb-0.5"
            >
              Full Ledger <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#EFECE5]">
            {recentPayments.map((pay) => {
              const tenant = tenants.find((t) => t.id === pay.tenantId);
              const unit = units.find((u) => u.id === pay.unitId);
              const property = properties.find((p) => p.id === pay.propertyId);

              return (
                <div key={pay.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F0E8] text-[#1A1A1A] font-mono font-medium flex items-center justify-center text-xs border border-[#E5E0D8]">
                      {pay.paymentMethod === 'M-Pesa' ? 'MP' : pay.paymentMethod === 'Bank Transfer' ? 'BK' : 'CS'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A1A1A]">
                        {tenant?.fullName || 'Tenant'}
                      </p>
                      <p className="text-[11px] text-[#7A756B]">
                        {property?.name} • Unit {unit?.unitNumber} • Ref: <span className="font-mono text-[#1A1A1A]">{pay.referenceCode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-xs font-bold text-[#1A1A1A] font-mono">
                        +{StorageService.formatCurrency(pay.amount, settings.currencySymbol)}
                      </p>
                      <p className="text-[10px] text-[#8F8A7E] font-mono">{pay.paymentDate}</p>
                    </div>
                    <button
                      id={`btn-view-receipt-${pay.id}`}
                      onClick={() => onViewReceipt(pay)}
                      className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#F4F0E8] rounded-md transition-colors border border-transparent hover:border-[#E5E0D8]"
                      title="View Official Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel: Arrears & Notices (1 col) */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3.5">
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Arrears Attention</h3>
              <p className="text-xs text-[#7A756B]">Demand notices via WhatsApp & SMS</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#FDF0EE] text-[#8C2C24] border border-[#F5D5D1] rounded-full font-mono">
              {tenantsInArrears.length} Due
            </span>
          </div>

          <div className="space-y-2.5">
            {tenantsInArrears.length === 0 ? (
              <div className="text-center py-6 text-[#736E65] text-xs">
                <CheckCircle2 className="w-7 h-7 text-[#2D5A34] mx-auto mb-1.5" />
                <p className="font-serif italic text-sm text-[#1A1A1A]">All accounts current.</p>
                No pending tenant arrears.
              </div>
            ) : (
              tenantsInArrears.map((tenant) => {
                const unit = units.find((u) => u.id === tenant.unitId);
                const property = properties.find((p) => p.id === tenant.propertyId);

                return (
                  <div key={tenant.id} className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#1A1A1A]">{tenant.fullName}</p>
                        <p className="text-[11px] text-[#7A756B]">
                          {property?.name} (Unit {unit?.unitNumber})
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#8C2C24] font-mono">
                        {StorageService.formatCurrency(tenant.balance, settings.currencySymbol)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onGenerateNotice(tenant)}
                        className="flex-1 py-1.5 px-2 text-[11px] font-medium bg-white border border-[#E5E0D8] text-[#1A1A1A] rounded-md hover:bg-[#F4F0E8] transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3 h-3 text-[#736E65]" />
                        Notice
                      </button>
                      <button
                        onClick={() => onOpenRecordPayment(tenant.id)}
                        className="py-1.5 px-3 text-[11px] font-semibold bg-[#1A1A1A] hover:bg-[#2E2A26] text-[#F9F7F2] rounded-md transition-colors shadow-2xs"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Property Occupancy Cards Row */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3.5">
          <div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Estate Portfolios</h3>
            <p className="text-xs text-[#7A756B]">Occupancy rates, physical location, and anticipated monthly rent roll</p>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="text-xs font-semibold text-[#1A1A1A] hover:text-[#423D35] border-b border-[#1A1A1A] pb-0.5"
          >
            Manage All Estates →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {properties.map((prop) => {
            const propUnits = units.filter((u) => u.propertyId === prop.id);
            const occupied = propUnits.filter((u) => u.status === 'occupied').length;
            const rate = propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : 0;
            const monthlyRoll = propUnits.reduce((acc, u) => acc + u.monthlyRent, 0);

            return (
              <div 
                key={prop.id}
                onClick={() => onNavigateTab('properties')}
                className="group p-4 rounded-lg border border-[#E5E0D8] hover:border-[#1A1A1A] hover:shadow-xs transition-all cursor-pointer bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#736E65]">
                    {prop.location.split(',')[0]}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${
                    rate >= 80 ? 'bg-[#EBF0EB] text-[#24482B] border-[#D0E0D2]' : 'bg-[#FBF5E8] text-[#7A571A] border-[#F2E3C6]'
                  }`}>
                    {rate}%
                  </span>
                </div>

                <h4 className="font-serif font-bold text-[#1A1A1A] text-sm mt-2 group-hover:text-black transition-colors">
                  {prop.name}
                </h4>
                <p className="text-[11px] text-[#736E65] mt-0.5">
                  {occupied} of {propUnits.length} occupied
                </p>

                <div className="mt-3.5 pt-2.5 border-t border-[#EFECE5] flex justify-between items-center text-[11px]">
                  <span className="text-[#8F8A7E] font-serif italic">Monthly Roll</span>
                  <span className="font-bold text-[#1A1A1A] font-mono">
                    {StorageService.formatCurrency(monthlyRoll, settings.currencySymbol)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
