import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Bell, 
  DollarSign, 
  UserPlus, 
  Home, 
  Wrench, 
  Check, 
  Search,
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { AppNotification } from '../types';

interface HeaderProps {
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenRecordPayment: () => void;
  onOpenAddTenant: () => void;
  onOpenAddUnit: () => void;
  onOpenAddMaintenance: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab?: string;
  userRole?: 'landlord' | 'tenant' | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onMarkNotificationRead,
  onNavigateTab,
  onOpenRecordPayment,
  onOpenAddTenant,
  onOpenAddUnit,
  onOpenAddMaintenance,
  searchQuery,
  onSearchChange,
  activeTab = 'landing',
  userRole,
  onSignOut,
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isLandlord = userRole === 'landlord';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigateTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
            title="Go to Landing Page"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif font-bold text-lg shadow-xs border border-[#2D2A26] group-hover:border-[#7A571A] transition-colors">
              <span className="text-[#E5D7B7]">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                  ngotho
                </span>
                <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest bg-[#EFEAE1] text-[#4F4B43] border border-[#DCD5C8] rounded-full">
                  Rentals
                </span>
              </div>
              <p className="text-[11px] text-[#7A756B] hidden sm:block italic font-serif">
                Estates & Rental House Ledger
              </p>
            </div>
          </div>

          {/* Universal Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8F897D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search estates, units, tenants, phone, or receipts..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F3EFE6]/70 hover:bg-[#F3EFE6] border border-[#E2DDD3] focus:border-[#1A1A1A] focus:bg-white rounded-lg text-[#1A1A1A] placeholder:text-[#948E82] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8F897D] hover:text-[#1A1A1A]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Toggle between Landing Page & Management Dashboard */}
            {activeTab === 'landing' ? (
              <button
                id="btn-portal-switch"
                onClick={() => onNavigateTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1A1A1A] bg-white hover:bg-[#EFEAE1] rounded-lg transition-colors border border-[#E5E0D8] shadow-2xs"
                title={isLandlord ? 'Open Landlord & Property Management Dashboard' : 'Sign in to access the management portal'}
              >
                {isLandlord ? (
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#7A571A]" />
                ) : (
                  <LogIn className="w-3.5 h-3.5 text-[#7A571A]" />
                )}
                <span className="hidden sm:inline">{isLandlord ? 'Management Console' : 'Sign In'}</span>
              </button>
            ) : (
              <>
              <button
                id="btn-landing-switch"
                onClick={() => onNavigateTab('landing')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1A1A1A] bg-white hover:bg-[#EFEAE1] rounded-lg transition-colors border border-[#E5E0D8] shadow-2xs"
                title="Open Public Showcase & Available Houses"
              >
                <Globe className="w-3.5 h-3.5 text-[#7A571A]" />
                <span className="hidden sm:inline">Public Site</span>
              </button>
              {isLandlord && (
                <button
                  id="btn-sign-out"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#8C2C24] bg-white hover:bg-[#FDF0EE] rounded-lg transition-colors border border-[#E5E0D8] shadow-2xs"
                  title="Sign out of the management portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
              </>
            )}

            {/* Quick Actions Dropdown - Landlord only */}
            {isLandlord && (
            <div className="relative">
              <button
                id="btn-quick-actions"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1A1A1A] hover:bg-[#2C2925] active:bg-black rounded-lg transition-colors shadow-xs border border-[#1A1A1A]"
              >
                <Plus className="w-3.5 h-3.5 text-[#E5D7B7]" />
                <span className="hidden sm:inline">New Action</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A39E92]" />
              </button>

              {showQuickActions && (
                <div 
                  id="dropdown-quick-actions"
                  className="absolute right-0 mt-2 w-60 bg-[#FAF8F5] rounded-xl shadow-xl border border-[#E5E0D8] py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowQuickActions(false)}
                >
                  <button
                    id="qa-record-payment"
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenRecordPayment();
                    }}
                    className="w-full px-4 py-2.5 text-left font-medium text-[#2E2C28] hover:bg-[#EFEAE0] flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[#EAE4D5] text-[#1A1A1A]">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Record Rent Payment</p>
                      <p className="text-[10px] text-[#7A756B]">M-Pesa, Bank, or Cash receipt</p>
                    </div>
                  </button>

                  <button
                    id="qa-add-tenant"
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenAddTenant();
                    }}
                    className="w-full px-4 py-2.5 text-left font-medium text-[#2E2C28] hover:bg-[#EFEAE0] flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[#E6E0D2] text-[#1A1A1A]">
                      <UserPlus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Register New Tenant</p>
                      <p className="text-[10px] text-[#7A756B]">Assign house & set lease</p>
                    </div>
                  </button>

                  <button
                    id="qa-add-unit"
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenAddUnit();
                    }}
                    className="w-full px-4 py-2.5 text-left font-medium text-[#2E2C28] hover:bg-[#EFEAE0] flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[#EFECE5] text-[#1A1A1A]">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Add Unit / House</p>
                      <p className="text-[10px] text-[#7A756B]">Create new rental space</p>
                    </div>
                  </button>

                  <button
                    id="qa-add-maintenance"
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenAddMaintenance();
                    }}
                    className="w-full px-4 py-2.5 text-left font-medium text-[#2E2C28] hover:bg-[#EFEAE0] flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[#EAE3D2] text-[#1A1A1A]">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Log Maintenance Issue</p>
                      <p className="text-[10px] text-[#7A756B]">Assign fundi / technician</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
            )}

            {/* Notifications Center - Landlord only */}
            {isLandlord && (
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#5E5A52] hover:text-[#1A1A1A] hover:bg-[#EFEAE0] rounded-lg transition-colors border border-transparent hover:border-[#E5E0D8]"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A83D2A] ring-2 ring-[#FAF8F5]"></span>
                )}
              </button>

              {showNotifications && (
                <div 
                  id="notifications-panel"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF8F5] rounded-xl shadow-xl border border-[#E5E0D8] p-4 z-50 animate-in fade-in duration-150"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-[#1A1A1A] text-sm">Activity Bulletins</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#FDF0EE] text-[#8C2C24] border border-[#F5D5D1] rounded-full">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8F8A7E]">Ngotho Ledger</span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#8F8A7E] text-center py-4 italic font-serif">No notifications registered.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onMarkNotificationRead(n.id);
                            if (n.linkTab) onNavigateTab(n.linkTab);
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            n.read
                              ? 'bg-white border-[#E5E0D8] text-[#5C5850]'
                              : 'bg-[#F4F0E8] border-[#D8D2C4] text-[#1A1A1A]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-[11px] text-[#1A1A1A]">{n.title}</span>
                            <span className="text-[10px] text-[#8F8A7E] whitespace-nowrap font-mono">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-[#5C5850] mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
