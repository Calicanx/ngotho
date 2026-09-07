import React, { useState } from 'react';
import { MaintenanceRequest, Property, Unit, Tenant, MaintenanceStatus } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { 
  Wrench, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  DollarSign, 
  Filter, 
  Edit,
  Building
} from 'lucide-react';

interface MaintenanceViewProps {
  maintenance: MaintenanceRequest[];
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  settings: AppSettings;
  onAddRequest: () => void;
  onEditRequest: (request: MaintenanceRequest) => void;
  onUpdateStatus: (requestId: string, newStatus: MaintenanceStatus) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  maintenance,
  properties,
  units,
  tenants,
  settings,
  onAddRequest,
  onEditRequest,
  onUpdateStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredRequests = maintenance.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    return true;
  });

  const reportedCount = maintenance.filter((m) => m.status === 'reported').length;
  const inProgressCount = maintenance.filter((m) => m.status === 'in_progress').length;
  const completedCount = maintenance.filter((m) => m.status === 'completed').length;
  const totalRepairCosts = maintenance.reduce(
    (acc, m) => acc + (m.actualCost || m.estimatedCost || 0),
    0
  );

  const getPriorityBadge = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF0EE] text-[#8C2C24] border border-[#F5D5D1] uppercase tracking-wide font-mono">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBF5E8] text-[#7A571A] border border-[#F2E3C6] uppercase tracking-wide font-mono">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF8F5] text-[#1A1A1A] border border-[#E5E0D8]">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF8F5] text-[#736E65] border border-[#E5E0D8]">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            Maintenance & Repairs Tracker
          </h2>
          <p className="text-xs text-[#736E65]">
            Log unit faults, assign plumbing/electrical fundis, oversee repairs, and track upkeep expenditure.
          </p>
        </div>

        <button
          id="btn-log-maintenance-view"
          onClick={onAddRequest}
          className="px-4 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs border border-[#1A1A1A]"
        >
          <Plus className="w-3.5 h-3.5 text-[#E5D7B7]" />
          Log Maintenance Ticket
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8F8A7E]">Reported / Pending</span>
          <div className="text-2xl font-serif font-bold text-[#8C2C24] mt-1">{reportedCount}</div>
          <p className="text-[11px] text-[#736E65] mt-0.5 font-serif italic">Awaiting contractor dispatch</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8F8A7E]">Work in Progress</span>
          <div className="text-2xl font-serif font-bold text-[#7A571A] mt-1">{inProgressCount}</div>
          <p className="text-[11px] text-[#736E65] mt-0.5 font-serif italic">Technicians on site</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8F8A7E]">Resolved Issues</span>
          <div className="text-2xl font-serif font-bold text-[#24482B] mt-1">{completedCount}</div>
          <p className="text-[11px] text-[#736E65] mt-0.5 font-serif italic">Repairs signed off</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8F8A7E]">Total Repair Expenses</span>
          <div className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">
            {StorageService.formatCurrency(totalRepairCosts, settings.currencySymbol)}
          </div>
          <p className="text-[11px] text-[#736E65] mt-0.5 font-serif italic">Deductible from estate roll</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              statusFilter === 'all'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A]'
                : 'bg-white text-[#615C53] hover:bg-[#FAF8F5] border-[#E5E0D8]'
            }`}
          >
            All Tickets ({maintenance.length})
          </button>
          <button
            onClick={() => setStatusFilter('reported')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              statusFilter === 'reported'
                ? 'bg-[#8C2C24] text-white border-[#8C2C24]'
                : 'bg-[#FDF0EE] text-[#8C2C24] border-[#F5D5D1] hover:bg-[#FBE8E5]'
            }`}
          >
            Reported ({reportedCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              statusFilter === 'in_progress'
                ? 'bg-[#7A571A] text-white border-[#7A571A]'
                : 'bg-[#FBF5E8] text-[#7A571A] border-[#F2E3C6] hover:bg-[#F6EBD3]'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              statusFilter === 'completed'
                ? 'bg-[#24482B] text-white border-[#24482B]'
                : 'bg-[#EBF0EB] text-[#24482B] border-[#D0E0D2] hover:bg-[#DFE8DF]'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
        >
          <option value="all">All Specialties</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Roof & Ceiling">Roof & Ceiling</option>
          <option value="Carpentry & Doors">Carpentry & Doors</option>
          <option value="Painting">Painting</option>
          <option value="Security & Locks">Security & Locks</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-[#E5E0D8] p-12 text-center text-[#8F8A7E]">
            <CheckCircle2 className="w-10 h-10 text-[#24482B] mx-auto mb-2 opacity-80" />
            <p className="font-serif font-bold text-base text-[#1A1A1A]">No maintenance tickets in this category</p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const property = properties.find((p) => p.id === req.propertyId);
            const unit = units.find((u) => u.id === req.unitId);
            const tenant = tenants.find((t) => t.id === req.tenantId);

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-[#E5E0D8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#CDC7BD] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#7A571A] bg-[#FBF5E8] px-2 py-0.5 rounded border border-[#F2E3C6]">
                        {req.ticketCode}
                      </span>
                      {getPriorityBadge(req.priority)}
                      <span className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#736E65] text-[10px] font-medium border border-[#E5E0D8]">
                        {req.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-[#8F8A7E]">
                      {req.reportedDate}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-[#1A1A1A] leading-snug">
                    {req.title}
                  </h4>
                  <p className="text-xs text-[#736E65] leading-relaxed">
                    {req.description}
                  </p>

                  {/* Location & Tenant Info */}
                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#736E65]">Premises:</span>
                      <span className="font-semibold text-[#1A1A1A]">
                        {property?.name} • Unit {unit?.unitNumber}
                      </span>
                    </div>
                    {tenant && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#736E65]">Occupant:</span>
                        <span className="text-[#1A1A1A]">{tenant.fullName} ({tenant.phone})</span>
                      </div>
                    )}
                    {req.assignedTechnician && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#E5E0D8]">
                        <span className="text-[#736E65]">Technician:</span>
                        <span className="font-medium text-[#1A1A1A] font-serif italic">{req.assignedTechnician}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer status & actions */}
                <div className="pt-3 border-t border-[#EFECE5] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[#8F8A7E] text-[11px] block font-medium">Repair Cost:</span>
                    <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                      {StorageService.formatCurrency(
                        req.actualCost || req.estimatedCost || 0,
                        settings.currencySymbol
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditRequest(req)}
                      className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#F4F0E8] rounded-md transition-colors"
                      title="Edit Ticket Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {req.status !== 'completed' ? (
                      <button
                        onClick={() => onUpdateStatus(req.id, 'completed')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#24482B] hover:bg-[#1B3620] rounded-lg transition-colors shadow-2xs inline-flex items-center gap-1 border border-[#24482B]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#A3D1A9]" />
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-[#24482B] font-semibold text-[11px] flex items-center gap-1 font-serif italic">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#24482B]" />
                        Resolved on {req.resolvedDate || 'recent'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
