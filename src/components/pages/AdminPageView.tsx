import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { AdminDashboardGrid } from '../organisms/AdminDashboardGrid';
import { AdminVendorsView } from '../organisms/AdminVendorsView';
import { AdminCampaignsView } from '../organisms/AdminCampaignsView';
import { AdminStatsView } from '../organisms/AdminStatsView';
import { AdminAppsHub } from '../organisms/AdminAppsHub';
import { DistributeLeadsScreen } from '../organisms/adminScreens/DistributeLeadsScreen';
import { ColdLeadsScreen } from '../organisms/adminScreens/ColdLeadsScreen';
import { SalesGoalsScreen } from '../organisms/adminScreens/SalesGoalsScreen';
import { EventsScreen } from '../organisms/adminScreens/EventsScreen';

interface AdminPageViewProps {
  currentTab: string;
}

export const AdminPageView: React.FC<AdminPageViewProps> = ({ currentTab }) => {
  const { adminActiveScreen } = useCRM();

  if (currentTab === 'aplicaciones') {
    switch (adminActiveScreen) {
      case 'distribute':
        return <DistributeLeadsScreen />;
      case 'coldLeads':
        return <ColdLeadsScreen />;
      case 'salesGoals':
        return <SalesGoalsScreen />;
      case 'events':
        return <EventsScreen />;
      case 'hub':
      default:
        return <AdminAppsHub />;
    }
  }

  switch (currentTab) {
    case 'vendedores':
      return <AdminVendorsView />;
    case 'campanas':
      return <AdminCampaignsView />;
    case 'estadisticas':
      return <AdminStatsView />;
    case 'dashboard':
    default:
      return <AdminDashboardGrid />;
  }
};
