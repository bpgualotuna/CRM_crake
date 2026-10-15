export type UserRole = 'admin' | 'vendedor' | 'contador' | 'cobranza' | 'verificador' | 'estudiante';

export type ProcessStatus = 'Nuevo' | 'Contactado' | 'Interesado' | 'No responde' | 'Venta realizada' | 'Descartado';

export type Priority = 'Alta' | 'Media' | 'Baja';

export type LeadPlatform = 'Nextline' | 'Facebook' | 'TikTok' | 'Instagram' | 'Delegado' | 'Orgánico';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  phone?: string;
  activeLeadsCount?: number;
  monthlySales?: number;
  monthlyGoal?: number;
}

export interface ContactHistory {
  id: string;
  leadId: string;
  userName: string;
  userRole?: UserRole;
  type: 'call' | 'whatsapp' | 'intento' | 'status_change';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string;
  status: 'completado' | 'fallido' | 'pendiente';
}

export interface Reminder {
  id: string;
  leadId: string;
  leadName?: string;
  type: 'cobro' | 'seguimiento_llamada' | 'seguimiento_whatsapp';
  scheduledFor: string; // ISO 8601
  message: string;
  isCompleted: boolean;
  priority?: Priority;
  assignedToName?: string;
}

export interface CommittedPayment {
  id: string;
  leadSaleId: string;
  amount: number;
  promisedDate: string; // YYYY-MM-DD
  paid: boolean;
  paidDate?: string;
  paidAmount?: number;
  receiptNumber?: string;
  receiptImage?: string;
  metodoPago?: 'cash' | 'transfer' | 'card';
  status: 'pending_verification' | 'verified' | 'rejected';
}

export interface LeadSale {
  id: string;
  leadId: string;
  leadName?: string;
  userId: string;
  userName: string;
  saleType: string; // e.g. "Bootcamp Full Stack Web"
  serviceId?: string;
  amountPaid: number; // initial payment
  totalAmount: number; // total agreed
  enrollmentAmount?: number;
  discount?: number;
  receiptNumber: string;
  receiptImage?: string;
  metodoPago: 'cash' | 'transfer' | 'card';
  date: string;
  notes?: string;
  saleOrigin: 'llamada' | 'whatsapp' | 'correo' | 'recomendacion' | 'evento' | 'otro';
  generacionId?: string;
  generacionNombre?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  committedPayments?: CommittedPayment[];
}

export interface InternalNote {
  id: string;
  leadId: string;
  authorName: string;
  createdAt: string;
  content: string;
}

export interface ActionLog {
  id: string;
  leadId?: string;
  leadName?: string;
  userName: string;
  userRole: UserRole;
  actionType: 'created' | 'status_change' | 'call' | 'whatsapp' | 'sale_registered' | 'assigned' | 'cold_icebox' | 'payment_verified';
  description: string;
  date: string;
  metadata?: Record<string, any>;
}

export interface Lead {
  id: string;
  createdTime: string;
  formName: string;
  platform: LeadPlatform;
  fullName: string;
  phoneNumber: string;
  email: string;
  provinciaEstado?: string;
  motivoEstudio?: string;

  // Nextline WhatsApp metadata
  nextlineContactId?: string;
  nextlineTagId?: string | null;
  nextlineTagName?: string | null;
  nextlineAgentId?: string | null;
  nextlineAgentName?: string | null;
  nextlineRegisteredAt?: string;
  nextlineSyncedAt?: string;

  // Pipeline state
  processStatus: ProcessStatus;
  processStatusChangedAt?: string;
  priority: Priority;
  assignedTo?: string; // UUID User
  assignedToName?: string;
  assignedAt?: string;

  // Cold leads management
  isCold?: boolean;
  coldReason?: string;
  coldDate?: string;
  attempts: number; // Call / contact attempts count
  lastActivity?: string;

  // Collections & Sale Info
  abonoAcumulado?: number;
  saldoPendiente?: number;
  fechaInicioClases?: string;
  courseInterest?: string;

  // Related collections
  contactHistory?: ContactHistory[];
  reminders?: Reminder[];
  internalNotes?: InternalNote[];
  sales?: LeadSale[];
}

export interface Campaign {
  id: string;
  name: string;
  nextlineTag: string;
  platform: LeadPlatform;
  startDate: string;
  leadsCount: number;
  conversionsCount: number;
  totalRevenue: number;
  budget: number;
  status: 'activa' | 'pausada' | 'concluida';
}

export interface CourseCatalogItem {
  id: string;
  title: string;
  regularPrice: number;
  enrollmentFee: number;
  durationMonths: number;
  installmentsAvailable: number;
  activePromoDiscount?: number;
  nextCohortDate: string;
  cohortName: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  body: string;
}

export interface SalesGoal {
  id: string;
  vendorId: string;
  vendorName: string;
  month: string;
  targetSales: number;
  targetRevenue: number;
  currentSales: number;
  currentRevenue: number;
}

export interface EventParticipant {
  leadId: string;
  leadName: string;
  phoneNumber: string;
  email: string;
  attendanceStatus: 'Confirmado' | 'Asistió' | 'No asistió';
  closedSaleDuringEvent?: boolean;
  saleAmount?: number;
  inscribedAt: string;
}

export interface CRMEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  speaker: string;
  associatedCourseId: string;
  associatedCourseTitle: string;
  capacity: number;
  participants: EventParticipant[];
  status: 'Programado' | 'En vivo' | 'Finalizado';
}

export interface Promotion {
  id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;
  campaignOrCourseId: string;
  campaignOrCourseName: string;
  isActive: boolean;
}

export interface ProcessStatusItem {
  id: string;
  name: ProcessStatus;
  color: string;
  description: string;
  order: number;
  isSystemDefault?: boolean;
}
