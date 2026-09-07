import React, { useState } from 'react';
import { MaintenanceRequest, Property, Unit, Tenant, MaintenanceCategory, MaintenancePriority, MaintenanceStatus } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { X, Wrench, AlertTriangle } from 'lucide-react';

interface AddMaintenanceModalProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  settings: AppSettings;
  existingRequest?: MaintenanceRequest;
  onSaveRequest: (request: MaintenanceRequest) => void;
  onClose: () => void;
}

const CATEGORIES: MaintenanceCategory[] = [
  'Plumbing',
  'Electrical',
  'Roof & Ceiling',
  'Carpentry & Doors',
  'Painting',
  'Security & Locks',
  'Other',
];

export const AddMaintenanceModal: React.FC<AddMaintenanceModalProps> = ({
  properties,
  units,
  tenants,
  settings,
  existingRequest,
  onSaveRequest,
  onClose,
}) => {
  const [propertyId, setPropertyId] = useState(
    existingRequest?.propertyId || properties[0]?.id || ''
  );
  
  const propertyUnits = units.filter((u) => u.propertyId === propertyId);
  const [unitId, setUnitId] = useState(
    existingRequest?.unitId || propertyUnits[0]?.id || ''
  );

  const activeUnit = units.find((u) => u.id === unitId);
  const activeTenant = tenants.find((t) => t.id === activeUnit?.currentTenantId);

  const [title, setTitle] = useState(existingRequest?.title || '');
  const [description, setDescription] = useState(existingRequest?.description || '');
  const [category, setCategory] = useState<MaintenanceCategory>(
    existingRequest?.category || 'Plumbing'
  );
  const [priority, setPriority] = useState<MaintenancePriority>(
    existingRequest?.priority || 'medium'
  );
  const [status, setStatus] = useState<MaintenanceStatus>(
    existingRequest?.status || 'reported'
  );
  const [assignedTechnician, setAssignedTechnician] = useState(
    existingRequest?.assignedTechnician || ''
  );
  const [technicianPhone, setTechnicianPhone] = useState(
    existingRequest?.technicianPhone || '+254 '
  );
  const [estimatedCost, setEstimatedCost] = useState<number>(
    existingRequest?.estimatedCost || 3000
  );
  const [actualCost, setActualCost] = useState<number>(
    existingRequest?.actualCost || 0
  );

  const handlePropertyChange = (newPropId: string) => {
    setPropertyId(newPropId);
    const firstUnit = units.find((u) => u.propertyId === newPropId);
    if (firstUnit) {
      setUnitId(firstUnit.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !unitId) return;

    const request: MaintenanceRequest = {
      id: existingRequest?.id || `mnt-${Date.now()}`,
      ticketCode: existingRequest?.ticketCode || StorageService.generateTicketCode(),
      propertyId,
      unitId,
      tenantId: activeTenant?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      reportedDate: existingRequest?.reportedDate || new Date().toISOString().split('T')[0],
      resolvedDate: status === 'completed' ? (existingRequest?.resolvedDate || new Date().toISOString().split('T')[0]) : undefined,
      assignedTechnician: assignedTechnician.trim() || undefined,
      technicianPhone: technicianPhone.trim() || undefined,
      estimatedCost: Number(estimatedCost),
      actualCost: Number(actualCost) > 0 ? Number(actualCost) : undefined,
    };

    onSaveRequest(request);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="add-maintenance-modal"
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E5E0D8] overflow-hidden my-6"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF8F5] border border-[#E5E0D8] text-[#7A571A] rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">
                {existingRequest ? `Edit Ticket ${existingRequest.ticketCode}` : 'Log Maintenance & Repair Ticket'}
              </h3>
              <p className="text-xs text-[#736E65] font-serif italic">Track fundi work, repairs, and property upkeep</p>
            </div>
          </div>
          <button
            id="btn-close-maintenance-modal"
            onClick={onClose}
            className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Property & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Estate / Property</label>
              <select
                value={propertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">House / Unit</label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
              >
                {propertyUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unitNumber} ({u.type}) - {u.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeTenant && (
            <div className="p-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[11px] text-[#736E65] flex justify-between items-center">
              <span>Occupant: <strong className="text-[#1A1A1A]">{activeTenant.fullName}</strong></span>
              <span>Phone: <strong className="text-[#1A1A1A] font-mono">{activeTenant.phone}</strong></span>
            </div>
          )}

          {/* Issue Title & Category */}
          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">Issue Headline / Title</label>
            <input
              id="input-maintenance-title"
              type="text"
              placeholder="e.g. Master bathroom pipe leakage or Roof leak in dining area"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaintenanceCategory)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Urgency / Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="low">Low - Routine</option>
                <option value="medium">Medium - Normal</option>
                <option value="high">High - Needs prompt fundi</option>
                <option value="urgent">Urgent / Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">Detailed Description of Problem</label>
            <textarea
              rows={3}
              placeholder="Provide exact details of fault, parts required, symptoms reported by tenant..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Technician & Costs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Assigned Fundi / Contractor</label>
              <input
                type="text"
                placeholder="e.g. Fundi John (Electrician)"
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Fundi Phone Number</label>
              <input
                type="text"
                placeholder="+254 7..."
                value={technicianPhone}
                onChange={(e) => setTechnicianPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                Estimated Cost ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">
                Actual Cost Incurred ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={actualCost}
                onChange={(e) => setActualCost(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">Ticket Progress Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="reported">Reported / Pending Fundi</option>
              <option value="in_progress">In Progress / Work Ongoing</option>
              <option value="completed">Completed & Verified</option>
              <option value="cancelled">Cancelled / False Alarm</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
            <button
              type="button"
              id="btn-cancel-maintenance"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#615C53] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-maintenance"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors shadow-2xs border border-[#1A1A1A]"
            >
              {existingRequest ? 'Update Ticket' : 'Save Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
