import React, { useState } from 'react';
import { Tenant, Unit, Property } from '../types';
import { AppSettings, StorageService } from '../services/storage';
import { X, UserPlus, Home, UserCheck } from 'lucide-react';

interface AddTenantModalProps {
  units: Unit[];
  properties: Property[];
  settings: AppSettings;
  existingTenant?: Tenant;
  onSaveTenant: (tenant: Tenant, assignedUnitId: string, previousUnitId?: string) => void;
  onClose: () => void;
}

export const AddTenantModal: React.FC<AddTenantModalProps> = ({
  units,
  properties,
  settings,
  existingTenant,
  onSaveTenant,
  onClose,
}) => {
  // Available units: vacant units + the unit currently assigned to existingTenant
  const availableUnits = units.filter(
    (u) => u.status === 'vacant' || (existingTenant && u.id === existingTenant.unitId)
  );

  const [fullName, setFullName] = useState(existingTenant?.fullName || '');
  const [phone, setPhone] = useState(existingTenant?.phone || '+254 ');
  const [email, setEmail] = useState(existingTenant?.email || '');
  const [nationalId, setNationalId] = useState(existingTenant?.nationalId || '');
  const [occupation, setOccupation] = useState(existingTenant?.occupation || '');
  const [emergencyName, setEmergencyName] = useState(existingTenant?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(existingTenant?.emergencyContactPhone || '');
  
  const [selectedUnitId, setSelectedUnitId] = useState(
    existingTenant?.unitId || (availableUnits[0]?.id || '')
  );

  const activeUnit = units.find((u) => u.id === selectedUnitId);
  const activeProperty = properties.find((p) => p.id === activeUnit?.propertyId);

  const [rentAmount, setRentAmount] = useState<number>(
    existingTenant?.rentAmount || (activeUnit?.monthlyRent || 25000)
  );
  const [depositPaid, setDepositPaid] = useState<number>(
    existingTenant?.depositPaid || (activeUnit?.depositAmount || 25000)
  );
  const [balance, setBalance] = useState<number>(existingTenant?.balance || 0);
  const [leaseStart, setLeaseStart] = useState(
    existingTenant?.leaseStartDate || new Date().toISOString().split('T')[0]
  );
  
  // default 1-year lease
  const defaultLeaseEnd = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  const [leaseEnd, setLeaseEnd] = useState(existingTenant?.leaseEndDate || defaultLeaseEnd());
  const [status, setStatus] = useState<Tenant['status']>(existingTenant?.status || 'active');
  const [notes, setNotes] = useState(existingTenant?.notes || '');

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const u = units.find((item) => item.id === unitId);
    if (u) {
      setRentAmount(u.monthlyRent);
      setDepositPaid(u.depositAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || !activeUnit) return;

    const tenantToSave: Tenant = {
      id: existingTenant?.id || `ten-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      nationalId: nationalId.trim(),
      occupation: occupation.trim(),
      emergencyContactName: emergencyName.trim(),
      emergencyContactPhone: emergencyPhone.trim(),
      propertyId: activeUnit.propertyId,
      unitId: selectedUnitId,
      leaseStartDate: leaseStart,
      leaseEndDate: leaseEnd,
      rentAmount: Number(rentAmount),
      depositPaid: Number(depositPaid),
      balance: Number(balance),
      status,
      notes: notes.trim(),
    };

    onSaveTenant(tenantToSave, selectedUnitId, existingTenant?.unitId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="add-tenant-modal"
        className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#E5E0D8] overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF8F5] border border-[#E5E0D8] text-[#7A571A] rounded-lg">
              {existingTenant ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">
                {existingTenant ? 'Edit Tenant Profile & Lease' : 'Register New Tenant'}
              </h3>
              <p className="text-xs text-[#736E65] font-serif italic">Ngotho Tenant Directory & Lease Agreement</p>
            </div>
          </div>
          <button
            id="btn-close-tenant-modal"
            onClick={onClose}
            className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Unit assignment */}
          <div className="bg-[#FAF8F5] p-4 rounded-lg border border-[#E5E0D8] space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[#736E65]" />
                Assign House / Unit
              </label>
              <span className="text-[11px] text-[#736E65] font-serif italic">
                {availableUnits.length} available unit{availableUnits.length === 1 ? '' : 's'}
              </span>
            </div>

            {availableUnits.length === 0 && !existingTenant ? (
              <div className="p-3 bg-[#FDF0EE] border border-[#F5D5D1] text-[#8C2C24] rounded-lg text-xs">
                All units are currently occupied or in maintenance. Please add a vacant unit first or free up an existing unit.
              </div>
            ) : (
              <select
                id="select-unit-assignment"
                value={selectedUnitId}
                onChange={(e) => handleUnitChange(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white border border-[#E5E0D8] rounded-lg font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {availableUnits.map((u) => {
                  const p = properties.find((prop) => prop.id === u.propertyId);
                  return (
                    <option key={u.id} value={u.id}>
                      {p?.name} - Unit {u.unitNumber} ({u.type}) — Rent: {StorageService.formatCurrency(u.monthlyRent, settings.currencySymbol)}/mo
                    </option>
                  );
                })}
              </select>
            )}

            {activeProperty && activeUnit && (
              <div className="text-[11px] text-[#736E65] flex flex-wrap gap-x-4 pt-1">
                <span>Location: <b className="text-[#1A1A1A]">{activeProperty.location}</b></span>
                <span>Type: <b className="text-[#1A1A1A]">{activeUnit.type}</b></span>
                <span>Water Rate: <b className="text-[#1A1A1A]">{StorageService.formatCurrency(activeUnit.waterRatePerUnit, settings.currencySymbol)}/unit</b></span>
              </div>
            )}
          </div>

          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
              Tenant Personal Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Full Legal Name</label>
                <input
                  id="input-tenant-name"
                  type="text"
                  placeholder="e.g. Samuel K. Mwangi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Phone Number (SMS / WhatsApp)</label>
                <input
                  id="input-tenant-phone"
                  type="text"
                  placeholder="+254 7..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Email Address</label>
                <input
                  id="input-tenant-email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">National ID / Passport No.</label>
                <input
                  id="input-tenant-id"
                  type="text"
                  placeholder="e.g. 32918274"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-[#1A1A1A] mb-1">Occupation / Employer</label>
                <input
                  type="text"
                  placeholder="e.g. High School Teacher, Architect, Business Owner"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
              Emergency Contact / Next of Kin
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Contact Name & Relation</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Mwangi (Sister)"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Emergency Phone</label>
                <input
                  type="text"
                  placeholder="+254 7..."
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* Lease & Financials */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
              Lease Terms & Financials
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Lease Start Date</label>
                <input
                  type="date"
                  value={leaseStart}
                  onChange={(e) => setLeaseStart(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Lease End Date</label>
                <input
                  type="date"
                  value={leaseEnd}
                  onChange={(e) => setLeaseEnd(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Agreed Monthly Rent ({settings.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Security Deposit Paid ({settings.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={depositPaid}
                  onChange={(e) => setDepositPaid(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Current Balance Due ({settings.currencySymbol})</label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Tenancy Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Tenant['status'])}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="active">Active Tenant</option>
                  <option value="notice">On Notice to Vacate</option>
                  <option value="vacated">Past / Vacated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Notes / Special Agreements</label>
              <textarea
                rows={2}
                placeholder="e.g. Has 2 parking spots, permitted 1 cat, pays quarterly"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
            <button
              type="button"
              id="btn-cancel-tenant"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#615C53] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-tenant"
              disabled={availableUnits.length === 0 && !existingTenant}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black disabled:opacity-50 rounded-lg transition-colors shadow-2xs border border-[#1A1A1A]"
            >
              {existingTenant ? 'Update Tenant' : 'Register Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
