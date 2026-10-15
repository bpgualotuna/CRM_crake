import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead,
  User,
  UserRole,
  Campaign,
  CourseCatalogItem,
  WhatsAppTemplate,
  SalesGoal,
  ActionLog,
  ProcessStatus,
  Priority,
  LeadSale,
  ContactHistory,
  Reminder,
  InternalNote,
  CRMEvent,
  Promotion,
  ProcessStatusItem,
  EventParticipant,
} from '../types/crm';
import {
  INITIAL_LEADS,
  INITIAL_USERS,
  INITIAL_CAMPAIGNS,
  COURSES_CATALOG,
  WHATSAPP_TEMPLATES,
  INITIAL_SALES_GOALS,
  INITIAL_ACTION_LOGS,
  INITIAL_EVENTS,
  INITIAL_PROMOTIONS,
  INITIAL_PROCESS_STATUSES,
} from '../data/mockData';

export type ActiveModalType =
  | null
  | 'call'
  | 'whatsapp'
  | 'sale'
  | 'createLead'
  | 'distribute'
  | 'nextlineIntegration'
  | 'usersManagement'
  | 'coldLeads'
  | 'processStatuses'
  | 'promotions'
  | 'events'
  | 'salesGoals';

export type AdminScreenType = 'hub' | 'distribute' | 'coldLeads' | 'salesGoals' | 'events';

