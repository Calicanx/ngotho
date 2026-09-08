/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Property, 
  Unit, 
  Tenant, 
  Payment, 
  MaintenanceRequest, 
  UtilityReading, 
  AppNotification, 
  MaintenanceStatus 
} from './types';
import { StorageService, AppSettings, DEFAULT_SETTINGS } from './services/storage';

// Components
import { Header } from './components/Header';
import { LandingPageView } from './components/LandingPageView';
import { DashboardView } from './components/DashboardView';
import { PropertiesView } from './components/PropertiesView';
import { TenantsView } from './components/TenantsView';
import { PaymentsView } from './components/PaymentsView';
import { MaintenanceView } from './components/MaintenanceView';
import { UtilitiesView } from './components/UtilitiesView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { SignInView } from './components/SignInView';
import { TenantPortalView } from './components/TenantPortalView';

// Modals
import { ReceiptModal } from './components/ReceiptModal';
import { NoticeModal } from './components/NoticeModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { AddTenantModal } from './components/AddTenantModal';
import { AddUnitModal } from './components/AddUnitModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AddMaintenanceModal } from './components/AddMaintenanceModal';

// Icons
import { 
  Globe,
  LayoutDashboard, 
  Building2, 
  Users, 
  Receipt, 
  Wrench, 
  Droplets, 
  BarChart3, 
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';

const LANDLORD_PHONE = '0700000000';

interface AuthState {
  role: 'landlord' | 'tenant';
  phone: string;
}

// Normalize a Kenyan phone number into a canonical form for comparison
function normalizePhone(phone: string): string {
  let p = phone.replace(/[\s-]/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('254')) p = '0' + p.slice(3);
  return p;
}

export default function App() {
  // State from Storage
  const [properties, setProperties] = useState<Property[]>(() => StorageService.getProperties());
  const [units, setUnits] = useState<Unit[]>(() => StorageService.getUnits());
  const [tenants, setTenants] = useState<Tenant[]>(() => StorageService.getTenants());
  const [payments, setPayments] = useState<Payment[]>(() => StorageService.getPayments());
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => StorageService.getMaintenance());
  const [utilities, setUtilities] = useState<UtilityReading[]>(() => StorageService.getUtilities());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => StorageService.getNotifications());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());

  // Authentication
  const [auth, setAuth] = useState<AuthState | null>(() => StorageService.getAuth());
  const [showSignIn, setShowSignIn] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Modal states
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<Payment | null>(null);
  const [activeNoticeTenant, setActiveNoticeTenant] = useState<Tenant | null>(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [preselectedPaymentTenantId, setPreselectedPaymentTenantId] = useState<string | undefined>(undefined);

  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | undefined>(undefined);

  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | undefined>(undefined);
  const [defaultUnitPropertyId, setDefaultUnitPropertyId] = useState<string | undefined>(undefined);

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);

  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRequest | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    StorageService.saveProperties(properties);
  }, [properties]);

  useEffect(() => {
    StorageService.saveUnits(units);
  }, [units]);

  useEffect(() => {
    StorageService.saveTenants(tenants);
  }, [tenants]);

  useEffect(() => {
    StorageService.savePayments(payments);
  }, [payments]);

  useEffect(() => {
    StorageService.saveMaintenance(maintenance);
  }, [maintenance]);

  useEffect(() => {
    StorageService.saveUtilities(utilities);
  }, [utilities]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (auth) {
      StorageService.saveAuth(auth);
    } else {
      StorageService.clearAuth();
    }
  }, [auth]);

  // Authentication handlers
  const handleOpenSignIn = () => {
    setShowSignIn(true);
  };

  const handleCloseSignIn = () => {
    setShowSignIn(false);
    setActiveTab('landing');
  };

  // Navigation that respects authentication: management tabs require landlord sign-in
  const navigateToTab = (tab: string) => {
    if (tab === 'landing') {
      setActiveTab('landing');
      return;
    }
    if (!isLandlord) {
      // non-landlords (or unauthenticated users) must sign in to reach management tabs
      setShowSignIn(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleSignIn = (phone: string) => {
    const normalized = normalizePhone(phone);
    if (normalized === LANDLORD_PHONE) {
      setAuth({ role: 'landlord', phone: normalized });
      setShowSignIn(false);
      setActiveTab('dashboard');
    } else {
      setAuth({ role: 'tenant', phone: normalized });
      setShowSignIn(false);
      setActiveTab('tenant');
    }
  };

  const handleSignOut = () => {
    setAuth(null);
    setActiveTab('landing');
  };

  // Handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleOpenRecordPayment = (tenantId?: string) => {
    setPreselectedPaymentTenantId(tenantId);
    setShowRecordPaymentModal(true);
  };

  const handleSavePayment = (newPayment: Payment, updatedBalance: number) => {
    setPayments((prev) => [newPayment, ...prev]);
    // update tenant balance
    setTenants((prev) =>
      prev.map((t) => (t.id === newPayment.tenantId ? { ...t, balance: updatedBalance } : t))
    );

    // add notification
    const tenant = tenants.find((t) => t.id === newPayment.tenantId);
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Payment Recorded',
      message: `${tenant?.fullName || 'Tenant'} paid ${StorageService.formatCurrency(newPayment.amount, settings.currencySymbol)} (Receipt #${newPayment.receiptNumber})`,
      timestamp: 'Just now',
      type: 'payment',
      read: false,
      linkTab: 'payments',
    };
    setNotifications((prev) => [notif, ...prev]);

    setShowRecordPaymentModal(false);
    // Show generated receipt immediately
    setActiveReceiptPayment(newPayment);
  };

  const handleSaveTenant = (
    savedTenant: Tenant,
    assignedUnitId: string,
    previousUnitId?: string
  ) => {
    if (editingTenant) {
      setTenants((prev) => prev.map((t) => (t.id === savedTenant.id ? savedTenant : t)));
    } else {
      setTenants((prev) => [savedTenant, ...prev]);
    }

    // Mark previous unit vacant if changed
    if (previousUnitId && previousUnitId !== assignedUnitId) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === previousUnitId ? { ...u, status: 'vacant', currentTenantId: undefined } : u
        )
      );
    }

    // Mark assigned unit occupied
    setUnits((prev) =>
      prev.map((u) =>
        u.id === assignedUnitId ? { ...u, status: 'occupied', currentTenantId: savedTenant.id } : u
      )
    );

    setShowAddTenantModal(false);
    setEditingTenant(undefined);
  };

  const handleSaveUnit = (savedUnit: Unit) => {
    if (editingUnit) {
      setUnits((prev) => prev.map((u) => (u.id === savedUnit.id ? savedUnit : u)));
    } else {
      setUnits((prev) => [...prev, savedUnit]);
    }
    setShowAddUnitModal(false);
    setEditingUnit(undefined);
  };

  const handleSaveProperty = (savedProperty: Property) => {
    if (editingProperty) {
      setProperties((prev) => prev.map((p) => (p.id === savedProperty.id ? savedProperty : p)));
    } else {
      setProperties((prev) => [...prev, savedProperty]);
    }
    setShowAddPropertyModal(false);
    setEditingProperty(undefined);
  };

  const handleSaveMaintenance = (savedRequest: MaintenanceRequest) => {
    if (editingMaintenance) {
      setMaintenance((prev) => prev.map((m) => (m.id === savedRequest.id ? savedRequest : m)));
    } else {
      setMaintenance((prev) => [savedRequest, ...prev]);
    }
    setShowAddMaintenanceModal(false);
    setEditingMaintenance(undefined);
  };

  const handleUpdateMaintenanceStatus = (requestId: string, newStatus: MaintenanceStatus) => {
    setMaintenance((prev) =>
      prev.map((m) =>
        m.id === requestId
          ? {
              ...m,
              status: newStatus,
              resolvedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : m.resolvedDate,
            }
          : m
      )
    );
  };

  const handleSaveUtilityReading = (reading: UtilityReading) => {
    setUtilities((prev) => [reading, ...prev]);
    // update the unit's last water reading
    setUnits((prev) =>
      prev.map((u) =>
        u.id === reading.unitId ? { ...u, waterMeterLastReading: reading.currentWaterReading } : u
      )
    );
  };

  const handleResetData = () => {
    StorageService.resetToDefault();
    setProperties(StorageService.getProperties());
    setUnits(StorageService.getUnits());
    setTenants(StorageService.getTenants());
    setPayments(StorageService.getPayments());
    setMaintenance(StorageService.getMaintenance());
    setUtilities(StorageService.getUtilities());
    setNotifications(StorageService.getNotifications());
    setSettings(StorageService.getSettings());
  };

  const handleImportData = (jsonString: string) => {
    const success = StorageService.importAllData(jsonString);
    if (success) {
      setProperties(StorageService.getProperties());
      setUnits(StorageService.getUnits());
      setTenants(StorageService.getTenants());
      setPayments(StorageService.getPayments());
      setMaintenance(StorageService.getMaintenance());
      setUtilities(StorageService.getUtilities());
      setSettings(StorageService.getSettings());
    }
    return success;
  };

  // Tab definitions
  const TABS = [
    { id: 'landing', label: 'Public Site / Homes', icon: Globe },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Houses & Estates', icon: Building2 },
    { id: 'tenants', label: 'Tenants & Leases', icon: Users },
    { id: 'payments', label: 'Rent Ledger', icon: Receipt },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'utilities', label: 'Water Meters', icon: Droplets },
    { id: 'analytics', label: 'Financial Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Backup', icon: SettingsIcon },
  ];

  const isLandlord = auth?.role === 'landlord';
  const isTenant = auth?.role === 'tenant';

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] font-sans flex flex-col selection:bg-[#E2DBCB] selection:text-[#1A1A1A]">
      {/* AUTH HANDLING */}
      {!auth ? (
        <>
      {/* Top Application Header - Public */}
      <Header
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenRecordPayment={() => {}}
        onOpenAddTenant={() => {}}
        onOpenAddUnit={() => {}}
        onOpenAddMaintenance={() => {}}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        activeTab="landing"
        userRole={null}
        onSignOut={handleSignOut}
      />

      {/* Public Landing Page */}
      <LandingPageView
        properties={properties}
        units={units}
        tenants={tenants}
        settings={settings}
        onOpenManagementPortal={handleOpenSignIn}
      />

      {/* Sign In Popup */}
      {(showSignIn || activeTab !== 'landing') && (
        <SignInView onSignIn={handleSignIn} onClose={handleCloseSignIn} />
      )}
        </>
      ) : isTenant && !isLandlord ? (
        <TenantPortalView
          phone={auth?.phone ?? ''}
          settings={settings}
          onSignOut={handleSignOut}
        />
      ) : (
        <>
      {/* Top Application Header */}
      <Header
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onNavigateTab={navigateToTab}
        onOpenRecordPayment={() => handleOpenRecordPayment()}
        onOpenAddTenant={() => {
          setEditingTenant(undefined);
          setShowAddTenantModal(true);
        }}
        onOpenAddUnit={() => {
          setEditingUnit(undefined);
          setShowAddUnitModal(true);
        }}
        onOpenAddMaintenance={() => {
          setEditingMaintenance(undefined);
          setShowAddMaintenanceModal(true);
        }}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        activeTab={activeTab}
        userRole={auth?.role ?? null}
        onSignOut={handleSignOut}
      />

      {/* Navigation Sub-Header Bar */}
      <nav className="bg-[#FAF8F5]/95 border-b border-[#E5E0D8] sticky top-16 z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A] shadow-xs'
                      : 'bg-transparent text-[#615C53] border-transparent hover:text-[#1A1A1A] hover:bg-[#EFEAE1] hover:border-[#E5E0D8]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#8A8477]'}`} />
                  <span className={isActive ? 'font-semibold' : ''}>{tab.label}</span>
                  {tab.id === 'tenants' && tenants.filter((t) => t.balance > 0).length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#E07A5F]' : 'bg-[#C84B31]'}`}></span>
                  )}
                  {tab.id === 'maintenance' && maintenance.filter((m) => m.status === 'reported').length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#E9C46A]' : 'bg-[#D4A373]'}`}></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      {activeTab === 'landing' ? (
        <LandingPageView
          properties={properties}
          units={units}
          tenants={tenants}
          settings={settings}
          onOpenManagementPortal={() => setActiveTab('dashboard')}
        />
      ) : (
        <>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {activeTab === 'dashboard' && (
          <DashboardView
            properties={properties}
            units={units}
            tenants={tenants}
            payments={payments}
            maintenance={maintenance}
            settings={settings}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenRecordPayment={handleOpenRecordPayment}
            onViewReceipt={(p) => setActiveReceiptPayment(p)}
            onGenerateNotice={(t) => setActiveNoticeTenant(t)}
          />
        )}

        {activeTab === 'properties' && (
          <PropertiesView
            properties={properties}
            units={units}
            tenants={tenants}
            settings={settings}
            onAddProperty={() => {
              setEditingProperty(undefined);
              setShowAddPropertyModal(true);
            }}
            onEditProperty={(prop) => {
              setEditingProperty(prop);
              setShowAddPropertyModal(true);
            }}
            onAddUnit={(propId) => {
              setEditingUnit(undefined);
              setDefaultUnitPropertyId(propId);
              setShowAddUnitModal(true);
            }}
            onEditUnit={(unit) => {
              setEditingUnit(unit);
              setShowAddUnitModal(true);
            }}
            onAssignTenant={(unit) => {
              setEditingTenant(undefined);
              setShowAddTenantModal(true);
            }}
            onRecordPayment={handleOpenRecordPayment}
          />
        )}

        {activeTab === 'tenants' && (
          <TenantsView
            tenants={tenants}
            units={units}
            properties={properties}
            settings={settings}
            onAddTenant={() => {
              setEditingTenant(undefined);
              setShowAddTenantModal(true);
            }}
            onEditTenant={(tenant) => {
              setEditingTenant(tenant);
              setShowAddTenantModal(true);
            }}
            onRecordPayment={handleOpenRecordPayment}
            onGenerateNotice={(tenant) => setActiveNoticeTenant(tenant)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsView
            payments={payments}
            tenants={tenants}
            units={units}
            properties={properties}
            settings={settings}
            onRecordPayment={() => handleOpenRecordPayment()}
            onViewReceipt={(payment) => setActiveReceiptPayment(payment)}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceView
            maintenance={maintenance}
            properties={properties}
            units={units}
            tenants={tenants}
            settings={settings}
            onAddRequest={() => {
              setEditingMaintenance(undefined);
              setShowAddMaintenanceModal(true);
            }}
            onEditRequest={(req) => {
              setEditingMaintenance(req);
              setShowAddMaintenanceModal(true);
            }}
            onUpdateStatus={handleUpdateMaintenanceStatus}
          />
        )}

        {activeTab === 'utilities' && (
          <UtilitiesView
            utilities={utilities}
            units={units}
            properties={properties}
            tenants={tenants}
            settings={settings}
            onSaveReading={handleSaveUtilityReading}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            properties={properties}
            units={units}
            tenants={tenants}
            payments={payments}
            maintenance={maintenance}
            settings={settings}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={setSettings}
            onResetData={handleResetData}
            onImportData={handleImportData}
          />
        )}
          </main>

          {/* Footer */}
          <footer className="bg-[#FAF8F5] border-t border-[#E5E0D8] py-8 text-xs text-[#736E65]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2D5A34]"></span>
                <span className="font-serif font-bold text-sm tracking-tight text-[#1A1A1A]">Ngotho Estates & Rental Management</span>
                <span className="hidden md:inline text-[#8F8A7F]">•</span>
                <span className="hidden md:inline italic text-[#736E65]">Edition 2026</span>
              </div>
              <div className="text-[#8F8A7F] text-center sm:text-right font-mono text-[11px]">
                <span>Paybill: <strong className="text-[#1A1A1A] font-medium">{settings.paybillNumber}</strong> • Contact: {settings.landlordPhone}</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* MODALS */}
      {/* 1. Official Receipt Modal */}
      {activeReceiptPayment && (
        <ReceiptModal
          payment={activeReceiptPayment}
          tenant={tenants.find((t) => t.id === activeReceiptPayment.tenantId)}
          unit={units.find((u) => u.id === activeReceiptPayment.unitId)}
          property={properties.find((p) => p.id === activeReceiptPayment.propertyId)}
          settings={settings}
          onClose={() => setActiveReceiptPayment(null)}
        />
      )}

      {/* 2. Notice & Communication Modal */}
      {activeNoticeTenant && (
        <NoticeModal
          tenant={activeNoticeTenant}
          unit={units.find((u) => u.id === activeNoticeTenant.unitId)}
          property={properties.find((p) => p.id === activeNoticeTenant.propertyId)}
          settings={settings}
          onClose={() => setActiveNoticeTenant(null)}
        />
      )}

      {/* 3. Record Payment Modal */}
      {showRecordPaymentModal && (
        <RecordPaymentModal
          tenants={tenants}
          units={units}
          properties={properties}
          settings={settings}
          preselectedTenantId={preselectedPaymentTenantId}
          onSavePayment={handleSavePayment}
          onClose={() => {
            setShowRecordPaymentModal(false);
            setPreselectedPaymentTenantId(undefined);
          }}
        />
      )}

      {/* 4. Add/Edit Tenant Modal */}
      {showAddTenantModal && (
        <AddTenantModal
          units={units}
          properties={properties}
          settings={settings}
          existingTenant={editingTenant}
          onSaveTenant={handleSaveTenant}
          onClose={() => {
            setShowAddTenantModal(false);
            setEditingTenant(undefined);
          }}
        />
      )}

      {/* 5. Add/Edit Unit Modal */}
      {showAddUnitModal && (
        <AddUnitModal
          properties={properties}
          settings={settings}
          existingUnit={editingUnit}
          defaultPropertyId={defaultUnitPropertyId}
          onSaveUnit={handleSaveUnit}
          onClose={() => {
            setShowAddUnitModal(false);
            setEditingUnit(undefined);
            setDefaultUnitPropertyId(undefined);
          }}
        />
      )}

      {/* 6. Add/Edit Property Modal */}
      {showAddPropertyModal && (
        <AddPropertyModal
          existingProperty={editingProperty}
          onSaveProperty={handleSaveProperty}
          onClose={() => {
            setShowAddPropertyModal(false);
            setEditingProperty(undefined);
          }}
        />
      )}

      {/* 7. Add/Edit Maintenance Modal */}
      {showAddMaintenanceModal && (
        <AddMaintenanceModal
          properties={properties}
          units={units}
          tenants={tenants}
          settings={settings}
          existingRequest={editingMaintenance}
          onSaveRequest={handleSaveMaintenance}
          onClose={() => {
            setShowAddMaintenanceModal(false);
            setEditingMaintenance(undefined);
          }}
        />
      )}
        </>
      )}
    </div>
  );
}
