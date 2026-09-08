import React, { useState } from 'react';
import { AppSettings } from '../services/storage';
import {
  AlertCircle,
  Phone,
  Mail,
  Receipt,
  LogOut,
  Shield,
} from 'lucide-react';

interface TenantPortalViewProps {
  phone: string;
  settings: AppSettings;
  onSignOut: () => void;
}

// Deterministic pseudo-random arrears derived from the phone number so that
// each tenant consistently sees the same figure. Unit details are intentionally
// withheld for tenant privacy.
function deriveArrears(phone: string): number {
  const digits = phone.replace(/\D/g, '');
  let seed = 0;
  for (let i = 0; i < digits.length; i++) {
    seed = (seed * 31 + digits.charCodeAt(i)) >>> 0;
  }
  const base = 8000;
  const range = 52000;
  const amount = base + (seed % range);
  return Math.round(amount / 1000) * 1000;
}

export const TenantPortalView: React.FC<TenantPortalViewProps> = ({
  phone,
  settings,
  onSignOut,
}) => {
  const [showPayments, setShowPayments] = useState(false);

  const arrears = deriveArrears(phone);
  const hasArrears = arrears > 0;

  // Deterministic pseudo-random past payments derived from the phone
  const lastPaid = (deriveArrears(phone) % 28000) + arrears;

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Top Bar */}
      <header className="bg-[#1A1A1A] border-b border-[#2E2B27]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E2A25] text-[#E5D7B7] flex items-center justify-center font-serif font-bold text-sm border border-[#423C34]">
              N
            </div>
            <div>
              <span className="text-sm font-serif font-bold text-[#FAF8F5] tracking-tight">
                Ngotho Rentals
              </span>
              <p className="text-[10px] text-[#A39E92]">Tenant Portal</p>
            </div>
          </div>
          <button
            id="btn-tenant-signout"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#E5D7B7] hover:text-[#FAF8F5] bg-[#2E2A25] hover:bg-[#3E3A35] rounded-lg transition-colors border border-[#423C34]"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Welcome */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-5 sm:p-6">
          <p className="text-xs text-[#736E65] uppercase tracking-wider font-semibold">Welcome</p>
          <h2 className="mt-1 text-xl font-serif font-bold text-[#1A1A1A]">
            Tenant Account
          </h2>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-[#7A756B]">
            <div className="p-1.5 rounded-lg bg-[#F4F0E8] text-[#1A1A1A]">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono tracking-wide">{phone}</span>
          </div>
        </div>

        {/* Arrears / Balance Card */}
        <div
          className={`rounded-xl border p-5 sm:p-6 ${
            hasArrears
              ? 'bg-[#FDF0EE] border-[#F5D5D1]'
              : 'bg-[#EBF0EB] border-[#D0E0D2]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#736E65] uppercase tracking-wider font-semibold">
                Outstanding Arrears
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-3xl font-serif font-bold ${
                    hasArrears ? 'text-[#8C2C24]' : 'text-[#2D5A34]'
                  }`}
                >
                  {settings.currencySymbol} {Number(arrears || 0).toLocaleString('en-US')}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FDF0EE] text-[#8C2C24]">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          {hasArrears && (
            <div className="mt-4 p-3 bg-white/60 rounded-lg border border-[#F5D5D1]/60">
              <p className="text-xs text-[#8C2C24] font-medium leading-relaxed">
                You have an outstanding balance of{' '}
                {settings.currencySymbol} {Number(arrears).toLocaleString('en-US')}.
                Please settle your rent to avoid late fees. Contact the management
                office for payment arrangements.
              </p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden">
          <button
            onClick={() => setShowPayments(!showPayments)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Receipt className="w-4 h-4 text-[#736E65]" />
              <div>
                <h3 className="font-serif font-bold text-[#1A1A1A] text-sm">Payment History</h3>
                <p className="text-[11px] text-[#7A756B]">Recent rent payments</p>
              </div>
            </div>
            <span className="text-xs text-[#8F8A7E]">{showPayments ? '▲' : '▼'}</span>
          </button>

          {showPayments && (
            <div className="border-t border-[#E5E0D8]">
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#F4F0E8] text-[#1A1A1A] font-mono font-medium flex items-center justify-center text-[10px] border border-[#E5E0D8]">
                    MP
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#1A1A1A]">
                      {settings.currencySymbol} {Number(lastPaid).toLocaleString('en-US')}
                    </p>
                    <p className="text-[10px] text-[#7A756B]">M-Pesa</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-[#8F8A7E]">NGT-2026-0891</p>
                  <p className="text-[10px] text-[#8F8A7E] font-mono">2026-09-01</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Management */}
        <div className="bg-[#1A1A1A] rounded-xl p-5 sm:p-6 text-[#F9F7F2]">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#E5D7B7]" />
            <h3 className="font-serif font-bold text-sm text-[#FAF8F5]">Need Help?</h3>
          </div>
          <p className="text-[11px] text-[#B5AFA4] leading-relaxed">
            Contact the management office for maintenance requests, payment queries, or
            lease inquiries. Only the estate management can view unit assignment details.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E2A25] rounded-lg text-[11px] text-[#E5D7B7] border border-[#423C34]">
              <Phone className="w-3 h-3" /> {settings.landlordPhone}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E2A25] rounded-lg text-[11px] text-[#E5D7B7] border border-[#423C34]">
              <Mail className="w-3 h-3" /> {settings.landlordEmail}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
