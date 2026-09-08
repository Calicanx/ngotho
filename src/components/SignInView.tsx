import React, { useState } from 'react';
import { Phone, ArrowRight, Shield, X, PhoneCall } from 'lucide-react';

interface SignInViewProps {
  onSignIn: (phone: string) => void;
  onClose: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSignIn, onClose }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (!cleaned) {
      setError('Please enter your phone number');
      return;
    }
    if (!/^(07\d{8}|254\d{9})$/.test(cleaned)) {
      setError('Enter a valid Kenyan phone number (e.g. 0712345678)');
      return;
    }
    setError('');
    onSignIn(cleaned);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="signin-modal"
        className="w-full max-w-md bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-[#1A1A1A] px-7 py-6 text-[#F9F7F2]">
          <button
            id="btn-signin-close"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#A39E92] hover:text-[#F9F7F2] hover:bg-[#2E2A25] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2E2A25] text-[#E5D7B7] flex items-center justify-center font-serif font-bold text-xl border border-[#423C34]">
              N
            </div>
            <div>
              <p className="text-sm font-serif font-bold tracking-tight">ngotho Rentals</p>
              <p className="text-[11px] text-[#B5AFA4] font-serif italic">Estates & Rental Management</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-7 sm:p-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-[#F4F0E8] text-[#1A1A1A]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-[#1A1A1A] text-lg">Sign in to check your rent</h2>
              <p className="text-[11px] text-[#7A756B]">
                Enter your phone number to view your arrears and payments
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#736E65] uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8F897D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signin-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  placeholder="0712 345 678"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-[#E5E0D8] focus:border-[#1A1A1A] focus:bg-white rounded-xl text-[#1A1A1A] placeholder:text-[#B5AFA4] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 transition-all font-mono tracking-wide"
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-xs text-[#8C2C24] font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              id="btn-sign-in"
              className="w-full py-3 text-sm font-semibold bg-[#1A1A1A] hover:bg-[#2C2925] active:bg-black text-[#F9F7F2] rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-sm border border-[#1A1A1A] hover:shadow-md"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#EFECE5]">
            <p className="text-[11px] text-[#8F8A7E] leading-relaxed">
              Landlords use the same screen to access the full management console.
            </p>
            <p className="text-[11px] text-[#8F8A7E] leading-relaxed mt-1.5 flex items-center gap-1.5">
              <PhoneCall className="w-3 h-3" />
              Need help? Call customer care on
              <a href="tel:+254732075012" className="font-mono font-semibold text-[#7A571A]">0732 075 012</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
