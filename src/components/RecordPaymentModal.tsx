import React, { useState } from 'react';
import { Payment, Tenant, Unit, Property, PaymentMethod, PaymentType } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { X, DollarSign, Check, RefreshCw } from 'lucide-react';

interface RecordPaymentModalProps {
  tenants: Tenant[];
  units: Unit[];
  properties: Property[];
  settings: AppSettings;
  preselectedTenantId?: string;
  onSavePayment: (payment: Payment, updatedBalance: number) => void;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  tenants,
  units,
  properties,
  settings,
  preselectedTenantId,
  onSavePayment,
  onClose,
}) => {
  const [tenantId, setTenantId] = useState(preselectedTenantId || (tenants[0]?.id || ''));
  const selectedTenant = tenants.find((t) => t.id === tenantId);
  const selectedUnit = units.find((u) => u.id === selectedTenant?.unitId);
  const selectedProperty = properties.find((p) => p.id === (selectedTenant?.propertyId || selectedUnit?.propertyId));

  const [amount, setAmount] = useState<number>(selectedTenant?.rentAmount || 25000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');
  const [paymentType, setPaymentType] = useState<PaymentType>('Rent');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [forMonth, setForMonth] = useState<string>('September 2026');
  const [referenceCode, setReferenceCode] = useState<string>(() => generateSampleRef('M-Pesa'));
  const [notes, setNotes] = useState<string>('Rent paid via Paybill');
  const [recordedBy, setRecordedBy] = useState<string>('Admin - Ngotho Systems');

  function generateSampleRef(method: PaymentMethod) {
    if (method === 'M-Pesa') {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'QB';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
    if (method === 'Bank Transfer') {
      return `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    return `REC-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const handleTenantChange = (newTenantId: string) => {
    setTenantId(newTenantId);
    const t = tenants.find((item) => item.id === newTenantId);
    if (t) {
      setAmount(t.rentAmount);
    }
  };

  const handleMethodChange = (newMethod: PaymentMethod) => {
    setPaymentMethod(newMethod);
    setReferenceCode(generateSampleRef(newMethod));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant || !selectedUnit) return;

    const receiptNumber = StorageService.generateReceiptNumber();
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      tenantId: selectedTenant.id,
      unitId: selectedUnit.id,
      propertyId: selectedTenant.propertyId || selectedUnit.propertyId,
      amount: Number(amount),
      paymentDate,
      forMonth,
      paymentMethod,
      referenceCode: referenceCode.trim().toUpperCase(),
      paymentType,
      notes,
      recordedBy,
    };

    // calculate new balance: current balance minus payment amount
    const newBalance = Math.max(0, (selectedTenant.balance || 0) - Number(amount));
    onSavePayment(newPayment, newBalance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="record-payment-modal"
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E5E0D8] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF8F5] border border-[#E5E0D8] text-[#7A571A] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Record Rent / House Payment</h3>
              <p className="text-xs text-[#736E65] font-serif italic">Ngotho Payment Ledger & Instant Receipt</p>
            </div>
          </div>
          <button
            id="btn-close-payment-modal"
            onClick={onClose}
            className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Tenant Selector */}
          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">
              Select Tenant & House
            </label>
            <select
              id="select-tenant-payment"
              value={tenantId}
              onChange={(e) => handleTenantChange(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] text-xs font-medium focus:outline-none focus:border-[#1A1A1A]"
            >
              {tenants.map((t) => {
                const u = units.find((unit) => unit.id === t.unitId);
                const p = properties.find((prop) => prop.id === t.propertyId);
                return (
                  <option key={t.id} value={t.id}>
                    {t.fullName} — {p?.name || 'Property'} (Unit {u?.unitNumber || 'N/A'}) - Rent: {StorageService.formatCurrency(t.rentAmount, settings.currencySymbol)}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quick info chip */}
          {selectedTenant && (
            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8F8A7E] uppercase tracking-wider font-semibold block">Unit & Phone</span>
                <span className="font-serif font-bold text-[#1A1A1A] text-xs">
                  {selectedProperty?.name} - Unit {selectedUnit?.unitNumber}
                </span>
                <span className="text-[#736E65] block text-[11px] font-mono">{selectedTenant.phone}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8F8A7E] uppercase tracking-wider font-semibold block">Outstanding Balance</span>
                <span className={`text-xs font-mono font-bold ${selectedTenant.balance > 0 ? 'text-[#8C2C24]' : 'text-[#24482B]'}`}>
                  {StorageService.formatCurrency(selectedTenant.balance, settings.currencySymbol)}
                </span>
              </div>
            </div>
          )}

          {/* Amount & Period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                Amount Paid ({settings.currencySymbol})
              </label>
              <input
                id="input-payment-amount"
                type="number"
                min="100"
                step="50"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-bold font-mono text-sm focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                For Month / Period
              </label>
              <input
                id="input-payment-period"
                type="text"
                value={forMonth}
                onChange={(e) => setForMonth(e.target.value)}
                placeholder="e.g. September 2026"
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Payment Type & Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Payment For</label>
              <select
                id="select-payment-type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="Rent">Monthly Rent</option>
                <option value="Deposit">House Deposit</option>
                <option value="Water">Water Bill</option>
                <option value="Electricity">Electricity Bill</option>
                <option value="Garbage">Garbage Collection</option>
                <option value="Combined">Combined (Rent + Utilities)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Payment Method</label>
              <select
                id="select-payment-method"
                value={paymentMethod}
                onChange={(e) => handleMethodChange(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="M-Pesa">M-Pesa Mobile Money</option>
                <option value="Bank Transfer">Bank Transfer / Wire</option>
                <option value="Cash">Cash at Office</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>
          </div>

          {/* Reference Code & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-[#1A1A1A]">Transaction Reference</label>
                <button
                  type="button"
                  onClick={() => setReferenceCode(generateSampleRef(paymentMethod))}
                  className="text-[10px] text-[#1A1A1A] hover:underline inline-flex items-center gap-0.5"
                >
                  <RefreshCw className="w-2.5 h-2.5 text-[#736E65]" /> Auto-fill
                </button>
              </div>
              <input
                id="input-payment-ref"
                type="text"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                placeholder="e.g. QB8294LKX"
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Payment Date</label>
              <input
                id="input-payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Remarks & Officer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Remarks / Note</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Paid via Paybill"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Recorded By</label>
              <input
                type="text"
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
                placeholder="Staff name"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
            <button
              type="button"
              id="btn-cancel-record-payment"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#615C53] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-record-payment"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors shadow-2xs border border-[#1A1A1A]"
            >
              <Check className="w-3.5 h-3.5 text-[#E5D7B7]" />
              Save & Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
