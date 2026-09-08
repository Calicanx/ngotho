import React, { useState } from 'react';
import { AppSettings, StorageService } from '../services/storage';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Building, 
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onImportData: (jsonStr: string) => boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetData,
  onImportData,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ngotho_rentals_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportData(content);
        if (ok) {
          setImportStatus('Data imported successfully!');
        } else {
          setImportStatus('Failed to parse JSON backup file.');
        }
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          System Preferences & Data Backup
        </h2>
        <p className="text-xs text-[#736E65]">
          Configure landlord organization details, receipt letterheads, currency, and complete JSON backups.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company / Landlord Profile */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 text-xs">
          <h3 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#7A571A]" />
            Landlord & Receipt Letterhead Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-medium text-[#1A1A1A] mb-1">Company / Landlord Legal Name</label>
              <input
                type="text"
                value={formData.landlordCompanyName}
                onChange={(e) => setFormData({ ...formData, landlordCompanyName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={formData.landlordPhone}
                onChange={(e) => setFormData({ ...formData, landlordPhone: e.target.value })}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Official Email Address</label>
              <input
                type="email"
                value={formData.landlordEmail}
                onChange={(e) => setFormData({ ...formData, landlordEmail: e.target.value })}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-[#1A1A1A] mb-1">Head Office Physical Address</label>
              <input
                type="text"
                value={formData.landlordAddress}
                onChange={(e) => setFormData({ ...formData, landlordAddress: e.target.value })}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>
        </div>

        {/* Financial & Policy Settings */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 text-xs">
          <h3 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#7A571A]" />
            Rent Collection & Policy Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Currency Symbol</label>
              <select
                value={formData.currencySymbol}
                onChange={(e) => {
                  const sym = e.target.value;
                  const code = sym === 'KSh' ? 'KES' : sym === '$' ? 'USD' : sym === '€' ? 'EUR' : 'GBP';
                  setFormData({ ...formData, currencySymbol: sym, currencyCode: code });
                }}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="KSh">KSh (Kenyan Shillings - KES)</option>
                <option value="$">$ (US Dollar - USD)</option>
                <option value="€">€ (Euro - EUR)</option>
                <option value="£">£ (British Pound - GBP)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Monthly Rent Due Day</label>
              <select
                value={formData.rentDueDay}
                onChange={(e) => setFormData({ ...formData, rentDueDay: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value={1}>1st of Month</option>
                <option value={5}>5th of Month (Standard)</option>
                <option value={10}>10th of Month</option>
                <option value={15}>15th of Month</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Default Paybill Number</label>
              <input
                type="text"
                value={formData.paybillNumber}
                onChange={(e) => setFormData({ ...formData, paybillNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Default Paybill Account Number</label>
              <input
                type="text"
                value={formData.paybillAccountNumber}
                onChange={(e) => setFormData({ ...formData, paybillAccountNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
              <p className="text-[10px] text-[#8A8477] mt-1">Editable anytime by the admin. Include this number when tenants pay rent via M-PESA.</p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-[#24482B] inline-flex items-center gap-1 font-serif italic">
                <Check className="w-4 h-4 text-[#24482B]" /> Preferences saved successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            id="btn-save-settings"
            className="px-5 py-2.5 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors shadow-2xs inline-flex items-center gap-1.5 border border-[#1A1A1A]"
          >
            <Save className="w-3.5 h-3.5 text-[#E5D7B7]" />
            Save Preferences
          </button>
        </div>
      </form>

      {/* Backup & Restore Section */}
      <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 text-xs">
        <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Data Persistence, Backup & Export</h3>
        <p className="text-[#736E65]">
          All records (properties, houses, tenants, rent receipts, fundi tickets, utility meters) are stored safely in local storage.
          You can download a complete backup as a portable JSON file or restore from a previous backup.
        </p>

        {importStatus && (
          <div className="p-3 bg-[#EBF0EB] border border-[#D0E0D2] text-[#24482B] rounded-lg font-medium">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            id="btn-export-backup"
            onClick={handleExportJSON}
            className="px-4 py-2 text-xs font-medium text-[#1A1A1A] bg-white hover:bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#736E65]" />
            Export JSON Backup
          </button>

          <label className="px-4 py-2 text-xs font-medium text-[#1A1A1A] bg-white hover:bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#736E65]" />
            Import JSON Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            id="btn-reset-demo-data"
            onClick={() => {
              if (window.confirm('Reset all data back to Ngotho sample estates, units, and tenants?')) {
                onResetData();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-[#8C2C24] bg-[#FDF0EE] hover:bg-[#FBE8E5] border border-[#F5D5D1] rounded-lg transition-colors inline-flex items-center gap-1.5 ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};
