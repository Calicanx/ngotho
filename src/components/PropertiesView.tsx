import React, { useState } from 'react';
import { Property, Unit, Tenant, UnitStatus, UnitType } from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { 
  Building, 
  Plus, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  CreditCard, 
  Edit, 
  Search,
  LayoutGrid,
  List as ListIcon,
  Tag,
  DollarSign
} from 'lucide-react';

interface PropertiesViewProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  settings: AppSettings;
  onAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onAddUnit: (propertyId?: string) => void;
  onEditUnit: (unit: Unit) => void;
  onAssignTenant: (unit: Unit) => void;
  onRecordPayment: (tenantId: string) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  units,
  tenants,
  settings,
  onAddProperty,
  onEditProperty,
  onAddUnit,
  onEditUnit,
  onAssignTenant,
  onRecordPayment,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered units
  const filteredUnits = units.filter((u) => {
    if (selectedPropertyId !== 'all' && u.propertyId !== selectedPropertyId) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (typeFilter !== 'all' && u.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const prop = properties.find((p) => p.id === u.propertyId);
      const tenant = tenants.find((t) => t.id === u.currentTenantId);
      const matchesNumber = u.unitNumber.toLowerCase().includes(q);
      const matchesProp = prop?.name.toLowerCase().includes(q);
      const matchesTenant = tenant?.fullName.toLowerCase().includes(q);
      if (!matchesNumber && !matchesProp && !matchesTenant) return false;
    }
    return true;
  });

  const activeProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            Estates & Rental Units
          </h2>
          <p className="text-xs text-[#736E65]">
            Manage apartment complexes, residential courts, individual houses, and current occupancies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-property-view"
            onClick={onAddProperty}
            className="px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Building className="w-3.5 h-3.5 text-[#736E65]" />
            Add Estate
          </button>

          <button
            id="btn-add-unit-view"
            onClick={() => onAddUnit(selectedPropertyId !== 'all' ? selectedPropertyId : undefined)}
            className="px-4 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs border border-[#1A1A1A]"
          >
            <Plus className="w-3.5 h-3.5 text-[#E5D7B7]" />
            Add Unit / House
          </button>
        </div>
      </div>

      {/* Property Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E0D8]">
        <button
          onClick={() => setSelectedPropertyId('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
            selectedPropertyId === 'all'
              ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A] shadow-xs'
              : 'bg-white text-[#615C53] hover:bg-[#FAF8F5] border-[#E5E0D8]'
          }`}
        >
          All Estates ({units.length} units)
        </button>

        {properties.map((p) => {
          const propUnits = units.filter((u) => u.propertyId === p.id);
          const vacantCount = propUnits.filter((u) => u.status === 'vacant').length;

          return (
            <button
              key={p.id}
              onClick={() => setSelectedPropertyId(p.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors inline-flex items-center gap-1.5 border ${
                selectedPropertyId === p.id
                  ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A] shadow-xs'
                  : 'bg-white text-[#615C53] hover:bg-[#FAF8F5] border-[#E5E0D8]'
              }`}
            >
              {p.name}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedPropertyId === p.id
                  ? 'bg-[#33302C] text-[#E5D7B7]'
                  : 'bg-[#F4F0E8] text-[#736E65]'
              }`}>
                {propUnits.length}
              </span>
              {vacantCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31]"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Estate Details Banner (when an estate is selected) */}
      {activeProperty && (
        <div className="bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {activeProperty.imageUrl && (
              <img
                src={activeProperty.imageUrl}
                alt={activeProperty.name}
                referrerPolicy="no-referrer"
                className="w-full sm:w-36 h-28 object-cover rounded-lg border border-[#E5E0D8]"
              />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">{activeProperty.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFEAE1] text-[#524E46] border border-[#DDD7CB]">
                  {activeProperty.type}
                </span>
              </div>
              <p className="text-xs text-[#736E65] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8F8A7E]" />
                {activeProperty.location} — {activeProperty.address}
              </p>
              <p className="text-xs text-[#615C53] pt-1 max-w-xl line-clamp-2 leading-relaxed font-sans">
                {activeProperty.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-[#736E65]">
                <span>Caretaker: <strong className="text-[#1A1A1A]">{activeProperty.caretakerName}</strong> ({activeProperty.contactPhone})</span>
                {activeProperty.paybillNumber && (
                  <span>Paybill: <strong className="text-[#1A1A1A] font-mono">{activeProperty.paybillNumber}</strong> (Acc: {activeProperty.accountNumber})</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col justify-between items-end gap-2 shrink-0">
            <button
              onClick={() => onEditProperty(activeProperty)}
              className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-white border border-[#E5E0D8] hover:bg-[#F4F0E8] rounded-md inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Edit className="w-3 h-3 text-[#736E65]" />
              Edit Estate
            </button>
            <div className="text-right text-xs text-[#736E65]">
              <span className="font-serif font-bold text-[#1A1A1A] text-base">
                {units.filter((u) => u.propertyId === activeProperty.id && u.status === 'occupied').length}
              </span>
              /{units.filter((u) => u.propertyId === activeProperty.id).length} units occupied
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E0D8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#8F8A7E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter unit #, tenant..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] placeholder:text-[#8F8A7E] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="vacant">Vacant Only</option>
            <option value="occupied">Occupied Only</option>
            <option value="maintenance">In Maintenance</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none"
          >
            <option value="all">All House Types</option>
            <option value="Bedsitter">Bedsitter</option>
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedroom">2 Bedroom</option>
            <option value="3 Bedroom">3 Bedroom</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#F4F0E8] p-1 rounded-lg border border-[#E5E0D8]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white text-[#1A1A1A] shadow-2xs border border-[#E5E0D8]' : 'text-[#736E65] hover:text-[#1A1A1A]'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-[#1A1A1A] shadow-2xs border border-[#E5E0D8]' : 'text-[#736E65] hover:text-[#1A1A1A]'
            }`}
            title="Table View"
          >
            <ListIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Units Render: Grid or Table */}
      {filteredUnits.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-12 text-center text-[#736E65] space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <Building className="w-9 h-9 text-[#A39E92] mx-auto" />
          <p className="font-serif font-bold text-[#1A1A1A] text-base">No houses match your current filter criteria</p>
          <p className="text-xs text-[#8F8A7E]">Try clearing your filters or register a new house to this estate.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => {
            const property = properties.find((p) => p.id === unit.propertyId);
            const tenant = tenants.find((t) => t.id === unit.currentTenantId);

            return (
              <div
                key={unit.id}
                className="bg-white rounded-xl border border-[#E5E0D8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#C4BDB0] transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-[#1A1A1A] font-mono">
                          Unit {unit.unitNumber}
                        </span>
                        <span className="text-[11px] text-[#8F8A7E]">Floor {unit.floor}</span>
                      </div>
                      <p className="text-xs text-[#736E65] font-medium">
                        {property?.name}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${
                        unit.status === 'occupied'
                          ? 'bg-[#EBF0EB] text-[#24482B] border-[#D0E0D2]'
                          : unit.status === 'vacant'
                          ? 'bg-[#FAF8F5] text-[#1A1A1A] border-[#DCD5C8]'
                          : 'bg-[#FBF5E8] text-[#7A571A] border-[#F2E3C6]'
                      }`}
                    >
                      {unit.status}
                    </span>
                  </div>

                  {/* Rent and Specs */}
                  <div className="mt-3 p-3 bg-[#FAF8F5] rounded-lg border border-[#EFECE5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#8F8A7E] block">Monthly Rent</span>
                      <span className="font-serif font-bold text-[#1A1A1A] text-base">
                        {StorageService.formatCurrency(unit.monthlyRent, settings.currencySymbol)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-[#8F8A7E] block">House Type</span>
                      <span className="font-semibold text-[#1A1A1A] text-xs">{unit.type}</span>
                    </div>
                  </div>

                  {/* Current Tenant snippet if occupied */}
                  {unit.status === 'occupied' && tenant ? (
                    <div className="mt-2.5 pt-2 border-t border-[#EFECE5] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#736E65] text-[11px]">Tenant:</span>
                        <span className="font-bold text-[#1A1A1A]">{tenant.fullName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#736E65] text-[11px]">Contact:</span>
                        <span className="text-[#1A1A1A] font-mono text-[11px]">{tenant.phone}</span>
                      </div>
                      {tenant.balance > 0 && (
                        <div className="flex items-center justify-between text-[#8C2C24] font-semibold text-[11px]">
                          <span>Arrears:</span>
                          <span className="font-mono">{StorageService.formatCurrency(tenant.balance, settings.currencySymbol)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2.5 pt-2 border-t border-[#EFECE5] text-xs text-[#736E65] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A34]" />
                      <span className="italic font-serif">Ready for tenancy registry</span>
                    </div>
                  )}

                  {/* Features badges */}
                  {unit.features && unit.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-[#EFECE5]">
                      {unit.features.slice(0, 3).map((f) => (
                        <span key={f} className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#5C5850] text-[10px] border border-[#E5E0D8]">
                          {f}
                        </span>
                      ))}
                      {unit.features.length > 3 && (
                        <span className="text-[10px] text-[#8F8A7E] self-center">
                          +{unit.features.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#EFECE5] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onEditUnit(unit)}
                    className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#F4F0E8] rounded-md text-xs transition-colors border border-transparent hover:border-[#E5E0D8]"
                    title="Edit Unit Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {unit.status === 'vacant' ? (
                      <button
                        onClick={() => onAssignTenant(unit)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] rounded-md transition-colors shadow-2xs"
                      >
                        Assign Tenant
                      </button>
                    ) : unit.status === 'occupied' && tenant ? (
                      <button
                        onClick={() => onRecordPayment(tenant.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] bg-white hover:bg-[#F4F0E8] border border-[#E5E0D8] rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        <DollarSign className="w-3 h-3 text-[#1A1A1A]" />
                        Collect Rent
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#736E65] font-medium uppercase tracking-wider text-[10px] border-b border-[#E5E0D8]">
              <tr>
                <th className="py-3 px-4">Unit #</th>
                <th className="py-3 px-4">Estate / Property</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Monthly Rent</th>
                <th className="py-3 px-4">Current Tenant</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {filteredUnits.map((unit) => {
                const property = properties.find((p) => p.id === unit.propertyId);
                const tenant = tenants.find((t) => t.id === unit.currentTenantId);

                return (
                  <tr key={unit.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-[#1A1A1A]">
                      Unit {unit.unitNumber}
                    </td>
                    <td className="py-3 px-4 font-serif font-medium text-[#1A1A1A]">
                      {property?.name}
                    </td>
                    <td className="py-3 px-4 text-[#615C53]">{unit.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${
                          unit.status === 'occupied'
                            ? 'bg-[#EBF0EB] text-[#24482B] border-[#D0E0D2]'
                            : unit.status === 'vacant'
                            ? 'bg-[#FAF8F5] text-[#1A1A1A] border-[#DCD5C8]'
                            : 'bg-[#FBF5E8] text-[#7A571A] border-[#F2E3C6]'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-[#1A1A1A]">
                      {StorageService.formatCurrency(unit.monthlyRent, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-4">
                      {tenant ? (
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{tenant.fullName}</p>
                          <p className="text-[11px] text-[#736E65] font-mono">{tenant.phone}</p>
                        </div>
                      ) : (
                        <span className="text-[#8F8A7E] italic font-serif">No tenant assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditUnit(unit)}
                          className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#F4F0E8] rounded-md transition-colors"
                          title="Edit Unit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {unit.status === 'vacant' ? (
                          <button
                            onClick={() => onAssignTenant(unit)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] rounded-md transition-colors shadow-2xs"
                          >
                            Assign
                          </button>
                        ) : tenant ? (
                          <button
                            onClick={() => onRecordPayment(tenant.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#1A1A1A] bg-white hover:bg-[#F4F0E8] border border-[#E5E0D8] rounded-md transition-colors"
                          >
                            Pay
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
