export type CompensationRate = 'daily' | 'hourly' | 'one-time' | 'monthly' | 'biweekly';

export interface Project {
  id: string;
  title: string;
  companyName: string;
  description: string;
  compensation: number;
  currency: string;
  compensationRate: CompensationRate;
  startDate: string; // Storing as ISO strings for easier JSON handling
  endDate: string;
  cumulatedCompensation: number;
}

export interface Task {
  id: string;
  projectId: string;
  companyName: string;
  description: string;
  startDate: string;
  endDate: string;
  dueDate: string;
}

export interface Payment {
  id: string;
  projectId: string;
  taskId?: string;
  amount: number;
  currency: string;
  date: string;
}

export type FilterEnum = '1m' | '6m' | '1y' | 'all';

export interface PaymentFormData {
  projectId: string;
  amount: string;
  date: string;
  currency: string;
}