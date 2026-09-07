import React, { useState } from 'react';
import { Payment, Tenant, Unit, Property, PaymentMethod } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { 
  DollarSign, 
  Plus, 
  Printer, 
  Search, 
  Filter, 
  CreditCard, 
  Smartphone, 
  Landmark, 
  Banknote,
  CheckCircle2
} from 'lucide-react';

interface PaymentsViewProps {
  payments: Payment[];
  tenants: Tenant[];
  units: Unit[];
  properties: Property[];
  settings: AppSettings;
  onRecordPayment: () => void;
  onViewReceipt: (payment: Payment) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  tenants,
  units,
  properties,
  settings,
  onRecordPayment,
  onViewReceipt,
}) => {
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = payments.filter((p) => {
    if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
    if (propertyFilter !== 'all' && p.propertyId !== propertyFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const tenant = tenants.find((t) => t.id === p.tenantId);
      const unit = units.find((u) => u.id === p.unitId);
      const prop = properties.find((pr) => pr.id === p.propertyId);

      const matchesRef = p.referenceCode.toLowerCase().includes(q);
      const matchesReceipt = p.receiptNumber.toLowerCase().includes(q);
      const matchesTenant = tenant?.fullName.toLowerCase().includes(q);
      const matchesUnit = unit?.unitNumber.toLowerCase().includes(q);
      const matchesProp = prop?.name.toLowerCase().includes(q);

      if (!matchesRef && !matchesReceipt && !matchesTenant && !matchesUnit && !matchesProp) {
        return false;
      }
    }
    return true;
  });

  const totalCollected = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'M-Pesa':
        return <Smartphone className="w-3.5 h-3.5 text-[#24482B]" />;
      case 'Bank Transfer':
        return <Landmark className="w-3.5 h-3.5 text-[#1A1A1A]" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5 text-[#7A571A]" />;
      default:
        return <CreditCard className="w-3.5 h-3.5 text-[#736E65]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Record Payment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            Rent Collection & Payments Ledger
          </h2>
          <p className="text-xs text-[#736E65]">
            Audit trail of all rent remittances, automated receipt numbers, and mobile money transaction confirmations.
          </p>
        </div>

        <button
          id="btn-record-payment-view"
          onClick={onRecordPayment}
          className="px-4 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs border border-[#1A1A1A]"
        >
          <Plus className="w-3.5 h-3.5 text-[#E5D7B7]" />
          Record New Payment
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8F8A7E]">Total Filtered Remittance</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
            {StorageService.formatCurrency(totalCollected, settings.currencySymbol)}
          </div>
          <p className="text-xs text-[#736E65] mt-1 font-serif italic">
            Across {filteredPayments.length} recorded transaction{filteredPayments.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Property Filter */}
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="all">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="all">All Channels</option>
            <option value="M-Pesa">M-Pesa Mobile</option>
            <option value="Bank Transfer">Bank Wire</option>
            <option value="Cash">Cash at Office</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#8F8A7E] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by receipt number (e.g. NGT-2026), M-Pesa code, tenant name, or unit..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] placeholder:text-[#8F8A7E] focus:outline-none focus:border-[#1A1A1A] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#736E65] font-medium uppercase tracking-wider text-[10px] border-b border-[#E5E0D8]">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date & Period</th>
                <th className="py-3 px-4">Tenant & Unit</th>
                <th className="py-3 px-4">Payment Method & Reference</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8F8A7E] font-serif italic text-sm">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const tenant = tenants.find((t) => t.id === payment.tenantId);
                  const unit = units.find((u) => u.id === payment.unitId);
                  const prop = properties.find((p) => p.id === payment.propertyId);

                  return (
                    <tr key={payment.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      {/* Receipt */}
                      <td className="py-3 px-4 font-mono font-bold text-[#1A1A1A]">
                        {payment.receiptNumber}
                      </td>

                      {/* Date & Period */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#1A1A1A] block font-mono">
                          {payment.paymentDate}
                        </span>
                        <span className="text-[11px] text-[#736E65] italic font-serif">
                          {payment.forMonth}
                        </span>
                      </td>

                      {/* Tenant & Unit */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1A1A1A] block">
                          {tenant?.fullName || 'Tenant'}
                        </span>
                        <span className="text-[11px] text-[#736E65]">
                          {prop?.name} • Unit {unit?.unitNumber}
                        </span>
                      </td>

                      {/* Method & Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                          {getMethodIcon(payment.paymentMethod)}
                          {payment.paymentMethod}
                        </div>
                        <span className="font-mono text-[11px] text-[#736E65] uppercase tracking-wider block mt-0.5">
                          {payment.referenceCode}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F4F0E8] text-[#5C5850] border border-[#E5E0D8]">
                          {payment.paymentType}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-serif font-bold text-[#1A1A1A] text-sm">
                        {StorageService.formatCurrency(payment.amount, settings.currencySymbol)}
                      </td>

                      {/* Print Receipt Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          id={`btn-receipt-action-${payment.id}`}
                          onClick={() => onViewReceipt(payment)}
                          className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#F4F0E8] rounded-md transition-colors border border-[#E5E0D8]"
                          title="View Official Printable Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
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
