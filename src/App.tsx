import React, { useState, useEffect } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { DashboardLayout } from './components/templates/DashboardLayout';
import { AdminPageView } from './components/pages/AdminPageView';
import { VendorPageView } from './components/pages/VendorPageView';
import { LoginPage } from './components/pages/LoginPage';
import { CallActionModal } from './components/organisms/CallActionModal';
import { WhatsAppActionModal } from './components/organisms/WhatsAppActionModal';
import { SaleRegistrationModal } from './components/organisms/SaleRegistrationModal';
import { CreateLeadModal } from './components/organisms/CreateLeadModal';
import { DistributeLeadsModal } from './components/organisms/DistributeLeadsModal';
import { NextlineIntegrationModal } from './components/organisms/NextlineIntegrationModal';
import { HubModals } from './components/organisms/HubModals';
import { LeadDetailModal } from './components/organisms/LeadDetailModal';

const AppContent: React.FC = () => {
  const { currentRole, isAuthenticated } = useCRM();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // When role changes, switch default tab
  useEffect(() => {
    if (currentRole === 'admin') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('leads');
    }
  }, [currentRole]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {currentRole === 'admin' ? (
        <AdminPageView currentTab={currentTab} />
      ) : (
        <VendorPageView currentTab={currentTab} onSelectTab={setCurrentTab} />
      )}

      {/* Global Interactive Modals */}
      <LeadDetailModal />
      <CallActionModal />
      <WhatsAppActionModal />
      <SaleRegistrationModal />
      <CreateLeadModal />
      <DistributeLeadsModal />
      <NextlineIntegrationModal />
      <HubModals />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
}
