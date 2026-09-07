import React, { useState } from 'react';
import { Unit, Property, UnitType, UnitStatus } from '../types';
import { AppSettings, StorageService } from '../services/storage';
import { X, Building2, Layers } from 'lucide-react';

interface AddUnitModalProps {
  properties: Property[];
  settings: AppSettings;
  existingUnit?: Unit;
  defaultPropertyId?: string;
  onSaveUnit: (unit: Unit) => void;
  onClose: () => void;
}

const UNIT_TYPES: UnitType[] = [
  'Bedsitter',
  'Studio',
  '1 Bedroom',
  '2 Bedroom',
  '3 Bedroom',
  '4 Bedroom',
  'Commercial Shop',
];

const POPULAR_FEATURES = [
  'Balcony',
  'Master Ensuite',
  'Instant Shower',
  'Fiber Wifi Ready',
  'Built-in Wardrobes',
  'Granite Countertop',
  'Dedicated Parking',
  'Borehole Water',
  'Security Grill',
  'Solar Water Heater',
];

export const AddUnitModal: React.FC<AddUnitModalProps> = ({
  properties,
  settings,
  existingUnit,
  defaultPropertyId,
  onSaveUnit,
  onClose,
}) => {
  const [propertyId, setPropertyId] = useState(
    existingUnit?.propertyId || defaultPropertyId || (properties[0]?.id || '')
  );
  const [unitNumber, setUnitNumber] = useState(existingUnit?.unitNumber || '');
  const [floor, setFloor] = useState<number>(existingUnit?.floor || 1);
  const [type, setType] = useState<UnitType>(existingUnit?.type || '1 Bedroom');
  const [monthlyRent, setMonthlyRent] = useState<number>(existingUnit?.monthlyRent || 25000);
  const [depositAmount, setDepositAmount] = useState<number>(
    existingUnit?.depositAmount || existingUnit?.monthlyRent || 25000
  );
  const [garbageFee, setGarbageFee] = useState<number>(existingUnit?.garbageFee || 500);
  const [waterRatePerUnit, setWaterRatePerUnit] = useState<number>(
    existingUnit?.waterRatePerUnit || 150
  );
  const [electricityType, setElectricityType] = useState<'Token / Pre-paid' | 'Post-paid Meter'>(
    existingUnit?.electricityType || 'Token / Pre-paid'
  );
  const [status, setStatus] = useState<UnitStatus>(existingUnit?.status || 'vacant');
  const [waterMeterReading, setWaterMeterReading] = useState<number>(
    existingUnit?.waterMeterLastReading || 100
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    existingUnit?.features || ['Instant Shower', 'Built-in Wardrobes']
  );
  const [customFeature, setCustomFeature] = useState('');

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const handleRentChange = (amount: number) => {
    setMonthlyRent(amount);
    if (!existingUnit) {
      setDepositAmount(amount); // standard 1-month deposit default
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !unitNumber.trim()) return;

    const unit: Unit = {
      id: existingUnit?.id || `unit-${Date.now()}`,
      propertyId,
      unitNumber: unitNumber.trim(),
      floor: Number(floor),
      type,
      monthlyRent: Number(monthlyRent),
      depositAmount: Number(depositAmount),
      garbageFee: Number(garbageFee),
      waterRatePerUnit: Number(waterRatePerUnit),
      electricityType,
      status,
      currentTenantId: existingUnit?.currentTenantId,
      features: selectedFeatures,
      waterMeterLastReading: Number(waterMeterReading),
    };

    onSaveUnit(unit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="add-unit-modal"
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E5E0D8] overflow-hidden my-6"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF8F5] border border-[#E5E0D8] text-[#7A571A] rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">
                {existingUnit ? `Edit Unit ${existingUnit.unitNumber}` : 'Add House / Unit'}
              </h3>
              <p className="text-xs text-[#736E65] font-serif italic">Configure rent, floor, amenities, and meters</p>
            </div>
          </div>
          <button
            id="btn-close-unit-modal"
            onClick={onClose}
            className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Estate selection */}
          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">Select Property / Estate</label>
            <select
              id="select-unit-property"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.location})
                </option>
              ))}
            </select>
          </div>

          {/* Unit Number & Floor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Unit / Door Number</label>
              <input
                id="input-unit-number"
                type="text"
                placeholder="e.g. A102, Flat 4, Bedsitter B"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Floor Level</label>
              <input
                type="number"
                min="0"
                max="30"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Unit Type & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">House Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as UnitType)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Occupancy Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UnitStatus)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="vacant">Vacant (Ready to rent)</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          {/* Rent & Deposit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                Monthly Rent ({settings.currencySymbol})
              </label>
              <input
                id="input-unit-rent"
                type="number"
                min="0"
                step="100"
                value={monthlyRent}
                onChange={(e) => handleRentChange(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                Security Deposit ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Utilities */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                Garbage Fee ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={garbageFee}
                onChange={(e) => setGarbageFee(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                Water Rate / Unit
              </label>
              <input
                type="number"
                min="0"
                value={waterRatePerUnit}
                onChange={(e) => setWaterRatePerUnit(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Initial Water Meter</label>
              <input
                type="number"
                min="0"
                value={waterMeterReading}
                onChange={(e) => setWaterMeterReading(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">Electricity Meter Type</label>
            <select
              value={electricityType}
              onChange={(e) => setElectricityType(e.target.value as 'Token / Pre-paid' | 'Post-paid Meter')}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="Token / Pre-paid">KPLC Token / Pre-paid Meter (Tenant purchases own tokens)</option>
              <option value="Post-paid Meter">Post-paid Submeter (Billed with rent)</option>
            </select>
          </div>

          {/* Features / Amenities */}
          <div>
            <label className="block font-medium text-[#1A1A1A] mb-2">Amenities & Features</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_FEATURES.map((feat) => {
                const isSelected = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-[#F9F7F2] border border-[#1A1A1A]'
                        : 'bg-[#FAF8F5] text-[#736E65] hover:bg-[#EFEAE1] border border-[#E5E0D8]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {feat}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add other feature (e.g. Jacuzzi, Pantry)"
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomFeature();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
              <button
                type="button"
                onClick={addCustomFeature}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-[#FAF8F5] text-[#1A1A1A] rounded-lg border border-[#E5E0D8]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
            <button
              type="button"
              id="btn-cancel-unit"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#615C53] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-unit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors shadow-2xs border border-[#1A1A1A]"
            >
              {existingUnit ? 'Update Unit' : 'Save Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
