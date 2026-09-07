import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { X, Building, MapPin, Phone, User, Landmark } from 'lucide-react';

interface AddPropertyModalProps {
  existingProperty?: Property;
  onSaveProperty: (property: Property) => void;
  onClose: () => void;
}

const PROPERTY_TYPES: PropertyType[] = [
  'Apartment Building',
  'Residential Court',
  'Gated Estate',
  'Bedsitter Complex',
  'Commercial & Residential',
];

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  existingProperty,
  onSaveProperty,
  onClose,
}) => {
  const [name, setName] = useState(existingProperty?.name || '');
  const [location, setLocation] = useState(existingProperty?.location || '');
  const [address, setAddress] = useState(existingProperty?.address || '');
  const [type, setType] = useState<PropertyType>(existingProperty?.type || 'Apartment Building');
  const [description, setDescription] = useState(existingProperty?.description || '');
  const [caretakerName, setCaretakerName] = useState(existingProperty?.caretakerName || '');
  const [contactPhone, setContactPhone] = useState(existingProperty?.contactPhone || '+254 ');
  const [bankDetails, setBankDetails] = useState(existingProperty?.bankDetails || '');
  const [paybillNumber, setPaybillNumber] = useState(existingProperty?.paybillNumber || '522522');
  const [accountNumber, setAccountNumber] = useState(
    existingProperty?.accountNumber || `NGOTHO-${Math.floor(100 + Math.random() * 900)}`
  );
  const [imageUrl, setImageUrl] = useState(
    existingProperty?.imageUrl ||
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    const property: Property = {
      id: existingProperty?.id || `prop-${Date.now()}`,
      name: name.trim(),
      location: location.trim(),
      address: address.trim(),
      type,
      description: description.trim(),
      caretakerName: caretakerName.trim(),
      contactPhone: contactPhone.trim(),
      bankDetails: bankDetails.trim(),
      paybillNumber: paybillNumber.trim(),
      accountNumber: accountNumber.trim(),
      imageUrl: imageUrl.trim(),
    };

    onSaveProperty(property);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="add-property-modal"
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E5E0D8] overflow-hidden my-6"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF8F5] border border-[#E5E0D8] text-[#7A571A] rounded-lg">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">
                {existingProperty ? 'Edit Property / Estate' : 'Add New Property / Estate'}
              </h3>
              <p className="text-xs text-[#736E65] font-serif italic">Ngotho Portfolio & Building Profile</p>
            </div>
          </div>
          <button
            id="btn-close-property-modal"
            onClick={onClose}
            className="p-1.5 text-[#736E65] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Property Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Property / Estate Name</label>
              <input
                id="input-property-name"
                type="text"
                placeholder="e.g. Ngotho Ridge Court"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-serif font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Building / Estate Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Area / City / Town</label>
              <input
                type="text"
                placeholder="e.g. Westlands, Nairobi or Ruiru, Kiambu"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Street / Physical Address</label>
              <input
                type="text"
                placeholder="e.g. Plot 42, Off Ring Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Caretaker & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Caretaker / Site Manager</label>
              <input
                type="text"
                placeholder="e.g. John Mwangi"
                value={caretakerName}
                onChange={(e) => setCaretakerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Caretaker Contact Phone</label>
              <input
                type="text"
                placeholder="+254 7..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Payment Collection Channels */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#E5E0D8] space-y-3">
            <h4 className="font-serif font-bold text-[#1A1A1A] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#736E65]" />
              Designated Rent Collection Account
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Paybill / Till Number</label>
                <input
                  type="text"
                  placeholder="e.g. 522522 or 247247"
                  value={paybillNumber}
                  onChange={(e) => setPaybillNumber(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Account Prefix / Number</label>
                <input
                  type="text"
                  placeholder="e.g. NGOTHO-HGT"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-1">Bank Name & Account No.</label>
              <input
                type="text"
                placeholder="e.g. Equity Bank - Acc: 0140293847291"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Description & Image */}
          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">Description & Amenities</label>
            <textarea
              rows={2}
              placeholder="e.g. Gated complex with perimeter wall, borehole, solar lighting, CCTV..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">Building Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
            <button
              type="button"
              id="btn-cancel-property"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#615C53] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-property"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2E2A26] active:bg-black rounded-lg transition-colors shadow-2xs border border-[#1A1A1A]"
            >
              {existingProperty ? 'Update Property' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
