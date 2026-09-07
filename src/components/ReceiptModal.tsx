import React, { useRef } from 'react';
import { Payment, Tenant, Unit, Property } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { X, Printer, Download, CheckCircle2, Building, Phone, Mail, MapPin } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment;
  tenant?: Tenant;
  unit?: Unit;
  property?: Property;
  settings: AppSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  tenant,
  unit,
  property,
  settings,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const numberToWords = (num: number): string => {
    // Simple helper for nice visual touch on receipt
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + numberToWords(num % 100) : '');
    if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
    return StorageService.formatCurrency(num, settings.currencySymbol);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div 
        id="receipt-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E5E0D8] overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none"
      >
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5] print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#24482B]"></span>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-sm tracking-wide">
              Official Rent Receipt
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-print-receipt"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] rounded-lg hover:bg-[#2E2A26] active:bg-black transition-colors shadow-2xs border border-[#1A1A1A]"
            >
              <Printer className="w-3.5 h-3.5 text-[#E5D7B7]" />
              Print Receipt
            </button>
            <button
              id="btn-close-receipt"
              onClick={onClose}
              className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div ref={receiptRef} className="p-8 space-y-6 text-[#1A1A1A] bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-[#1A1A1A] gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-[#E5D7B7] font-serif font-bold flex items-center justify-center text-lg border border-[#1A1A1A]">
                  N
                </div>
                <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A] font-serif uppercase">
                  Ngotho Properties
                </h1>
              </div>
              <p className="text-xs text-[#736E65] font-medium mt-1 font-serif italic">
                {settings.landlordCompanyName}
              </p>
              <div className="mt-2 text-xs text-[#736E65] space-y-0.5">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8F8A7E]" />
                  {settings.landlordAddress}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8F8A7E]" />
                  {settings.landlordPhone} | {settings.landlordEmail}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-[#EBF0EB] text-[#24482B] text-[11px] font-mono font-bold rounded border border-[#D0E0D2] uppercase tracking-wider mb-2">
                Payment Received
              </span>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Receipt No: <span className="font-mono text-[#1A1A1A] font-bold">{payment.receiptNumber}</span>
              </p>
              <p className="text-xs text-[#736E65] mt-1">
                Date: <span className="font-mono font-medium text-[#1A1A1A]">{payment.paymentDate}</span>
              </p>
            </div>
          </div>

          {/* Tenant & Property Overview */}
          <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-lg border border-[#E5E0D8] text-xs">
            <div>
              <p className="text-[#8F8A7E] font-semibold uppercase text-[10px] tracking-wider">Received From (Tenant)</p>
              <p className="text-sm font-serif font-bold text-[#1A1A1A] mt-0.5">{tenant?.fullName || 'Valued Tenant'}</p>
              <p className="text-[#736E65] mt-0.5">Phone: <span className="font-mono">{tenant?.phone || 'N/A'}</span></p>
              <p className="text-[#736E65]">ID / Passport: <span className="font-mono">{tenant?.nationalId || 'N/A'}</span></p>
            </div>
            <div>
              <p className="text-[#8F8A7E] font-semibold uppercase text-[10px] tracking-wider">Property & Unit</p>
              <p className="text-sm font-serif font-bold text-[#1A1A1A] mt-0.5">
                {property?.name || 'Ngotho Property'} - Unit {unit?.unitNumber || payment.unitId}
              </p>
              <p className="text-[#736E65] mt-0.5">Location: {property?.location || 'Kenya'}</p>
              <p className="text-[#736E65]">Unit Type: {unit?.type || 'Apartment'}</p>
            </div>
          </div>

          {/* Payment Details Table */}
          <div className="border border-[#E5E0D8] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#736E65] font-medium uppercase tracking-wider text-[10px] border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Reference Code</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE5]">
                <tr>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#1A1A1A]">{payment.paymentType} Payment</p>
                    <p className="text-[11px] text-[#736E65]">Unit {unit?.unitNumber} - {property?.name}</p>
                  </td>
                  <td className="py-3.5 px-4 font-serif text-[#1A1A1A]">
                    {payment.forMonth}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-medium text-[#1A1A1A]">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#736E65]">
                    {payment.referenceCode}
                  </td>
                  <td className="py-3.5 px-4 text-right font-serif font-bold text-[#1A1A1A] text-base">
                    {StorageService.formatCurrency(payment.amount, settings.currencySymbol)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total in words */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-xs">
            <p className="text-[#1A1A1A] font-medium">
              Amount in words: <span className="font-serif italic text-[#1A1A1A]">{numberToWords(payment.amount)} {settings.currencyCode} Only</span>
            </p>
          </div>

          {/* Balances & Notes */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-[#736E65] space-y-1 max-w-xs">
              {payment.notes && (
                <p><span className="font-semibold text-[#1A1A1A]">Remarks:</span> {payment.notes}</p>
              )}
              <p><span className="font-semibold text-[#1A1A1A]">Issued By:</span> {payment.recordedBy}</p>
              <p className="text-[11px] text-[#8F8A7E] italic font-serif">This is an officially verified electronic receipt issued under the authority of Ngotho Properties.</p>
            </div>

            <div className="w-full sm:w-64 border-t border-[#E5E0D8] pt-2 space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-[#736E65]">
                <span>Amount Paid:</span>
                <span className="font-serif font-bold text-[#1A1A1A]">{StorageService.formatCurrency(payment.amount, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-[#736E65]">
                <span>Current Tenant Balance:</span>
                <span className={`font-mono font-bold ${tenant?.balance && tenant.balance > 0 ? 'text-[#8C2C24]' : 'text-[#24482B]'}`}>
                  {StorageService.formatCurrency(tenant?.balance || 0, settings.currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          {/* Stamp & Authorized Signature */}
          <div className="pt-6 border-t border-[#E5E0D8] flex justify-between items-end">
            <div className="border border-dashed border-[#7A571A]/40 p-2.5 rounded-lg text-center w-36 rotate-[-2deg] bg-[#FAF8F5]/50">
              <div className="text-[10px] font-bold text-[#7A571A] uppercase tracking-widest font-mono">NGOTHO PROPERTIES</div>
              <div className="text-[9px] text-[#7A571A] font-medium font-serif italic">★ OFFICIAL RECEIPT ★</div>
              <div className="text-[8px] text-[#7A571A] font-mono">{payment.paymentDate}</div>
            </div>

            <div className="text-right">
              <div className="w-44 border-b border-[#1A1A1A] pb-1 mb-1">
                <span className="font-serif italic text-sm text-[#1A1A1A] select-none">Ngotho Management</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-[#8F8A7E] font-semibold">Authorized Signature & Stamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
