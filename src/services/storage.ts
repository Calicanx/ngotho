import {
  Property,
  Unit,
  Tenant,
  Payment,
  MaintenanceRequest,
  UtilityReading,
  AppNotification
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_PAYMENTS,
  INITIAL_MAINTENANCE,
  INITIAL_UTILITIES,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  PROPERTIES: 'ngotho_properties_v1',
  UNITS: 'ngotho_units_v1',
  TENANTS: 'ngotho_tenants_v1',
  PAYMENTS: 'ngotho_payments_v1',
  MAINTENANCE: 'ngotho_maintenance_v1',
  UTILITIES: 'ngotho_utilities_v1',
  NOTIFICATIONS: 'ngotho_notifications_v1',
  SETTINGS: 'ngotho_settings_v1',
};

export interface AppSettings {
  currencySymbol: string;
  currencyCode: string;
  landlordCompanyName: string;
  landlordPhone: string;
  landlordEmail: string;
  landlordAddress: string;
  paybillNumber: string;
  rentDueDay: number; // e.g. 5th of the month
  lateFeePercent: number; // e.g. 5%
}

export const DEFAULT_SETTINGS: AppSettings = {
  currencySymbol: 'KSh',
  currencyCode: 'KES',
  landlordCompanyName: 'Ngotho Real Estate & Property Management Ltd',
  landlordPhone: '+254 700 123 456',
  landlordEmail: 'info@ngothomanagement.co.ke',
  landlordAddress: 'Ngotho Tower, 4th Floor, Westlands, Nairobi, Kenya',
  paybillNumber: '522522',
  rentDueDay: 5,
  lateFeePercent: 5,
};

export class StorageService {
  static getProperties(): Property[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      return data ? JSON.parse(data) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  }

  static saveProperties(data: Property[]): void {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(data));
  }

  static getUnits(): Unit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNITS);
      return data ? JSON.parse(data) : INITIAL_UNITS;
    } catch {
      return INITIAL_UNITS;
    }
  }

  static saveUnits(data: Unit[]): void {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(data));
  }

  static getTenants(): Tenant[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TENANTS);
      return data ? JSON.parse(data) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  }

  static saveTenants(data: Tenant[]): void {
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(data));
  }

  static getPayments(): Payment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  }

  static savePayments(data: Payment[]): void {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(data));
  }

  static getMaintenance(): MaintenanceRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      return data ? JSON.parse(data) : INITIAL_MAINTENANCE;
    } catch {
      return INITIAL_MAINTENANCE;
    }
  }

  static saveMaintenance(data: MaintenanceRequest[]): void {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(data));
  }

  static getUtilities(): UtilityReading[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UTILITIES);
      return data ? JSON.parse(data) : INITIAL_UTILITIES;
    } catch {
      return INITIAL_UTILITIES;
    }
  }

  static saveUtilities(data: UtilityReading[]): void {
    localStorage.setItem(STORAGE_KEYS.UTILITIES, JSON.stringify(data));
  }

  static getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static saveNotifications(data: AppNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data));
  }

  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(data: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.TENANTS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.UTILITIES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }

  static exportAllData(): string {
    const data = {
      properties: this.getProperties(),
      units: this.getUnits(),
      tenants: this.getTenants(),
      payments: this.getPayments(),
      maintenance: this.getMaintenance(),
      utilities: this.getUtilities(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      appName: 'Ngotho Rental Houses Management',
    };
    return JSON.stringify(data, null, 2);
  }

  static importAllData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.properties)) this.saveProperties(data.properties);
      if (Array.isArray(data.units)) this.saveUnits(data.units);
      if (Array.isArray(data.tenants)) this.saveTenants(data.tenants);
      if (Array.isArray(data.payments)) this.savePayments(data.payments);
      if (Array.isArray(data.maintenance)) this.saveMaintenance(data.maintenance);
      if (Array.isArray(data.utilities)) this.saveUtilities(data.utilities);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  static generateReceiptNumber(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    return `NGT-${year}-${random}`;
  }

  static generateTicketCode(): string {
    const random = Math.floor(100 + Math.random() * 900);
    return `MNT-${random}`;
  }

  static formatCurrency(amount: number, symbol = 'KSh'): string {
    return `${symbol} ${Number(amount || 0).toLocaleString('en-US')}`;
  }
}
