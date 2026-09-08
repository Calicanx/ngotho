import React, { useState, useMemo, useEffect } from 'react';
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
  const [maxRent, setMaxRent] = useState<number>(100000);
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

  // On first open, always show the "How to Pay Your Rent with M-PESA" section
  useEffect(() => {
    const el = document.getElementById('section-paybill');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

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

  // Featured estate for the hero card (prefer a Westlands, Nairobi estate)
  const featuredProperty = properties.find((p) => p.location.toLowerCase().includes('westlands')) || properties[0];

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
            <span className="font-medium text-[#1A1A1A]">Houses Available Now:</span>
            <span className="font-serif italic">In Nairobi, Nakuru, Mombasa, Kisumu, Eldoret, Thika & many more towns.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:+254732075012" className="hover:text-[#1A1A1A] flex items-center gap-1 font-mono transition-colors">
              <Phone className="w-3 h-3 text-[#7A571A]" />
              <span>0732 075 012</span>
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
                <span className="font-medium uppercase tracking-wider text-[#1A1A1A]">Ngotho Houses</span>
                <span>•</span>
                <span className="font-serif italic">Nairobi & Beyond</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-[1.15]">
                Find a good, safe house <br />
                <span className="font-normal italic text-[#4A453E]">to call your home.</span>
              </h1>

              <p className="text-base text-[#615C53] leading-relaxed max-w-2xl font-serif">
                We rent out good houses in Nairobi, Nakuru, Mombasa, Kisumu and Thika.
                You get water all day, your own electricity meter, and an instant M-PESA
                receipt every time you pay rent. If something breaks, our fundi comes quickly.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#section-listings"
                  id="btn-hero-explore-units"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors shadow-xs border border-[#1A1A1A]"
                >
                  <Search className="w-3.5 h-3.5 text-[#E5D7B7]" />
                  <span>See the Houses</span>
                </a>

                <a
                  href="#section-viewing"
                  id="btn-hero-book-viewing"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#EFEAE1] rounded-lg transition-colors border border-[#E5E0D8]"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#7A571A]" />
                  <span>Book a Viewing</span>
                </a>

                <button
                  onClick={onOpenManagementPortal}
                  id="btn-hero-mgmt-portal"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-medium text-[#736E65] hover:text-[#1A1A1A] transition-colors"
                >
                  <span>Landlord Sign In</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7A571A]" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E5E0D8]/80 text-xs">
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">{properties.length} Estates</p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Across Kenya</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">
                    {units.filter((u) => u.status === 'vacant').length} Vacancies
                  </p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Ready to Move In</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">M-PESA</p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Instant Rent Receipts</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#1A1A1A]">24/7</p>
                  <p className="text-[11px] text-[#736E65] font-serif italic">Caretakers on Site</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-lg">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E0D8] bg-[#FAF8F5]">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
                    alt="Apartments for rent in Nairobi"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="px-2.5 py-0.5 w-fit rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md text-[#FAF8F5] border border-white/30 mb-1.5">
                      Popular in Westlands
                    </span>
                    <h3 className="text-xl font-serif font-bold">{featuredProperty?.name || 'Western Heights Apartments'}</h3>
                    <p className="text-xs text-[#E5E0D8] flex items-center gap-1 font-serif italic">
                      <MapPin className="w-3.5 h-3.5 text-[#E5D7B7]" />
                      {featuredProperty?.location || 'Westlands, Nairobi'}
                    </p>
                  </div>
                </div>

                {/* Micro preview strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8]">
                    <p className="text-[10px] text-[#736E65] uppercase tracking-wider font-semibold">Rent From</p>
                    <p className="font-serif font-bold text-[#1A1A1A] mt-0.5">
                      {featuredProperty ? StorageService.formatCurrency((units.find((u) => u.propertyId === featuredProperty.id && u.status === 'vacant') || units.find((u) => u.propertyId === featuredProperty.id) || { monthlyRent: 0 }).monthlyRent, settings.currencySymbol) : 'KSh 24,000'}
                    </p>
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
                <span>Houses for Rent</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
                See the Houses that are Available
              </h2>
              <p className="text-xs text-[#736E65] font-serif italic mt-1">
                Filter by area, house size and budget to find your next home.
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
                <label className="block font-medium text-[#1A1A1A] mb-1">Estate / Area</label>
                <select
                  id="filter-estate-select"
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="all">All Areas</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Layout Type */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">House Size</label>
                <select
                  id="filter-layout-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="all">All Sizes</option>
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
                  <label className="font-medium text-[#1A1A1A]">Monthly Rent Up To</label>
                  <span className="font-mono font-bold text-[#7A571A]">
                    {StorageService.formatCurrency(maxRent, settings.currencySymbol)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={100000}
                  step={5000}
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
                <span className="font-medium text-[#1A1A1A]">Show only houses that are ready now</span>
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
                  setMaxRent(100000);
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
                          <span>Borehole Water: KSh {unit.waterRatePerUnit}/unit</span>
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
                        href={`tel:${property?.contactPhone || '0732075012'}`}
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
              <span>Our Houses</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Our Houses in the Different Towns
            </h2>
            <p className="text-xs text-[#736E65] font-serif italic">
              We have picked good houses that are close to town, calm for the family, and with water and power that
              work all the time.
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
                          <p className="font-mono font-bold text-[#1A1A1A] mt-0.5">{settings.paybillNumber}</p>
                          <p className="font-mono text-[11px] text-[#7A571A] break-all">Acc: {settings.paybillAccountNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estate Footer */}
                  <div className="p-5 border-t border-[#E5E0D8] bg-white flex items-center justify-between">
                    <span className="text-xs font-mono text-[#736E65]">
                      {vacantEstateUnits.length} of {estateUnits.length} houses ready now
                    </span>

                    <button
                      onClick={() => {
                        setSelectedPropertyId(property.id);
                        const el = document.getElementById('section-listings');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1A1A] hover:text-[#7A571A] transition-colors"
                    >
                      <span>See Houses Here</span>
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
                  <span>Upfront Costs, Made Clear</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                  See How Much Money You Need to Move In
                </h2>

                <p className="text-xs sm:text-sm text-[#615C53] leading-relaxed font-serif">
                  We do not hide charges. Before you move in, we show you clearly the first month
                  rent, the refundable deposit, and the small water and garbage fees. Move the
                  slider below to see what you will pay.
                </p>

                {/* Interactive Sliders / Inputs */}
                <div className="space-y-4 pt-2 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-medium text-[#1A1A1A]">Select Your Monthly Rent</label>
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
                      <label className="block font-medium text-[#1A1A1A] mb-1">Water Connection Deposit</label>
                      <input
                        type="number"
                        value={calcWaterDeposit}
                        onChange={(e) => setCalcWaterDeposit(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1">Garbage Collection Fee</label>
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
                      Itemized Move-in Costs
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">
                      Total Money You Need to Move In
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
                        <span className="text-[#615C53]">Security Deposit (Refundable)</span>
                        <p className="text-[10px] text-[#736E65] font-serif italic">You get this back when you leave</p>
                      </div>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcRent * calcDepositMonths, settings.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E0D8]/60">
                      <span className="text-[#615C53]">Water Connection Deposit</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcWaterDeposit, settings.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E0D8]/60">
                      <span className="text-[#615C53]">First Month Garbage Collection</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {StorageService.formatCurrency(calcGarbageFee, settings.currencySymbol)}
                      </span>
                    </div>
                  </div>

                  {/* Grand total */}
                  <div className="pt-3 border-t-2 border-[#1A1A1A] flex justify-between items-baseline">
                    <div>
                      <p className="text-xs font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Total to Pay
                      </p>
                      <p className="text-[11px] text-[#736E65] font-serif italic">
                        Paid to M-PESA Paybill {settings.paybillNumber}, Account {settings.paybillAccountNumber}
                      </p>
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
                      <span>Ask About a House in This Budget</span>
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
              <span>Our Promise to You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Why People Like Living in Our Houses
            </h2>
            <p className="text-xs sm:text-sm text-[#736E65] font-serif italic">
              We take care of every house the way we would take care of our own home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#3B7A57]">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Water That Always Flows</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                Every house has its own borehole tank and pump. You will not wake up in the morning
                and find there is no water to cook or shower with.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#7A571A]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Your Own Water & Power Meters</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                Every house has its own power and water meter. You only pay for what you use, and
                there is no quarrel over sharing bills with neighbours.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Quick Repairs (Fundi)</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                A leaking tap or a broken switch? We send our plumber or electrician within 24 hours
                to sort it out for you.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#2D6A4F]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Pay Rent with M-PESA</h3>
              <p className="text-xs text-[#615C53] leading-relaxed font-serif">
                You pay your rent from your phone in seconds. Right away you get an instant receipt,
                so you always have proof that you paid.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Tenant Paybill & Rent Instructions Guide */}
      <section id="section-paybill" className="py-16 border-b border-[#E5E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A571A] uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5" />
              <span>How to Pay Rent</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              How to Pay Your Rent with M-PESA
            </h2>
            <p className="text-xs text-[#736E65] font-serif italic">
              Please pay all your rent through this one M-PESA number so that we record it well.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* M-PESA visual illustration of exact payment details */}
            <div className="bg-[#1A1A1A] rounded-xl border border-[#2E2B27] p-6 text-[#F9F7F2] md:row-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base font-bold tracking-tight">M-PESA</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest bg-[#E5D7B7] text-[#46350E]">Official Payment</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2E2A25] border border-[#423C34]">
                  <span className="text-[#A39E92]">Lipa na M-PESA</span>
                  <span className="font-semibold">Pay Bill</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2E2A25] border border-[#423C34]">
                  <span className="text-[#A39E92]">Business No.</span>
                  <span className="font-mono font-bold text-[#E5D7B7]">{settings.paybillNumber}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2E2A25] border border-[#423C34]">
                  <span className="text-[#A39E92]">Account No.</span>
                  <span className="font-mono font-bold text-[#E5D7B7] break-all">{settings.paybillAccountNumber}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2E2A25] border border-[#423C34]">
                  <span className="text-[#A39E92]">Amount</span>
                  <span className="font-semibold">Your monthly rent</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#115E3A] border border-[#1A7A4F]">
                  <span className="text-[#BFE8D1]">Enter M-PESA PIN</span>
                  <CheckCircle2 className="w-4 h-4 text-[#BFE8D1]" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#115E3A] border border-[#1A7A4F]">
                  <span className="text-[#BFE8D1]">Receive SMS receipt</span>
                  <Check className="w-4 h-4 text-[#BFE8D1]" />
                </div>
              </div>
              <p className="text-[11px] text-[#B5AFA4] mt-4 leading-relaxed font-serif italic">
                Copy the two numbers exactly, then enter your rent amount and confirm with your PIN.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-lg text-[#1A1A1A]">Step 1</span>
                <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs flex items-center justify-center font-bold">1</span>
              </div>
              <h4 className="font-semibold text-sm text-[#1A1A1A]">Lipa na M-PESA</h4>
              <p className="text-xs text-[#615C53] font-serif leading-relaxed">
                Open your M-PESA menu on your phone, select <b>Lipa na M-PESA</b>, then tap <b>Pay Bill</b>.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-lg text-[#1A1A1A]">Step 2</span>
                <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs flex items-center justify-center font-bold">2</span>
              </div>
              <h4 className="font-semibold text-sm text-[#1A1A1A]">Enter Business & Account No.</h4>
              <div className="text-xs text-[#615C53] font-serif space-y-1.5 leading-relaxed">
                <p>Business Number: <b className="font-mono text-[#1A1A1A]">{settings.paybillNumber}</b></p>
                <p>Account Number: <b className="font-mono break-all text-[#7A571A]">{settings.paybillAccountNumber}</b></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-lg text-[#1A1A1A]">Step 3</span>
                <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs flex items-center justify-center font-bold">3</span>
              </div>
              <h4 className="font-semibold text-sm text-[#1A1A1A]">Finish and Get Your Receipt</h4>
              <p className="text-xs text-[#615C53] font-serif leading-relaxed">
                Enter your rent amount and your M-PESA PIN. You will get an SMS right away, then an
                official receipt from us.
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
                <span>On-Site Visit</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                Come and See the House
              </h2>

              <p className="text-xs sm:text-sm text-[#615C53] leading-relaxed font-serif">
                You are welcome to come view any house from Monday to Saturday. Our caretakers
                on site will show you around. Fill in the form below and we will get back to
                you within 2 hours of working time.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <Phone className="w-4 h-4 text-[#7A571A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Call or SMS the Caretaker</p>
                    <p className="font-mono text-[#736E65]">0732 075 012</p>
                    <p className="text-[11px] text-[#736E65] font-serif italic">Open Mon - Sat, 8:00 AM - 5:30 PM</p>
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
                    <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">Your Visit Has Been Booked!</h3>
                    <p className="text-xs text-[#615C53] font-serif italic max-w-md mx-auto">
                      Thank you! The caretaker has been told. We will call you to confirm the day,
                      the time and directions to the house.
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
              <span>What Tenants Say</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              What Our Tenants Say
            </h2>
            <p className="text-xs text-[#736E65] font-serif italic">
              Stories from people who live in our houses today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-white rounded-xl border border-[#E5E0D8] space-y-4">
              <p className="text-xs text-[#595349] leading-relaxed font-serif italic">
                &ldquo;Water used to be a big problem in the houses I lived in before. Here at Sunalia
                Gardens the water never stops. I have not had one dry morning in two years.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E5E0D8] text-xs">
                <p className="font-serif font-bold text-[#1A1A1A]">David Karanja</p>
                <p className="text-[11px] text-[#736E65]">Tenant at Sunalia Gardens, Roysambu</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E5E0D8] space-y-4">
              <p className="text-xs text-[#595349] leading-relaxed font-serif italic">
                &ldquo;The receipt comes to my phone the moment I pay, and the caretaker answers quickly.
                When the pipe leaked, the fundi came the same afternoon and fixed it.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E5E0D8] text-xs">
                <p className="font-serif font-bold text-[#1A1A1A]">Sarah Achieng</p>
                <p className="text-[11px] text-[#736E65]">Tenant at Cascade Apartments, Kilimani</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E5E0D8] space-y-4">
              <p className="text-xs text-[#595349] leading-relaxed font-serif italic">
                &ldquo;The place is safe and the water meter is fair — I only pay for what I use.
                No surprise bills at the end of the month. I really recommend these houses.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E5E0D8] text-xs">
                <p className="font-serif font-bold text-[#1A1A1A]">Brian Mwenda</p>
                <p className="text-[11px] text-[#736E65]">Tenant at Gem Court Residences, South B</p>
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
                Ngotho Properties rents out good, safe houses in Nairobi, Nakuru, Mombasa, Kisumu and
                Thika. We run every house with a caretaker on site, clean water, and fair M-PESA rent
                receipts.
              </p>

              <div className="pt-1 text-[11px] text-[#736E65] space-y-1 font-mono">
                <p>Paybill for Rent: {settings.paybillNumber}</p>
                <p className="break-all">Account No: {settings.paybillAccountNumber}</p>
                <p>Registration: CPR/2021/89421 • Kenya Real Estate Board</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-[#1A1A1A] text-sm">Quick Links</h4>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#section-listings" className="hover:text-[#1A1A1A]">Available Houses</a></li>
                <li><a href="#section-viewing" className="hover:text-[#1A1A1A]">Book a Visit</a></li>
                <li><a href="#section-listings" className="hover:text-[#1A1A1A]">Move-in Cost Calculator</a></li>
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
              <p className="font-mono text-xs pt-1">Tel: 0732 075 012</p>
              <p className="text-xs">info@ngothomanagement.co.ke</p>
            </div>

          </div>

          <div className="pt-8 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A8477]">
            <p className="font-serif italic leading-relaxed">
              © {new Date().getFullYear()} Ngotho Real Estate & Property Management Ltd. Rates, deposits and
              house availability can change, so please confirm with us before paying. All houses are open to
              all Kenyans — we do not discriminate on tribe, religion or gender.
            </p>
            <div className="flex items-center gap-4 shrink-0">
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
