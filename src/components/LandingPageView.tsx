import React, { useState, useMemo } from 'react';
import { 
  Property, 
  Unit, 
  Tenant 
} from '../types';
import { StorageService, AppSettings } from '../services/storage';
import { 
  Building2, 
  Home, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Search, 
  Filter, 
  CreditCard, 
  Calculator, 
  Clock, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Award,
  Check
} from 'lucide-react';

interface LandingPageViewProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  settings: AppSettings;
  onOpenManagementPortal: () => void;
  onSelectPropertyUnits?: (propertyId: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  properties,
  units,
  tenants,
  settings,
  onOpenManagementPortal,
}) => {
  // Search & Filter State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxRent, setMaxRent] = useState<number>(60000);
  const [vacantOnly, setVacantOnly] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Move-in Calculator State
  const [calcRent, setCalcRent] = useState<number>(30000);
  const [calcDepositMonths, setCalcDepositMonths] = useState<number>(1);
  const [calcWaterDeposit, setCalcWaterDeposit] = useState<number>(2500);
  const [calcGarbageFee, setCalcGarbageFee] = useState<number>(500);

  // Viewing Modal / Booking State
  const [selectedUnitForBooking, setSelectedUnitForBooking] = useState<Unit | null>(null);
  const [bookingEstateId, setBookingEstateId] = useState<string>(properties[0]?.id || '');
  const [bookingUnitNumber, setBookingUnitNumber] = useState<string>('');
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingPhone, setBookingPhone] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Filtered units
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      // Property filter
      if (selectedPropertyId !== 'all' && unit.propertyId !== selectedPropertyId) {
        return false;
      }
      // Unit type filter
      if (selectedType !== 'all' && unit.type !== selectedType) {
        return false;
      }
      // Max rent
      if (unit.monthlyRent > maxRent) {
        return false;
      }
      // Vacancy filter
      if (vacantOnly && unit.status !== 'vacant') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const prop = properties.find((p) => p.id === unit.propertyId);
        const matchesUnit = unit.unitNumber.toLowerCase().includes(query);
        const matchesType = unit.type.toLowerCase().includes(query);
        const matchesProp = prop ? prop.name.toLowerCase().includes(query) || prop.location.toLowerCase().includes(query) : false;
        if (!matchesUnit && !matchesType && !matchesProp) {
          return false;
        }
      }
      return true;
    });
  }, [units, properties, selectedPropertyId, selectedType, maxRent, vacantOnly, searchQuery]);

  // Handle viewing booking submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      // Reset form after short delay
      setBookingName('');
      setBookingPhone('');
      setBookingEmail('');
      setBookingNotes('');
    }, 4000);
  };

  const openBookingForUnit = (unit: Unit) => {
    setSelectedUnitForBooking(unit);
    setBookingEstateId(unit.propertyId);
    setBookingUnitNumber(unit.unitNumber);
    // Scroll to viewing section
    const el = document.getElementById('section-viewing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F9F7F2] text-[#1A1A1A] font-sans selection:bg-[#E2DBCB] selection:text-[#1A1A1A]">
      
      {/* Top Advisory Banner */}
      <div className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#595349] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3B7A57] animate-pulse"></span>
            <span className="font-medium text-[#1A1A1A]">Now Leasing for 2026:</span>
            <span className="font-serif italic">Units available across Westlands, Ruiru & Kilimani estates.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:+254700123456" className="hover:text-[#1A1A1A] flex items-center gap-1 font-mono transition-colors">
              <Phone className="w-3 h-3 text-[#7A571A]" />
              <span>+254 700 123 456</span>
            </a>
            <span className="text-[#D8D2C5]">|</span>
            <button
              onClick={onOpenManagementPortal}
              id="btn-top-portal-link"
              className="font-medium text-[#7A571A] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
            >
              <span>Landlord Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E0D8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] text-[#736E65]">
                <Award className="w-3.5 h-3.5 text-[#7A571A]" />
                <span className="font-medium uppercase tracking-wider text-[#1A1A1A]">Ngotho Residential Estates</span>
                <span>•</span>
                <span className="font-serif italic">Nairobi & Kiambu Portfolio</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-[1.15]">
                Thoughtfully built homes. <br />
                <span className="font-normal italic text-[#4A453E]">Managed with complete integrity.</span>
              </h1>

              <p className="text-base text-[#615C53] leading-relaxed max-w-2xl font-serif">
                Experience dignified residential living in Westlands, Ruiru, Kilimani, and Nakuru. 
                Enjoy guaranteed borehole water, individual sub-meters, transparent M-PESA paybill receipts, 
                and prompt on-site caretaker response.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#section-listings"
                  id="btn-hero-explore-units"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors shadow-xs border border-[#1A1A1A]"
                >
                  <Search className="w-3.5 h-3.5 text-[#E5D7B7]" />
                  <span>View Available Units</span>
                </a>

                <a
                  href="#section-viewing"
                  id="btn-hero-book-viewing"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#EFEAE1] rounded-lg transition-colors border border-[#E5E0D8]"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#7A571A]" />
                  <span>Schedule a Physical Viewing</span>
                </a>

                <button
                  onClick={onOpenManagementPortal}
                  id="btn-hero-mgmt-portal"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-medium text-[#736E65] hover:text-[#1A1A1A] transition-colors"
                >
                  <span>Landlord Console</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7A571A]" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E5E0D8]/80 text-xs">
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">4 Estates</p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Nairobi & Kiambu</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">
                    {units.filter((u) => u.status === 'vacant').length} Vacancies
                  </p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Move-in Ready</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">M-PESA</p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Instant Paybill Receipts</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">24/7</p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Resident Caretakers</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-lg">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E0D8] bg-[#FAF8F5]">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
                    alt="Ngotho Heights Westlands"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="px-2.5 py-0.5 w-fit rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md text-[#FAF8F5] border border-white/30 mb-1.5">
                      Signature Estate
                    </span>
                    <h3 className="text-xl font-serif font-bold">Ngotho Heights</h3>
                    <p className="text-xs text-[#E5E0D8] flex items-center gap-1 font-serif italic">
                      <MapPin className="w-3.5 h-3.5 text-[#E5D7B7]" />
                      Muthithi Road, Westlands, Nairobi
                    </p>
                  </div>
                </div>

                {/* Micro preview strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                    <p className="text-[10px] text-[#736E65] uppercase tracking-wider font-semibold">Rent From</p>
                    <p className="font-serif font-bold text-[#1A1A1A] mt-0.5">KSh 28,000</p>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                    <p className="text-[10px] text-[#736E65] uppercase tracking-wider font-semibold">Water Supply</p>
                    <p className="font-serif font-bold text-[#3B7A57] mt-0.5">Borehole 24/7</p>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                    <p className="text-[10px] text-[#736E65] uppercase tracking-wider font-semibold">Electricity</p>
                    <p className="font-serif font-bold text-[#1A1A1A] mt-0.5">Token Meter</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive House Hunter & Filter Section */}
      <section id="section-listings" className="py-16 border-b border-[#E5E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7A571A] uppercase tracking-wider">
                <Home className="w-3.5 h-3.5" />
                <span>House Unit Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
                Explore Available Residences
              </h2>
              <p className="text-xs text-[#736E65] font-serif italic mt-1">
                Filter by estate location, layout type, and budget to find your next home.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#736E65]">
                Showing <b>{filteredUnits.length}</b> of <b>{units.length}</b> units
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E0D8] shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              {/* Estate Selector */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Estate / Property</label>
                <select
                  id="filter-estate-select"
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="all">All Estates (Nairobi & Kiambu)</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Layout Type */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">House Layout</label>
                <select
                  id="filter-type-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="all">All Layouts</option>
                  <option value="Bedsitter">Bedsitter</option>
                  <option value="Studio">Studio</option>
                  <option value="1 Bedroom">1 Bedroom</option>
                  <option value="2 Bedroom">2 Bedroom</option>
                  <option value="3 Bedroom">3 Bedroom</option>
                </select>
              </div>

              {/* Search Keywords */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Keywords / Amenities</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8F897D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Balcony, A101, Westlands..."
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Max Rent Range */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-[#1A1A1A]">Max Monthly Rent</label>
                  <span className="font-mono font-bold text-[#7A571A]">
                    {StorageService.formatCurrency(maxRent, settings.currencySymbol)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={70000}
                  step={2000}
                  value={maxRent}
                  onChange={(e) => setMaxRent(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A] cursor-pointer"
                />
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E0D8] text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={vacantOnly}
                  onChange={(e) => setVacantOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1A1A1A] border-[#D8D2C5] focus:ring-0 focus:ring-offset-0"
                />
                <span className="font-medium text-[#1A1A1A]">Show only ready vacant units (Available immediately)</span>
              </label>

              {(selectedPropertyId !== 'all' || selectedType !== 'all' || searchQuery || maxRent < 60000 || !vacantOnly) && (
                <button
                  onClick={() => {
                    setSelectedPropertyId('all');
                    setSelectedType('all');
                    setSearchQuery('');
                    setMaxRent(60000);
                    setVacantOnly(true);
                  }}
                  className="text-[#736E65] hover:text-[#1A1A1A] underline font-medium"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Unit Cards Grid */}
          {filteredUnits.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E0D8] p-12 text-center space-y-3">
              <Home className="w-8 h-8 text-[#8F897D] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">No houses match current filters</h3>
              <p className="text-xs text-[#736E65] font-serif italic max-w-md mx-auto">
                Try raising the maximum rent ceiling or switching the estate selector to see all available spaces.
              </p>
              <button
                onClick={() => {
                  setSelectedPropertyId('all');
                  setSelectedType('all');
                  setVacantOnly(false);
                  setMaxRent(70000);
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1A1A1A] bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg hover:bg-[#EFEAE1]"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnits.map((unit) => {
                const property = properties.find((p) => p.id === unit.propertyId);
                const isVacant = unit.status === 'vacant';

                return (
                  <div
                    key={unit.id}
                    id={`unit-card-${unit.id}`}
                    className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden flex flex-col hover:border-[#1A1A1A]/40 transition-all shadow-2xs group"
                  >
                    {/* Header bar of unit card */}
                    <div className="p-5 border-b border-[#E5E0D8] bg-[#FAF8F5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#736E65]">
                          {property?.name || 'Ngotho Estate'}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                          <span>Unit {unit.unitNumber}</span>
                          <span className="text-xs font-sans font-normal text-[#736E65]">• Floor {unit.floor}</span>
                        </h3>
                      </div>

                      {isVacant ? (
                        <span className="px-2.5 py-1 text-[11px] font-medium bg-[#EBF5EE] text-[#2D6A4F] border border-[#CDE5D6] rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Vacant</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-medium bg-[#FAF8F5] text-[#736E65] border border-[#E5E0D8] rounded-full">
                          Occupied
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 space-y-4 text-xs">
                      
                      {/* Pricing block */}
                      <div className="flex items-baseline justify-between py-2 px-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#736E65] font-semibold">Monthly Rent</p>
                          <p className="text-lg font-serif font-bold text-[#1A1A1A]">
                            {StorageService.formatCurrency(unit.monthlyRent, settings.currencySymbol)}
                            <span className="text-xs font-sans font-normal text-[#736E65]"> / mo</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-[#736E65] font-semibold">Refundable Deposit</p>
                          <p className="font-mono font-medium text-[#1A1A1A]">
                            {StorageService.formatCurrency(unit.depositAmount, settings.currencySymbol)}
                          </p>
                        </div>
                      </div>

                      {/* Location & specs */}
                      <div className="space-y-1.5 text-[#595349]">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#7A571A] shrink-0" />
                          <span>{property?.location} • {property?.address}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-[#3B7A57] shrink-0" />
                          <span>Borehole Water: KSh {unit.waterRatePerUnit}/unit meter</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#7A571A] shrink-0" />
                          <span>Electricity: {unit.electricityType}</span>
                        </p>
                      </div>

                      {/* Features / Amenities */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#736E65] font-semibold mb-1.5">
                          Included Amenities
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {unit.features.map((f, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#4A453E] border border-[#E5E0D8] text-[10px] font-medium"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-[#E5E0D8] bg-white flex items-center gap-2">
                      <button
                        onClick={() => openBookingForUnit(unit)}
                        id={`btn-book-unit-${unit.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] rounded-lg transition-colors border border-[#1A1A1A]"
                      >
                        <Calendar className="w-3 h-3 text-[#E5D7B7]" />
                        <span>Book Viewing</span>
                      </button>

                      <a
                        href={`tel:${property?.contactPhone || '+254700123456'}`}
                        className="p-2 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded-lg border border-[#E5E0D8] transition-colors"
                        title="Call Caretaker"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Signature Estates Showcase Section */}
      <section className="py-16 border-b border-[#E5E0D8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A571A] uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Our Property Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Featured Residential Developments
            </h2>
            <p className="text-xs text-[#736E65] font-serif italic">
              Carefully chosen residential settings balancing urban connectivity, family serenity, and high utility reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((property) => {
              const estateUnits = units.filter((u) => u.propertyId === property.id);
              const vacantEstateUnits = estateUnits.filter((u) => u.status === 'vacant');

              return (
                <div
                  key={property.id}
                  id={`estate-card-${property.id}`}
                  className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] overflow-hidden flex flex-col justify-between shadow-2xs hover:border-[#1A1A1A]/40 transition-all"
                >
                  <div>
                    {/* Estate Image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EFEAE1]">
                      <img
                        src={property.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                        alt={property.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-white/90 backdrop-blur-xs text-[#1A1A1A] border border-[#E5E0D8] shadow-xs">
                          {property.type}
                        </span>
                      </div>
                    </div>

                    {/* Estate Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">{property.name}</h3>
                        <p className="text-xs text-[#736E65] flex items-center gap-1 font-serif italic mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#7A571A]" />
                          {property.address}, {property.location}
                        </p>
                      </div>

                      <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                        {property.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                        <div className="p-2.5 bg-white rounded-lg border border-[#E5E0D8]">
                          <p className="text-[10px] text-[#736E65] font-semibold uppercase tracking-wider">Caretaker on Site</p>
                          <p className="font-medium text-[#1A1A1A] mt-0.5">{property.caretakerName}</p>
                          <p className="font-mono text-[11px] text-[#736E65]">{property.contactPhone}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-[#E5E0D8]">
                          <p className="text-[10px] text-[#736E65] font-semibold uppercase tracking-wider">Rent Paybill</p>
                          <p className="font-mono font-bold text-[#1A1A1A] mt-0.5">522522</p>
                          <p className="font-mono text-[11px] text-[#7A571A]">Acc: {property.accountNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estate Footer */}
                  <div className="p-5 border-t border-[#E5E0D8] bg-white flex items-center justify-between">
                    <span className="text-xs font-mono text-[#736E65]">
                      {vacantEstateUnits.length} of {estateUnits.length} units ready to rent
                    </span>

                    <button
                      onClick={() => {
                        setSelectedPropertyId(property.id);
                        const el = document.getElementById('section-listings');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1A1A] hover:text-[#7A571A] transition-colors"
                    >
                      <span>Filter Units</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Interactive Move-In Cost Estimator */}
      <section className="py-16 border-b border-[#E5E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left explanation */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] text-[#7A571A] font-semibold uppercase tracking-wider">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Upfront Financial Transparency</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                  Calculate Your Exact Move-In Cost
                </h2>

                <p className="text-xs sm:text-sm text-[#615C53] leading-relaxed font-serif">
                  At Ngotho Properties, we don&apos;t believe in surprise lease clauses or hidden administrative levies. 
                  Every prospective tenant receives a full, transparent breakdown of first-month rent, refundable security deposits, 
                  and utility provisions before signing.
                </p>

                {/* Interactive Sliders / Inputs */}
                <div className="space-y-4 pt-2 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-medium text-[#1A1A1A]">Select Monthly Rent Benchmark</label>
                      <span className="font-mono font-bold text-sm text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcRent, settings.currencySymbol)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={12000}
                      max={60000}
                      step={2000}
                      value={calcRent}
                      onChange={(e) => setCalcRent(Number(e.target.value))}
                      className="w-full accent-[#1A1A1A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#736E65] font-mono">
                      <span>KSh 12,000 (Bedsitter)</span>
                      <span>KSh 30,000 (1 Bed)</span>
                      <span>KSh 60,000 (3 Bed)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1">Refundable Water Deposit</label>
                      <input
                        type="number"
                        value={calcWaterDeposit}
                        onChange={(e) => setCalcWaterDeposit(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1">Garbage Maintenance</label>
                      <input
                        type="number"
                        value={calcGarbageFee}
                        onChange={(e) => setCalcGarbageFee(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Output Ticket */}
              <div className="lg:col-span-6">
                <div className="bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] p-6 sm:p-8 space-y-6">
                  <div className="border-b border-[#E5E0D8] pb-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A571A]">
                      Itemized Statement of Move-in
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">
                      Total Initial Capital Needed
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E0D8]/60">
                      <span className="text-[#615C53]">First Month Rent</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcRent, settings.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E0D8]/60">
                      <div>
                        <span className="text-[#615C53]">Security Deposit (100% Refundable)</span>
                        <p className="text-[10px] text-[#736E65] font-serif italic">Returned upon lease conclusion</p>
                      </div>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcRent * calcDepositMonths, settings.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E0D8]/60">
                      <span className="text-[#615C53]">Water Meter Connection Deposit</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcWaterDeposit, settings.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E0D8]/60">
                      <span className="text-[#615C53]">First Month Sanitation & Garbage</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcGarbageFee, settings.currencySymbol)}
                      </span>
                    </div>
                  </div>

                  {/* Grand total */}
                  <div className="pt-3 border-t-2 border-[#1A1A1A] flex justify-between items-baseline">
                    <div>
                      <p className="text-xs font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Total Move-In Sum
                      </p>
                      <p className="text-[11px] text-[#736E65] font-serif italic">Payable directly to M-PESA Paybill 522522</p>
                    </div>
                    <p className="text-2xl font-serif font-bold text-[#1A1A1A]">
                      {StorageService.formatCurrency(
                        calcRent + (calcRent * calcDepositMonths) + calcWaterDeposit + calcGarbageFee,
                        settings.currencySymbol
                      )}
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#section-viewing"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] rounded-lg transition-colors border border-[#1A1A1A]"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#E5D7B7]" />
                      <span>Inquire for a House in this Budget</span>
                    </a>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Resident Experience: 4 Pillars of Ngotho Living */}
      <section className="py-16 border-b border-[#E5E0D8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A571A] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Ngotho Resident Promise</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Why Tenants Stay With Us For Years
            </h2>
            <p className="text-xs sm:text-sm text-[#736E65] font-serif italic">
              We manage every home with the standard of care we would expect for our own families.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#3B7A57]">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Guaranteed Water Supply</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                Every property has dedicated borehole systems, underground reservoirs, and automatic booster pumps. Say goodbye to dry Nairobi mornings.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#7A571A]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Individual Sub-meters</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                Token KPLC meters and independent water dials mean zero shared electric bills or disputed usage. You control exactly what you spend.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Prompt Fundi Dispatch</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                Leaking tap or electrical switch? Our vetted network of plumbers, electricians, and carpenters are dispatched within 24 hours.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#2D6A4F]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Direct M-PESA Paybill</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                Pay rent from your phone in seconds. Automated reconciliation generates instant receipts, keeping your financial record pristine.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Tenant Paybill & Rent Instructions Guide */}
      <section className="py-16 border-b border-[#E5E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A571A] uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Tenant Payment Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Official M-PESA Rent Payment Guide
            </h2>
            <p className="text-xs text-[#736E65] font-serif italic">
              All rent and water payments must be channeled exclusively through the authorized Ngotho paybill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-lg text-[#1A1A1A]">Step 1</span>
                <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs flex items-center justify-center font-bold">1</span>
              </div>
              <h4 className="font-semibold text-sm text-[#1A1A1A]">Lipa na M-PESA</h4>
              <p className="text-xs text-[#615C53] font-serif leading-relaxed">
                Open your M-PESA menu on your phone, select <b>Lipa na M-PESA</b>, then tap <b>Paybill</b>.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-lg text-[#1A1A1A]">Step 2</span>
                <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs flex items-center justify-center font-bold">2</span>
              </div>
              <h4 className="font-semibold text-sm text-[#1A1A1A]">Enter Business & Account</h4>
              <div className="text-xs text-[#615C53] font-serif space-y-1.5 leading-relaxed">
                <p>Business Number: <b className="font-mono text-[#1A1A1A]">522522</b></p>
                <p>Account Number: <b className="font-mono text-[#7A571A]">[ESTATE]-[UNIT]</b></p>
                <p className="text-[11px] text-[#736E65] italic">e.g. NGOTHO-HGT-A101 or NGOTHO-PLM-B02</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-lg text-[#1A1A1A]">Step 3</span>
                <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs flex items-center justify-center font-bold">3</span>
              </div>
              <h4 className="font-semibold text-sm text-[#1A1A1A]">Confirm & Receive Receipt</h4>
              <p className="text-xs text-[#615C53] font-serif leading-relaxed">
                Enter your exact rent amount and M-PESA PIN. You will receive an immediate SMS confirmation followed by our system ledger receipt.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Book a Viewing Interactive Form */}
      <section id="section-viewing" className="py-16 border-b border-[#E5E0D8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A571A] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>On-Site Appointment</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                Schedule a Guided House Tour
              </h2>

              <p className="text-xs sm:text-sm text-[#615C53] leading-relaxed font-serif">
                Physical property viewings are hosted Monday through Saturday by our resident caretakers. 
                Fill out the appointment request and we will confirm within 2 business hours.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <Phone className="w-4 h-4 text-[#7A571A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Direct Caretaker Hotline</p>
                    <p className="font-mono text-[#736E65]">+254 700 123 456 / +254 712 345 678</p>
                    <p className="text-[11px] text-[#736E65] font-serif italic">Available Mon - Sat, 8:00 AM - 5:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <MapPin className="w-4 h-4 text-[#7A571A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Central Management Office</p>
                    <p className="text-[#736E65]">Ngotho Tower, 4th Floor, Westlands, Nairobi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Booking Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#E5E0D8] shadow-2xs">
                
                {bookingSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#EBF5EE] text-[#2D6A4F] border border-[#CDE5D6] flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">Viewing Request Received!</h3>
                    <p className="text-xs text-[#615C53] font-serif italic max-w-md mx-auto">
                      Thank you! The site caretaker has been notified. We will phone you directly to confirm gate access and directions.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBookingSuccess(false)}
                      className="mt-3 px-4 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF8F5]"
                    >
                      Book Another Viewing
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                    
                    {selectedUnitForBooking && (
                      <div className="p-3 bg-white rounded-lg border border-[#E5E0D8] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#736E65] uppercase tracking-wider font-semibold">Selected Unit</span>
                          <p className="font-serif font-bold text-[#1A1A1A]">Unit {selectedUnitForBooking.unitNumber} ({selectedUnitForBooking.type})</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedUnitForBooking(null)}
                          className="text-xs text-[#736E65] hover:text-[#1A1A1A] underline"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">Estate of Interest</label>
                        <select
                          value={bookingEstateId}
                          onChange={(e) => setBookingEstateId(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        >
                          {properties.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} ({p.location})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">Specific Unit (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. A101 or 1 Bedroom"
                          value={bookingUnitNumber}
                          onChange={(e) => setBookingUnitNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">Your Full Name</label>
                        <input
                          id="booking-name-input"
                          type="text"
                          required
                          placeholder="e.g. Daniel Kiprono"
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">Phone (SMS / WhatsApp)</label>
                        <input
                          id="booking-phone-input"
                          type="tel"
                          required
                          placeholder="+254 7..."
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">Preferred Viewing Date</label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">Preferred Time Window</label>
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        >
                          <option value="9:00 AM - 11:00 AM">Morning (9:00 AM - 11:00 AM)</option>
                          <option value="11:00 AM - 1:00 PM">Midday (11:00 AM - 1:00 PM)</option>
                          <option value="2:00 PM - 4:00 PM">Afternoon (2:00 PM - 4:00 PM)</option>
                          <option value="4:00 PM - 5:30 PM">Late Afternoon (4:00 PM - 5:30 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1">Special Notes / Moving Date</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Looking to move end of this month, require parking for 1 car..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>

                    <button
                      type="submit"
                      id="btn-submit-viewing"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors border border-[#1A1A1A] shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#E5D7B7]" />
                      <span>Confirm Viewing Appointment</span>
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Resident Testimonials */}
      <section className="py-16 border-b border-[#E5E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A571A] uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Resident Community</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Voices from Ngotho Estates
            </h2>
            <p className="text-xs text-[#736E65] font-serif italic">
              Real accounts from families and professionals living across our properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-white rounded-xl border border-[#E5E0D8] space-y-4">
              <p className="text-xs text-[#595349] leading-relaxed font-serif italic">
                &ldquo;Water was my biggest headache in previous Nairobi apartments. At Ngotho Heights, the borehole is completely automated. I haven&apos;t had a single dry morning in 2 years.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E5E0D8] text-xs">
                <p className="font-serif font-bold text-[#1A1A1A]">David Karanja</p>
                <p className="text-[11px] text-[#736E65]">Resident at Ngotho Heights, Westlands</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E5E0D8] space-y-4">
              <p className="text-xs text-[#595349] leading-relaxed font-serif italic">
                &ldquo;The M-PESA paybill receipts are instant, and John the caretaker is very responsive. Whenever there&apos;s a plumbing fix needed, the fundi arrives the same afternoon.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E5E0D8] text-xs">
                <p className="font-serif font-bold text-[#1A1A1A]">Sarah Achieng</p>
                <p className="text-[11px] text-[#736E65]">Resident at Ngotho Palms Court, Ruiru</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E5E0D8] space-y-4">
              <p className="text-xs text-[#595349] leading-relaxed font-serif italic">
                &ldquo;Clean perimeter wall, good security, and honest water meter billing. No fabricated utility bills at the end of the month. Highly recommended management.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E5E0D8] text-xs">
                <p className="font-serif font-bold text-[#1A1A1A]">Brian Mwenda</p>
                <p className="text-[11px] text-[#736E65]">Resident at Ngotho Executive Suites, Kilimani</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#FAF8F5] py-14 text-xs text-[#615C53]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif font-bold text-base border border-[#2D2A26]">
                  <span className="text-[#E5D7B7]">N</span>
                </div>
                <div>
                  <span className="text-lg font-serif font-bold text-[#1A1A1A] tracking-tight">ngotho</span>
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest bg-[#EFEAE1] text-[#4F4B43] border border-[#DCD5C8] rounded-full">
                    Properties
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#736E65] font-serif leading-relaxed max-w-sm">
                Ngotho Real Estate & Property Management Ltd manages premium residential courts, modern apartment complexes, and gated suites across Nairobi, Kiambu, and Nakuru.
              </p>

              <div className="pt-1 text-[11px] text-[#736E65] space-y-1 font-mono">
                <p>Corporate Paybill: 522522</p>
                <p>Registration: CPR/2021/89421 • Kenya Real Estate Board</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-[#1A1A1A] text-sm">Quick Links</h4>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#section-listings" className="hover:text-[#1A1A1A]">Available Houses</a></li>
                <li><a href="#section-viewing" className="hover:text-[#1A1A1A]">Book a Viewing Tour</a></li>
                <li><a href="#section-listings" className="hover:text-[#1A1A1A]">Rent & Move-in Calculator</a></li>
                <li>
                  <button onClick={onOpenManagementPortal} className="hover:text-[#1A1A1A] font-semibold text-[#7A571A]">
                    Landlord & Staff Console →
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-[#1A1A1A] text-sm">Head Office</h4>
              <p className="text-xs leading-relaxed font-serif">
                Ngotho Tower, 4th Floor<br />
                Muthithi Road, Westlands<br />
                Nairobi, Kenya
              </p>
              <p className="font-mono text-xs pt-1">Tel: +254 700 123 456</p>
              <p className="text-xs">info@ngothomanagement.co.ke</p>
            </div>

          </div>

          <div className="pt-8 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A8477]">
            <p>© {new Date().getFullYear()} Ngotho Real Estate & Property Management Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Equal Housing Opportunity</span>
              <span>•</span>
              <button onClick={onOpenManagementPortal} className="hover:text-[#1A1A1A] font-medium underline">
                Access Internal Management Portal
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
