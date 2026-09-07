import React, { useState } from 'react';
import { Tenant, Unit, Property } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  DollarSign, 
  FileText, 
  AlertCircle, 
  Calendar, 
  MessageSquare,
  Edit,
  Building,
  CheckCircle2
} from 'lucide-react';

interface TenantsViewProps {
  tenants: Tenant[];
  units: Unit[];
  properties: Property[];
  settings: AppSettings;
  onAddTenant: () => void;
  onEditTenant: (tenant: Tenant) => void;
  onRecordPayment: (tenantId: string) => void;
  onGenerateNotice: (tenant: Tenant) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  tenants,
  units,
  properties,
  settings,
  onAddTenant,
  onEditTenant,
  onRecordPayment,
  onGenerateNotice,
}) => {
  const [filter, setFilter] = useState<'all' | 'arrears' | 'notice' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenantDetails, setSelectedTenantDetails] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter((t) => {
    if (filter === 'arrears' && t.balance <= 0) return false;
    if (filter === 'notice' && t.status !== 'notice') return false;
    if (filter === 'active' && t.status !== 'active') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const u = units.find((unit) => unit.id === t.unitId);
      const p = properties.find((prop) => prop.id === t.propertyId);
      const matchesName = t.fullName.toLowerCase().includes(q);
      const matchesPhone = t.phone.toLowerCase().includes(q);
      const matchesId = t.nationalId.toLowerCase().includes(q);
      const matchesUnit = u?.unitNumber.toLowerCase().includes(q);
      const matchesProp = p?.name.toLowerCase().includes(q);

      if (!matchesName && !matchesPhone && !matchesId && !matchesUnit && !matchesProp) {
        return false;
      }
    }
    return true;
  });

  const arrearsCount = tenants.filter((t) => t.balance > 0).length;
  const noticeCount = tenants.filter((t) => t.status === 'notice').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            Tenants Directory & Leases
          </h2>
          <p className="text-xs text-[#736E65]">
            Maintain occupant records, contact details, lease agreements, balances, and direct communications.
          </p>
        </div>

        <button
          id="btn-register-tenant-view"
          onClick={onAddTenant}
          className="px-4 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs border border-[#1A1A1A]"
        >
          <UserPlus className="w-3.5 h-3.5 text-[#E5D7B7]" />
          Register New Tenant
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              filter === 'all'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A]'
                : 'bg-white text-[#615C53] hover:bg-[#FAF8F5] border-[#E5E0D8]'
            }`}
          >
            All Tenants ({tenants.length})
          </button>
          <button
            onClick={() => setFilter('arrears')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5 border ${
              filter === 'arrears'
                ? 'bg-[#8C2C24] text-white border-[#8C2C24]'
                : 'bg-[#FDF0EE] text-[#8C2C24] border-[#F5D5D1] hover:bg-[#FBE8E5]'
            }`}
          >
            In Arrears
            {arrearsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#8C2C24] text-white text-[10px] flex items-center justify-center font-bold font-mono">
                {arrearsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('notice')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              filter === 'notice'
                ? 'bg-[#7A571A] text-white border-[#7A571A]'
                : 'bg-[#FBF5E8] text-[#7A571A] border-[#F2E3C6] hover:bg-[#F6EBD3]'
            }`}
          >
            Vacating Notice ({noticeCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              filter === 'active'
                ? 'bg-[#24482B] text-white border-[#24482B]'
                : 'bg-[#EBF0EB] text-[#24482B] border-[#D0E0D2] hover:bg-[#DFE8DF]'
            }`}
          >
            Active & Up-to-Date
          </button>
        </div>

        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#8F8A7E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant name, ID, phone, unit..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] placeholder:text-[#8F8A7E] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#736E65] font-medium uppercase tracking-wider text-[10px] border-b border-[#E5E0D8]">
              <tr>
                <th className="py-3 px-4">Tenant Name</th>
                <th className="py-3 px-4">House & Estate</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Monthly Rent</th>
                <th className="py-3 px-4">Balance Status</th>
                <th className="py-3 px-4">Lease Term</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8F8A7E] font-serif italic text-sm">
                    No tenants found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => {
                  const unit = units.find((u) => u.id === tenant.unitId);
                  const property = properties.find((p) => p.id === tenant.propertyId);

                  return (
                    <tr key={tenant.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1A1A1A] text-xs">
                          {tenant.fullName}
                        </div>
                        <div className="text-[11px] text-[#736E65] flex items-center gap-1.5">
                          <span className="font-mono">ID: {tenant.nationalId}</span>
                          {tenant.occupation && <span className="italic font-serif">• {tenant.occupation}</span>}
                        </div>
                      </td>

                      {/* House & Property */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1A1A1A] font-mono">
                          Unit {unit?.unitNumber || 'N/A'}
                        </div>
                        <div className="text-[11px] text-[#736E65]">
                          {property?.name} ({unit?.type})
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3 px-4 font-mono text-[11px] space-y-0.5">
                        <div className="text-[#1A1A1A] font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#8F8A7E]" />
                          {tenant.phone}
                        </div>
                        <div className="text-[#736E65] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#8F8A7E]" />
                          {tenant.email}
                        </div>
                      </td>

                      {/* Rent */}
                      <td className="py-3 px-4">
                        <span className="font-serif font-bold text-[#1A1A1A] text-sm">
                          {StorageService.formatCurrency(tenant.rentAmount, settings.currencySymbol)}
                        </span>
                        <span className="block text-[10px] font-mono text-[#8F8A7E]">
                          Dep: {StorageService.formatCurrency(tenant.depositPaid, settings.currencySymbol)}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="py-3 px-4">
                        {tenant.balance > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FDF0EE] text-[#8C2C24] border border-[#F5D5D1] font-mono">
                            <AlertCircle className="w-3 h-3" />
                            {StorageService.formatCurrency(tenant.balance, settings.currencySymbol)} Due
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EBF0EB] text-[#24482B] border border-[#D0E0D2] font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            Cleared
                          </span>
                        )}
                        {tenant.status === 'notice' && (
                          <span className="block mt-1 text-[10px] text-[#7A571A] font-medium italic font-serif">
                            Vacating on notice
                          </span>
                        )}
                      </td>

                      {/* Lease Period */}
                      <td className="py-3 px-4 text-[#736E65] text-[11px]">
                        <span className="block text-[#1A1A1A] font-medium font-mono">
                          Exp: {tenant.leaseEndDate}
                        </span>
                        <span className="text-[10px] text-[#8F8A7E] font-mono">
                          Started: {tenant.leaseStartDate}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-notice-${tenant.id}`}
                            onClick={() => onGenerateNotice(tenant)}
                            className="px-2.5 py-1 text-xs font-medium text-[#1A1A1A] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-md transition-colors inline-flex items-center gap-1"
                            title="Generate SMS / Notice"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#736E65]" />
                            Notice
                          </button>

                          <button
                            id={`btn-pay-${tenant.id}`}
                            onClick={() => onRecordPayment(tenant.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#EAE4D5] border border-[#E5E0D8] rounded-md transition-colors inline-flex items-center gap-1"
                            title="Record Rent Payment"
                          >
                            <DollarSign className="w-3.5 h-3.5 text-[#1A1A1A]" />
                            Pay
                          </button>

                          <button
                            onClick={() => onEditTenant(tenant)}
                            className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#F4F0E8] rounded-md transition-colors"
                            title="Edit Tenant"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
