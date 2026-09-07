import React, { useState } from 'react';
import { UtilityReading, Unit, Property, Tenant } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { Droplet, Zap, Plus, Check, Search, Calendar, FileText } from 'lucide-react';

interface UtilitiesViewProps {
  utilities: UtilityReading[];
  units: Unit[];
  properties: Property[];
  tenants: Tenant[];
  settings: AppSettings;
  onSaveReading: (reading: UtilityReading) => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({
  utilities,
  units,
  properties,
  tenants,
  settings,
  onSaveReading,
}) => {
  const [showReadingForm, setShowReadingForm] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.id || '');
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [month, setMonth] = useState<string>('September 2026');

  const activeUnit = units.find((u) => u.id === selectedUnitId);
  const activeProperty = properties.find((p) => p.id === activeUnit?.propertyId);
  const activeTenant = tenants.find((t) => t.id === activeUnit?.currentTenantId);

  const prevReading = activeUnit?.waterMeterLastReading || 0;
  const unitsConsumed = Math.max(0, currentReading - prevReading);
  const rate = activeUnit?.waterRatePerUnit || 150;
  const calculatedCost = unitsConsumed * rate;

  const handleOpenForm = (unitId?: string) => {
    if (unitId) {
      setSelectedUnitId(unitId);
      const u = units.find((item) => item.id === unitId);
      setCurrentReading((u?.waterMeterLastReading || 0) + 8);
    } else {
      setCurrentReading((activeUnit?.waterMeterLastReading || 0) + 8);
    }
    setShowReadingForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUnit) return;

    const newReading: UtilityReading = {
      id: `ut-${Date.now()}`,
      unitId: activeUnit.id,
      propertyId: activeUnit.propertyId,
      month,
      previousWaterReading: prevReading,
      currentWaterReading: Number(currentReading),
      waterUnitsUsed: unitsConsumed,
      waterCost: calculatedCost,
      billedDate: new Date().toISOString().split('T')[0],
      isPaid: false,
    };

    onSaveReading(newReading);
    setShowReadingForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            Utility Meters & Sub-billing
          </h2>
          <p className="text-xs text-[#736E65]">
            Log monthly water submeter readings, calculate consumption rates, and invoice tenants directly.
          </p>
        </div>

        <button
          onClick={() => handleOpenForm()}
          className="px-4 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs border border-[#1A1A1A]"
        >
          <Plus className="w-3.5 h-3.5 text-[#E5D7B7]" />
          Log Meter Reading
        </button>
      </div>

      {/* Meter Log Form Modal/Drawer */}
      {showReadingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E5E0D8] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#7A571A]" />
                Record Monthly Water Reading
              </h3>
              <button
                onClick={() => setShowReadingForm(false)}
                className="text-[#8F8A7E] hover:text-[#1A1A1A] text-sm font-medium"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Select House / Unit</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    setSelectedUnitId(e.target.value);
                    const u = units.find((x) => x.id === e.target.value);
                    setCurrentReading((u?.waterMeterLastReading || 0) + 8);
                  }}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  {units.map((u) => {
                    const prop = properties.find((p) => p.id === u.propertyId);
                    return (
                      <option key={u.id} value={u.id}>
                        {prop?.name} - Unit {u.unitNumber} (Last: {u.waterMeterLastReading} units)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Billing Month</label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="e.g. September 2026"
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                  <span className="text-[10px] text-[#8F8A7E] uppercase tracking-wider font-semibold block">Previous Meter</span>
                  <span className="text-base font-bold font-mono text-[#1A1A1A]">{prevReading}</span>
                  <span className="text-[10px] text-[#736E65] block font-mono">units (m³)</span>
                </div>

                <div>
                  <label className="block font-medium text-[#1A1A1A] mb-1">New Meter Reading</label>
                  <input
                    type="number"
                    min={prevReading}
                    step="1"
                    value={currentReading}
                    onChange={(e) => setCurrentReading(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-bold font-mono focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Live Calculation preview */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg space-y-1.5 text-[#1A1A1A]">
                <div className="flex justify-between font-medium">
                  <span className="text-[#736E65]">Units Consumed:</span>
                  <span className="font-mono">{unitsConsumed} units</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#736E65]">
                  <span>Tariff Rate:</span>
                  <span className="font-mono">{StorageService.formatCurrency(rate, settings.currencySymbol)} / unit</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-[#E5E0D8] text-[#1A1A1A]">
                  <span className="font-serif">Total Water Bill:</span>
                  <span className="font-serif text-base">{StorageService.formatCurrency(calculatedCost, settings.currencySymbol)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReadingForm(false)}
                  className="px-4 py-2 bg-white border border-[#E5E0D8] text-[#615C53] hover:bg-[#FAF8F5] font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1A1A] text-[#F9F7F2] hover:bg-[#2E2A26] font-semibold rounded-lg transition-colors border border-[#1A1A1A]"
                >
                  Save Reading & Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unit Meters Quick Grid */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Active Unit Water Meters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {units.map((unit) => {
            const prop = properties.find((p) => p.id === unit.propertyId);
            const tenant = tenants.find((t) => t.id === unit.currentTenantId);

            return (
              <div key={unit.id} className="p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1A1A1A] font-mono">
                    Unit {unit.unitNumber}
                  </span>
                  <span className="text-[10px] text-[#736E65] font-medium">
                    {prop?.name}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-[#736E65] text-xs">Last Reading:</span>
                  <span className="text-base font-serif font-bold text-[#1A1A1A]">
                    {unit.waterMeterLastReading} <span className="text-[11px] text-[#8F8A7E] font-sans font-normal">m³</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-[11px]">
                  <span className="text-[#736E65] truncate max-w-[100px] italic font-serif">
                    {tenant?.fullName || 'Vacant'}
                  </span>
                  <button
                    onClick={() => handleOpenForm(unit.id)}
                    className="text-[#1A1A1A] hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    + Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Utilities Ledger */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between">
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Recent Meter Readings & Billing History</h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] text-[#736E65] font-medium uppercase tracking-wider text-[10px] border-b border-[#E5E0D8]">
            <tr>
              <th className="py-3 px-4">Period</th>
              <th className="py-3 px-4">House / Unit</th>
              <th className="py-3 px-4">Previous Meter</th>
              <th className="py-3 px-4">Current Meter</th>
              <th className="py-3 px-4">Units Used</th>
              <th className="py-3 px-4 text-right">Billed Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE5]">
            {utilities.map((reading) => {
              const unit = units.find((u) => u.id === reading.unitId);
              const prop = properties.find((p) => p.id === reading.propertyId);

              return (
                <tr key={reading.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1A1A1A] font-serif">{reading.month}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#1A1A1A] font-mono">Unit {unit?.unitNumber}</span>
                    <span className="text-[11px] text-[#736E65] block">{prop?.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#736E65]">{reading.previousWaterReading}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#1A1A1A]">{reading.currentWaterReading}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#1A1A1A]">{reading.waterUnitsUsed} units</td>
                  <td className="py-3 px-4 text-right font-serif font-bold text-[#1A1A1A] text-sm">
                    {StorageService.formatCurrency(reading.waterCost, settings.currencySymbol)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF0EB] text-[#24482B] border border-[#D0E0D2] font-mono">
                      Paid
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
