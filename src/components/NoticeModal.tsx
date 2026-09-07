import React, { useState } from 'react';
import { Tenant, Unit, Property } from '../types';
import { AppSettings, StorageService } from '../services/storage';
import { X, MessageSquare, Copy, Check, Printer, Send, AlertCircle, FileText } from 'lucide-react';

interface NoticeModalProps {
  tenant: Tenant;
  unit?: Unit;
  property?: Property;
  settings: AppSettings;
  onClose: () => void;
}

type NoticeType = 'due_reminder' | 'overdue_demand' | 'lease_renewal' | 'general_notice';

export const NoticeModal: React.FC<NoticeModalProps> = ({
  tenant,
  unit,
  property,
  settings,
  onClose,
}) => {
  const [noticeType, setNoticeType] = useState<NoticeType>('overdue_demand');
  const [customDays, setCustomDays] = useState('3');
  const [copied, setCopied] = useState(false);

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const generateNoticeContent = () => {
    const unitText = `Unit ${unit?.unitNumber || 'N/A'}`;
    const propText = property?.name || 'Ngotho Properties';
    const amountText = StorageService.formatCurrency(tenant.balance || tenant.rentAmount, settings.currencySymbol);
    const paybillText = property?.paybillNumber || settings.paybillNumber;
    const accountText = property?.accountNumber || `NGOTHO-${unit?.unitNumber || tenant.id}`;

    switch (noticeType) {
      case 'due_reminder':
        return {
          title: 'Rent Payment Reminder',
          sms: `Dear ${tenant.fullName}, this is a gentle reminder from Ngotho Properties that monthly rent of ${amountText} for ${unitText}, ${propText} is due on the ${settings.rentDueDay}th. Kindly remit via M-Pesa Paybill: ${paybillText}, Account: ${accountText}. Thank you!`,
          formal: `RE: MONTHLY RENT PAYMENT REMINDER - ${unitText.toUpperCase()}, ${propText.toUpperCase()}

Dear ${tenant.fullName},

We hope this communication finds you well.

This is a courtesy reminder that your rental installment of ${amountText} for ${unitText} at ${propText} is due for payment on or before the ${settings.rentDueDay}th of this month.

Payment Channels:
- M-Pesa Paybill: ${paybillText}
- Account Number: ${accountText}
- Bank Transfer: ${property?.bankDetails || settings.landlordCompanyName}

Please furnish our management desk with the transaction confirmation code upon payment.

Sincerely,
Management, Ngotho Properties
Tel: ${property?.contactPhone || settings.landlordPhone}`
        };

      case 'overdue_demand':
        return {
          title: 'Overdue Rent Demand Notice',
          sms: `URGENT NOTICE: Dear ${tenant.fullName}, your rent balance of ${amountText} for ${unitText}, ${propText} is past due. Please settle within ${customDays} days via Paybill ${paybillText}, Acc: ${accountText} to avert late penalties. For inquiries call ${property?.contactPhone || settings.landlordPhone}.`,
          formal: `NOTICE OF ARREARS & FORMAL PAYMENT DEMAND - ${unitText.toUpperCase()}

Date: ${new Date().toLocaleDateString('en-GB')}
To: ${tenant.fullName}
Premises: ${unitText}, ${propText}, ${property?.location}

Dear ${tenant.fullName},

Our records indicate that your rental account reflects an outstanding balance of ${amountText}, which was due as per our lease agreement.

TAKE NOTICE that you are hereby requested to settle the said outstanding amount of ${amountText} in full within ${customDays} (${numberToWord(Number(customDays))} days) from the date of this notice.

Remittance details:
- M-Pesa Paybill: ${paybillText}
- Account Number: ${accountText}
- Reference: ${unitText} Rent

Failure to regularize this account within the stipulated period may result in statutory late penalties and subsequent legal possession proceedings under the tenancy agreement.

For and on behalf of Ngotho Management,
${property?.caretakerName ? `${property.caretakerName} (Caretaker)` : 'Property Manager'}
Phone: ${property?.contactPhone || settings.landlordPhone}`
        };

      case 'lease_renewal':
        return {
          title: 'Lease Expiry & Renewal Notice',
          sms: `Dear ${tenant.fullName}, your lease for ${unitText} at ${propText} expires on ${tenant.leaseEndDate}. Please confirm your intention to renew by contacting Ngotho Management at ${settings.landlordPhone}.`,
          formal: `RE: TENANCY LEASE EXPIRY & RENEWAL INQUIRY

Date: ${new Date().toLocaleDateString('en-GB')}
To: ${tenant.fullName}
Premises: ${unitText}, ${propText}

Dear ${tenant.fullName},

We would like to bring to your attention that your current tenancy agreement for ${unitText} at ${propText} is scheduled to expire on ${tenant.leaseEndDate}.

As a valued tenant, we would be delighted to offer you a renewal of the lease for another term. Kindly communicate your intention to renew or provide notice of vacating on or before thirty (30) days prior to lease expiry.

We look forward to hearing from you.

Kind regards,
Ngotho Real Estate Management
${settings.landlordEmail}`
        };

      case 'general_notice':
        return {
          title: 'General Premises Notice',
          sms: `Notice to all residents of ${propText}: Routine inspection and water tank maintenance will take place this Thursday from 9:00 AM. Inquiries: ${property?.contactPhone || settings.landlordPhone}.`,
          formal: `MEMORANDUM TO RESIDENTS - ${propText.toUpperCase()}

Dear ${tenant.fullName},

Please be informed of scheduled general maintenance and premise upkeep. Our certified technicians will be on site.

Should you require any specific assistance with Unit ${unit?.unitNumber}, kindly notify the caretaker at ${property?.contactPhone || settings.landlordPhone}.

Ngotho Properties Management`
        };
    }
  };

  function numberToWord(n: number) {
    if (n === 3) return 'Three';
    if (n === 5) return 'Five';
    if (n === 7) return 'Seven';
    if (n === 14) return 'Fourteen';
    return String(n);
  }

  const notice = generateNoticeContent();

  const handleCopySMS = () => {
    navigator.clipboard.writeText(notice.sms);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = getCleanPhone(tenant.phone);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(notice.sms)}`;
    window.open(url, '_blank');
  };

  const handlePrintFormal = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div 
        id="notice-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E5E0D8] overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#FAF8F5] border border-[#E5E0D8] text-[#7A571A] rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">
                Generate Notice & Tenant Communication
              </h3>
              <p className="text-xs text-[#736E65] font-serif italic">
                To: {tenant.fullName} ({property?.name} - Unit {unit?.unitNumber})
              </p>
            </div>
          </div>
          <button
            id="btn-close-notice-modal"
            onClick={onClose}
            className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EFEAE1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Type Selector */}
        <div className="p-6 space-y-5 print:p-0">
          <div className="print:hidden space-y-3">
            <label className="text-xs font-semibold text-[#8F8A7E] uppercase tracking-wider block">
              Notice Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setNoticeType('overdue_demand')}
                className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                  noticeType === 'overdue_demand'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#F9F7F2] font-semibold shadow-2xs'
                    : 'bg-white border-[#E5E0D8] text-[#615C53] hover:bg-[#FAF8F5]'
                }`}
              >
                Overdue Demand
              </button>
              <button
                type="button"
                onClick={() => setNoticeType('due_reminder')}
                className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                  noticeType === 'due_reminder'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#F9F7F2] font-semibold shadow-2xs'
                    : 'bg-white border-[#E5E0D8] text-[#615C53] hover:bg-[#FAF8F5]'
                }`}
              >
                Rent Reminder
              </button>
              <button
                type="button"
                onClick={() => setNoticeType('lease_renewal')}
                className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                  noticeType === 'lease_renewal'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#F9F7F2] font-semibold shadow-2xs'
                    : 'bg-white border-[#E5E0D8] text-[#615C53] hover:bg-[#FAF8F5]'
                }`}
              >
                Lease Renewal
              </button>
              <button
                type="button"
                onClick={() => setNoticeType('general_notice')}
                className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                  noticeType === 'general_notice'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#F9F7F2] font-semibold shadow-2xs'
                    : 'bg-white border-[#E5E0D8] text-[#615C53] hover:bg-[#FAF8F5]'
                }`}
              >
                General Memo
              </button>
            </div>

            {noticeType === 'overdue_demand' && (
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="text-[#736E65] font-medium">Demand settlement within:</span>
                <select
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="3">3 Days (Urgent)</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days (Standard)</option>
                  <option value="14">14 Days</option>
                </select>
                <span className="text-[#8C2C24] bg-[#FDF0EE] border border-[#F5D5D1] px-2 py-0.5 rounded text-[11px] font-mono font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Current Balance: {StorageService.formatCurrency(tenant.balance, settings.currencySymbol)}
                </span>
              </div>
            )}
          </div>

          {/* Quick Instant SMS / WhatsApp Section */}
          <div className="print:hidden bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8F8A7E] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#7A571A]" />
                Quick SMS / WhatsApp Message
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySMS}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1A1A1A] bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF8F5] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#24482B]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy SMS
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#F9F7F2] bg-[#24482B] rounded-lg hover:bg-[#1C3822] transition-colors shadow-2xs border border-[#24482B]"
                >
                  <Send className="w-3 h-3" />
                  Send via WhatsApp
                </button>
              </div>
            </div>
            <p className="text-xs text-[#1A1A1A] font-mono bg-white p-3 rounded-lg border border-[#E5E0D8] leading-relaxed select-all">
              {notice.sms}
            </p>
          </div>

          {/* Formal Letter Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between print:hidden">
              <span className="text-xs font-semibold text-[#8F8A7E] uppercase tracking-wider">
                Formal Letterhead Notice
              </span>
              <button
                type="button"
                onClick={handlePrintFormal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-white hover:bg-[#FAF8F5] rounded-lg transition-colors border border-[#E5E0D8]"
              >
                <Printer className="w-3.5 h-3.5 text-[#736E65]" />
                Print Letterhead
              </button>
            </div>

            <div className="p-6 bg-white border border-[#E5E0D8] rounded-lg font-serif text-xs text-[#1A1A1A] whitespace-pre-wrap leading-relaxed shadow-none print:border-none print:shadow-none print:p-0">
              {notice.formal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
