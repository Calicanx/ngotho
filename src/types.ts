export type PropertyType = 
  | 'Apartment Building' 
  | 'Residential Court' 
  | 'Gated Estate' 
  | 'Bedsitter Complex' 
  | 'Commercial & Residential';

export type UnitType = 
  | 'Bedsitter' 
  | 'Studio' 
  | '1 Bedroom' 
  | '2 Bedroom' 
  | '3 Bedroom' 
  | '4 Bedroom' 
  | 'Commercial Shop';

export type UnitStatus = 'occupied' | 'vacant' | 'maintenance' | 'reserved';

export type TenantStatus = 'active' | 'notice' | 'vacated';

export type PaymentMethod = 'M-Pesa' | 'Bank Transfer' | 'Cash' | 'Cheque' | 'Card';

export type PaymentType = 'Rent' | 'Deposit' | 'Water' | 'Electricity' | 'Garbage' | 'Combined';

export type MaintenanceCategory = 
  | 'Plumbing' 
  | 'Electrical' 
  | 'Roof & Ceiling' 
  | 'Carpentry & Doors' 
  | 'Painting' 
  | 'Security & Locks' 
  | 'Other';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export type MaintenanceStatus = 'reported' | 'in_progress' | 'completed' | 'cancelled';

export interface Property {
  id: string;
  name: string;
  location: string;
  address: string;
  type: PropertyType;
  description: string;
  caretakerName: string;
  contactPhone: string;
  bankDetails?: string;
  paybillNumber?: string;
  accountNumber?: string;
  imageUrl?: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;
  type: UnitType;
  monthlyRent: number;
  depositAmount: number;
  garbageFee: number;
  waterRatePerUnit: number;
  electricityType: 'Token / Pre-paid' | 'Post-paid Meter';
  status: UnitStatus;
  currentTenantId?: string;
  features: string[];
  waterMeterLastReading: number;
}

export interface Tenant {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  nationalId: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  propertyId: string;
  unitId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentAmount: number;
  depositPaid: number;
  balance: number; // positive = owes money, negative = overpayment credit
  status: TenantStatus;
  notes?: string;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  amount: number;
  paymentDate: string;
  forMonth: string; // e.g. "September 2026"
  paymentMethod: PaymentMethod;
  referenceCode: string;
  paymentType: PaymentType;
  notes?: string;
  recordedBy: string;
}

export interface MaintenanceRequest {
  id: string;
  ticketCode: string;
  propertyId: string;
  unitId: string;
  tenantId?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  reportedDate: string;
  resolvedDate?: string;
  assignedTechnician?: string;
  technicianPhone?: string;
  estimatedCost?: number;
  actualCost?: number;
}

export interface UtilityReading {
  id: string;
  unitId: string;
  propertyId: string;
  month: string;
  previousWaterReading: number;
  currentWaterReading: number;
  waterUnitsUsed: number;
  waterCost: number;
  billedDate: string;
  isPaid: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'payment' | 'maintenance' | 'lease' | 'unit';
  read: boolean;
  linkTab?: string;
}
