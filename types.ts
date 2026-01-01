
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requester: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  category: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface SystemDiagnostic {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastChecked: string;
}