interface CRMContextType {
  // Theme & Auth
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];

  // Navigation state
  adminActiveScreen: AdminScreenType;
  setAdminActiveScreen: (screen: AdminScreenType) => void;

  // Data collections
  leads: Lead[];
  campaigns: Campaign[];
  courses: CourseCatalogItem[];
  whatsappTemplates: WhatsAppTemplate[];
  salesGoals: SalesGoal[];
  events: CRMEvent[];
  promotions: Promotion[];
  processStatuses: ProcessStatusItem[];
  actionLogs: ActionLog[];

  // Selected Lead modal (Large Centered Dialog)
  selectedLead: Lead | null;
  setSelectedLeadId: (id: string | null) => void;

  // Global modals
  activeModal: ActiveModalType;
  modalLead: Lead | null;
  openModal: (modal: ActiveModalType, lead?: Lead | null) => void;
  closeModal: () => void;

  // Telemetry & Realtime
  isSSEConnected: boolean;
  notifications: { id: string; title: string; message: string; time: string; read: boolean }[];
  markNotificationRead: (id: string) => void;

  // Business logic actions
  addLead: (lead: Partial<Lead>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  incrementAttempts: (leadId: string, customReason?: string) => void;
  recordCall: (
    leadId: string,
    reason: string,
    notes: string,
    scheduleReminder?: boolean,
    reminderDate?: string
  ) => void;
  sendWhatsApp: (leadId: string, templateId: string, customMessage: string) => void;
  registerSale: (saleData: {
    leadId: string;
    courseId: string;
    courseTitle: string;
    amountPaid: number;
    totalAmount: number;
    enrollmentAmount: number;
    discount: number;
    receiptNumber: string;
    receiptImage?: string;
    metodoPago: 'cash' | 'transfer' | 'card';
    saleOrigin: 'llamada' | 'whatsapp' | 'evento' | 'otro';
    cohortName: string;
    notes?: string;
    installmentsCount: number;
  }) => void;
  distributeLeadsRoundRobin: (leadIds: string[], vendorIds: string[]) => void;
  distributeLeadsManual: (leadIds: string[], targetVendorId: string) => void;
  moveToCold: (leadId: string, reason: string) => void;
  restoreFromCold: (leadId: string) => void;
  addInternalNote: (leadId: string, content: string) => void;
  addReminder: (leadId: string, reminder: Omit<Reminder, 'id' | 'isCompleted'>) => void;
  completeReminder: (leadId: string, reminderId: string) => void;
  updateLeadPriority: (leadId: string, priority: Priority) => void;
  updateLeadStatus: (leadId: string, status: ProcessStatus) => void;
  exportLeadsCSV: () => void;
  exportSalesCSV: () => void;

  // CRUD for Events
  addEvent: (eventData: Omit<CRMEvent, 'id' | 'participants'>) => void;
  updateEvent: (id: string, updates: Partial<CRMEvent>) => void;
  deleteEvent: (id: string) => void;
  inscribeLeadToEvent: (eventId: string, leadId: string) => void;
  updateParticipantAttendance: (
    eventId: string,
    leadId: string,
    status: 'Confirmado' | 'Asistió' | 'No asistió'
  ) => void;

  // CRUD for Promotions
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  togglePromotionActive: (id: string) => void;

  // CRUD for Sales Goals
  addSalesGoal: (goal: Omit<SalesGoal, 'id' | 'currentSales' | 'currentRevenue'>) => void;
  updateSalesGoal: (id: string, updates: Partial<SalesGoal>) => void;
  deleteSalesGoal: (id: string) => void;

  // CRUD for Process Statuses
  addProcessStatus: (item: Omit<ProcessStatusItem, 'id' | 'order'>) => void;
  updateProcessStatus: (id: string, updates: Partial<ProcessStatusItem>) => void;
  deleteProcessStatus: (id: string) => void;
  moveProcessStatusOrder: (id: string, direction: 'up' | 'down') => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('krake_theme') as 'dark' | 'light') || 'dark';
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('krake_auth') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('krake_role') as UserRole) || 'admin';
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [courses] = useState<CourseCatalogItem[]>(COURSES_CATALOG);
  const [whatsappTemplates] = useState<WhatsAppTemplate[]>(WHATSAPP_TEMPLATES);
  const [salesGoals, setSalesGoals] = useState<SalesGoal[]>(INITIAL_SALES_GOALS);
  const [events, setEvents] = useState<CRMEvent[]>(INITIAL_EVENTS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [processStatuses, setProcessStatuses] = useState<ProcessStatusItem[]>(INITIAL_PROCESS_STATUSES);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>(INITIAL_ACTION_LOGS);

  // Selected Lead Modal
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Admin dedicated full screens
  const [adminActiveScreen, setAdminActiveScreen] = useState<AdminScreenType>('hub');

  // Modal State
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [modalLead, setModalLead] = useState<Lead | null>(null);

  // Realtime SSE simulation
  const [isSSEConnected] = useState<boolean>(true);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Nuevo Lead Asignado',
      message: 'Brandon Alexander inyectado desde Nextline WhatsApp (Bootcamp Full Stack).',
      time: 'Hace 10 min',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Comprobante Pendiente',
      message: 'Sofía Alarcón registró una venta de $750 por verificar.',
      time: 'Hace 45 min',
      read: false,
    },
  ]);

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('krake_theme', theme);
  }, [theme]);

  // Sync current user when role toggles
  useEffect(() => {
    if (currentRole === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || users[0];
      setCurrentUser(adminUser);
    } else if (currentRole === 'vendedor') {
      const vendorUser = users.find((u) => u.role === 'vendedor') || users[1];
      setCurrentUser(vendorUser);
    }
    localStorage.setItem('krake_role', currentRole);
  }, [currentRole, users]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (email: string, role?: UserRole) => {
    let resolvedRole: UserRole = role || 'admin';
    if (!role) {
      resolvedRole = email.toLowerCase().includes('vendedor') ? 'vendedor' : 'admin';
    }
    setCurrentRole(resolvedRole);
    setIsAuthenticated(true);
    localStorage.setItem('krake_auth', 'true');
    localStorage.setItem('krake_role', resolvedRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('krake_auth');
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  const openModal = (modal: ActiveModalType, lead: Lead | null = null) => {
    setModalLead(lead || (selectedLeadId ? selectedLead : null));
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalLead(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const logAction = (
    leadId: string | undefined,
    actionType: ActionLog['actionType'],
    description: string,
    metadata?: Record<string, any>
  ) => {
    const newLog: ActionLog = {
      id: `log-${Date.now()}`,
      leadId,
      userName: currentUser.name,
      userRole: currentRole,
      actionType,
      description,
      date: new Date().toISOString(),
      metadata,
    };
    setActionLogs((prev) => [newLog, ...prev]);
  };

  const addLead = (leadData: Partial<Lead>): Lead => {
    const id = `lead-${Date.now()}`;
    const newLead: Lead = {
      id,
      createdTime: new Date().toISOString(),
      formName: leadData.formName || 'Entrada Manual Krake',
      platform: leadData.platform || 'Orgánico',
      fullName: leadData.fullName || 'Lead Sin Nombre',
      phoneNumber: leadData.phoneNumber || '',
      email: leadData.email || '',
      provinciaEstado: leadData.provinciaEstado || 'Pichincha, Quito',
      motivoEstudio: leadData.motivoEstudio || '',
      courseInterest: leadData.courseInterest || 'Bootcamp Full Stack Web & Cloud',
      nextlineTagName: leadData.nextlineTagName || null,
      nextlineAgentName: leadData.nextlineAgentName || null,
      processStatus: leadData.processStatus || 'Nuevo',
      priority: leadData.priority || 'Media',
      assignedTo: leadData.assignedTo || currentUser.id,
      assignedToName:
        leadData.assignedToName ||
        users.find((u) => u.id === leadData.assignedTo)?.name ||
        currentUser.name,
      isCold: false,
      attempts: 0,
      lastActivity: new Date().toISOString(),
      contactHistory: [],
      reminders: [],
      internalNotes: [],
      ...leadData,
    };

    setLeads((prev) => [newLead, ...prev]);
    logAction(id, 'created', `Nuevo lead creado: ${newLead.fullName} (${newLead.platform})`);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return { ...l, ...updates, lastActivity: new Date().toISOString() };
        }
        return l;
      })
    );
  };

  const incrementAttempts = (leadId: string, customReason?: string) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().substring(0, 5);

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const newAttempts = (l.attempts || 0) + 1;
          const newContact: ContactHistory = {
            id: `ch-${Date.now()}`,
            leadId,
            userName: currentUser.name,
            userRole: currentRole,
            type: 'intento',
            date: dateStr,
            time: timeStr,
            reason: customReason || `Intento de contacto #${newAttempts}. Timbrado sin respuesta.`,
            status: 'fallido',
          };
          return {
            ...l,
            attempts: newAttempts,
            lastActivity: today.toISOString(),
            contactHistory: [newContact, ...(l.contactHistory || [])],
          };
        }
        return l;
      })
    );

    logAction(
      leadId,
      'call',
      `Intento de contacto registrado para lead #${leadId} por ${currentUser.name}`
    );
  };

  const recordCall = (
    leadId: string,
    reason: string,
    notes: string,
    scheduleReminder = false,
    reminderDate = ''
  ) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().substring(0, 5);

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const newAttempts = (l.attempts || 0) + 1;
          const newContact: ContactHistory = {
            id: `ch-${Date.now()}`,
            leadId,
            userName: currentUser.name,
            userRole: currentRole,
            type: 'call',
            date: dateStr,
            time: timeStr,
            reason: `${reason}${notes ? ` - ${notes}` : ''}`,
            status: 'completado',
          };

          const newReminders = [...(l.reminders || [])];
          if (scheduleReminder && reminderDate) {
            newReminders.unshift({
              id: `rem-${Date.now()}`,
              leadId,
              leadName: l.fullName,
              type: 'seguimiento_llamada',
              scheduledFor: reminderDate,
              message: `Volver a llamar a ${l.fullName}: ${reason}`,
              isCompleted: false,
              priority: 'Alta',
              assignedToName: currentUser.name,
            });
          }

          const newStatus = l.processStatus === 'Nuevo' ? 'Contactado' : l.processStatus;

          return {
            ...l,
            attempts: newAttempts,
            processStatus: newStatus,
            lastActivity: today.toISOString(),
            contactHistory: [newContact, ...(l.contactHistory || [])],
            reminders: newReminders,
          };
        }
        return l;
      })
    );

    logAction(leadId, 'call', `Llamada completada a lead: "${reason}" por ${currentUser.name}`);
  };

  const sendWhatsApp = (leadId: string, templateId: string, customMessage: string) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().substring(0, 5);

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const newAttempts = (l.attempts || 0) + 1;
          const newContact: ContactHistory = {
            id: `ch-${Date.now()}`,
            leadId,
            userName: currentUser.name,
            userRole: currentRole,
            type: 'whatsapp',
            date: dateStr,
            time: timeStr,
            reason: `Mensaje WhatsApp enviado: ${customMessage.substring(0, 60)}...`,
            status: 'completado',
          };

          const newStatus = l.processStatus === 'Nuevo' ? 'Contactado' : l.processStatus;

          return {
            ...l,
            attempts: newAttempts,
            processStatus: newStatus,
            lastActivity: today.toISOString(),
            contactHistory: [newContact, ...(l.contactHistory || [])],
          };
        }
        return l;
      })
    );

    logAction(
      leadId,
      'whatsapp',
      `Mensaje WhatsApp enviado a lead por ${currentUser.name}`
    );
  };

  const registerSale = (saleData: {
    leadId: string;
    courseId: string;
    courseTitle: string;
    amountPaid: number;
    totalAmount: number;
    enrollmentAmount: number;
    discount: number;
    receiptNumber: string;
    receiptImage?: string;
    metodoPago: 'cash' | 'transfer' | 'card';
    saleOrigin: 'llamada' | 'whatsapp' | 'evento' | 'otro';
    cohortName: string;
    notes?: string;
    installmentsCount: number;
  }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const saleId = `sale-${Date.now()}`;

    const remaining = saleData.totalAmount - saleData.amountPaid;
    const installments = [];
    if (remaining > 0 && saleData.installmentsCount > 0) {
      const perInstallment = Math.round((remaining / saleData.installmentsCount) * 100) / 100;
      for (let i = 1; i <= saleData.installmentsCount; i++) {
        const promiseDate = new Date();
        promiseDate.setMonth(promiseDate.getMonth() + i);
        installments.push({
          id: `cp-${Date.now()}-${i}`,
          leadSaleId: saleId,
          amount: perInstallment,
          promisedDate: promiseDate.toISOString().split('T')[0],
          paid: false,
          status: 'pending_verification' as const,
        });
      }
    }

    const newSale: LeadSale = {
      id: saleId,
      leadId: saleData.leadId,
      userId: currentUser.id,
      userName: currentUser.name,
      saleType: saleData.courseTitle,
      serviceId: saleData.courseId,
      amountPaid: saleData.amountPaid,
      totalAmount: saleData.totalAmount,
      enrollmentAmount: saleData.enrollmentAmount,
      discount: saleData.discount,
      receiptNumber: saleData.receiptNumber,
      receiptImage: saleData.receiptImage,
      metodoPago: saleData.metodoPago,
      date: todayStr,
      notes: saleData.notes,
      saleOrigin: saleData.saleOrigin,
      generacionNombre: saleData.cohortName,
      status: 'pending_verification',
      verified: false,
      committedPayments: installments,
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === saleData.leadId) {
          const currentSales = l.sales || [];
          return {
            ...l,
            processStatus: 'Venta realizada',
            abonoAcumulado: (l.abonoAcumulado || 0) + saleData.amountPaid,
            saldoPendiente: Math.max(0, saleData.totalAmount - saleData.amountPaid),
            sales: [newSale, ...currentSales],
            lastActivity: new Date().toISOString(),
          };
        }
        return l;
      })
    );

    // If sale originated from event, update event participant
    if (saleData.saleOrigin === 'evento') {
      setEvents((prev) =>
        prev.map((evt) => ({
          ...evt,
          participants: evt.participants.map((p) =>
            p.leadId === saleData.leadId
              ? { ...p, closedSaleDuringEvent: true, saleAmount: saleData.totalAmount }
              : p
          ),
        }))
      );
    }

    // Update vendor sales
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            monthlySales: (u.monthlySales || 0) + saleData.amountPaid,
          };
        }
        return u;
      })
    );

    // Update sales goal
    setSalesGoals((prev) =>
      prev.map((sg) => {
        if (sg.vendorId === currentUser.id) {
          return {
            ...sg,
            currentSales: sg.currentSales + 1,
            currentRevenue: sg.currentRevenue + saleData.amountPaid,
          };
        }
        return sg;
      })
    );

    logAction(
      saleData.leadId,
      'sale_registered',
      `Venta registrada por $${saleData.totalAmount} (Abono: $${saleData.amountPaid}, Comprobante: ${saleData.receiptNumber}) por ${currentUser.name}`
    );
  };

  const distributeLeadsRoundRobin = (leadIds: string[], vendorIds: string[]) => {
    if (leadIds.length === 0 || vendorIds.length === 0) return;

    const vendors = users.filter((u) => vendorIds.includes(u.id));
    if (vendors.length === 0) return;

    let vendorIndex = 0;
    const assignmentMap: Record<string, User> = {};

    leadIds.forEach((id) => {
      assignmentMap[id] = vendors[vendorIndex];
      vendorIndex = (vendorIndex + 1) % vendors.length;
    });

    setLeads((prev) =>
      prev.map((l) => {
        if (assignmentMap[l.id]) {
          const targetVendor = assignmentMap[l.id];
          return {
            ...l,
            assignedTo: targetVendor.id,
            assignedToName: targetVendor.name,
            assignedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
          };
        }
        return l;
      })
    );

    logAction(
      undefined,
      'assigned',
      `Distribución Round-Robin completada: ${leadIds.length} leads repartidos equitativamente entre ${vendors.length} asesores.`
    );
  };

  const distributeLeadsManual = (leadIds: string[], targetVendorId: string) => {
    const targetVendor = users.find((u) => u.id === targetVendorId);
    if (!targetVendor || leadIds.length === 0) return;

    setLeads((prev) =>
      prev.map((l) => {
        if (leadIds.includes(l.id)) {
          return {
            ...l,
            assignedTo: targetVendor.id,
            assignedToName: targetVendor.name,
            assignedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
          };
        }
        return l;
      })
    );

    logAction(
      undefined,
      'assigned',
      `Asignación manual: ${leadIds.length} leads asignados directamente a ${targetVendor.name}.`
    );
  };

  const moveToCold = (leadId: string, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            isCold: true,
            coldReason: reason,
            coldDate: today,
            lastActivity: new Date().toISOString(),
          };
        }
        return l;
      })
    );
    logAction(leadId, 'cold_icebox', `Lead enviado al congelador de fríos. Motivo: "${reason}"`);
  };

  const restoreFromCold = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            isCold: false,
            coldReason: undefined,
            coldDate: undefined,
            lastActivity: new Date().toISOString(),
          };
        }
        return l;
      })
    );
    logAction(leadId, 'status_change', `Lead reactivado desde leads fríos`);
  };

  const addInternalNote = (leadId: string, content: string) => {
    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      leadId,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
      content,
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            internalNotes: [newNote, ...(l.internalNotes || [])],
            lastActivity: new Date().toISOString(),
          };
        }
        return l;
      })
    );
  };

  const addReminder = (leadId: string, reminder: Omit<Reminder, 'id' | 'isCompleted'>) => {
    const newRem: Reminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      isCompleted: false,
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            reminders: [newRem, ...(l.reminders || [])],
          };
        }
        return l;
      })
    );
  };

  const completeReminder = (leadId: string, reminderId: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            reminders: (l.reminders || []).map((r) =>
              r.id === reminderId ? { ...r, isCompleted: true } : r
            ),
          };
        }
        return l;
      })
    );
  };

  const updateLeadPriority = (leadId: string, priority: Priority) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, priority, lastActivity: new Date().toISOString() } : l))
    );
  };

  const updateLeadStatus = (leadId: string, status: ProcessStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            processStatus: status,
            processStatusChangedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
          };
        }
        return l;
      })
    );
    logAction(leadId, 'status_change', `Estado de proceso cambiado a "${status}"`);
  };

  const exportLeadsCSV = () => {
    const headers = [
      'ID',
      'Nombre Completo',
      'Teléfono',
      'Email',
      'Plataforma',
      'Etiqueta Nextline',
      'Agente Nextline',
      'Estado Proceso',
      'Prioridad',
      'Asignado A',
      'Intentos Contacto',
      'Fecha Creación',
      'Es Frio',
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName}"`,
      l.phoneNumber,
      l.email,
      l.platform,
      l.nextlineTagName || 'N/A',
      l.nextlineAgentName || 'N/A',
      l.processStatus,
      l.priority,
      l.assignedToName || 'Sin asignar',
      l.attempts,
      l.createdTime,
      l.isCold ? 'SI' : 'NO',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KRAKE_LEADS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesCSV = () => {
    const headers = [
      'Venta ID',
      'Lead Nombre',
      'Vendedor',
      'Curso / Programa',
      'Abono Inicial',
      'Monto Total',
      'Nro Comprobante',
      'Metodo Pago',
      'Fecha Venta',
      'Estado Verificacion',
    ];

    const allSales: (LeadSale & { leadName: string })[] = [];
    leads.forEach((l) => {
      if (l.sales) {
        l.sales.forEach((s) => {
          allSales.push({ ...s, leadName: l.fullName });
        });
      }
    });

    const rows = allSales.map((s) => [
      s.id,
      `"${s.leadName}"`,
      `"${s.userName}"`,
      `"${s.saleType}"`,
      s.amountPaid,
      s.totalAmount,
      s.receiptNumber,
      s.metodoPago,
      s.date,
      s.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KRAKE_VENTAS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Events CRUD
  const addEvent = (eventData: Omit<CRMEvent, 'id' | 'participants'>) => {
    const newEvt: CRMEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      participants: [],
    };
    setEvents((prev) => [newEvt, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<CRMEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const inscribeLeadToEvent = (eventId: string, leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const alreadyInscribed = evt.participants.some((p) => p.leadId === leadId);
          if (alreadyInscribed) return evt;

          const newParticipant: EventParticipant = {
            leadId: targetLead.id,
            leadName: targetLead.fullName,
            phoneNumber: targetLead.phoneNumber,
            email: targetLead.email,
            attendanceStatus: 'Confirmado',
            inscribedAt: new Date().toISOString().split('T')[0],
          };
          return {
            ...evt,
            participants: [newParticipant, ...evt.participants],
          };
        }
        return evt;
      })
    );
  };

  const updateParticipantAttendance = (
    eventId: string,
    leadId: string,
    status: 'Confirmado' | 'Asistió' | 'No asistió'
  ) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            participants: evt.participants.map((p) =>
              p.leadId === leadId ? { ...p, attendanceStatus: status } : p
            ),
          };
        }
        return evt;
      })
    );
  };

  // Promotions CRUD
  const addPromotion = (promo: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
    };
    setPromotions((prev) => [newPromo, ...prev]);
  };

  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePromotionActive = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Sales Goals CRUD
  const addSalesGoal = (goal: Omit<SalesGoal, 'id' | 'currentSales' | 'currentRevenue'>) => {
    const newGoal: SalesGoal = {
      ...goal,
      id: `sg-${Date.now()}`,
      currentSales: 0,
      currentRevenue: 0,
    };
    setSalesGoals((prev) => [newGoal, ...prev]);
  };

  const updateSalesGoal = (id: string, updates: Partial<SalesGoal>) => {
    setSalesGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteSalesGoal = (id: string) => {
    setSalesGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Process Statuses CRUD
  const addProcessStatus = (item: Omit<ProcessStatusItem, 'id' | 'order'>) => {
    const newStatus: ProcessStatusItem = {
      ...item,
      id: `st-${Date.now()}`,
      order: processStatuses.length + 1,
    };
    setProcessStatuses((prev) => [...prev, newStatus]);
  };

  const updateProcessStatus = (id: string, updates: Partial<ProcessStatusItem>) => {
    setProcessStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteProcessStatus = (id: string) => {
    setProcessStatuses((prev) => prev.filter((s) => s.id !== id));
  };

  const moveProcessStatusOrder = (id: string, direction: 'up' | 'down') => {
    setProcessStatuses((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;

      return copy.map((item, index) => ({ ...item, order: index + 1 }));
    });
  };

  return (
    <CRMContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated,
        login,
        logout,
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        users,
        adminActiveScreen,
        setAdminActiveScreen,
        leads,
        campaigns,
        courses,
        whatsappTemplates,
        salesGoals,
        events,
        promotions,
        processStatuses,
        actionLogs,
        selectedLead,
        setSelectedLeadId,
        activeModal,
        modalLead,
        openModal,
        closeModal,
        isSSEConnected,
        notifications,
        markNotificationRead,
        addLead,
        updateLead,
        incrementAttempts,
        recordCall,
        sendWhatsApp,
        registerSale,
        distributeLeadsRoundRobin,
        distributeLeadsManual,
        moveToCold,
        restoreFromCold,
        addInternalNote,
        addReminder,
        completeReminder,
        updateLeadPriority,
        updateLeadStatus,
        exportLeadsCSV,
        exportSalesCSV,
        addEvent,
        updateEvent,
        deleteEvent,
        inscribeLeadToEvent,
        updateParticipantAttendance,
        addPromotion,
        updatePromotion,
        deletePromotion,
        togglePromotionActive,
        addSalesGoal,
        updateSalesGoal,
        deleteSalesGoal,
        addProcessStatus,
        updateProcessStatus,
        deleteProcessStatus,
        moveProcessStatusOrder,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
