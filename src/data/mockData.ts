import { Project, Task, Payment } from "./types";

export const mockProjects: Project[] = [
  { 
    id: 'p1', 
    title: 'Website Redesign', 
    companyName: 'TechCorp',
    description: 'Full redesign',
    compensation: 5000,
    currency : "$",
    compensationRate: 'one-time',
    startDate: '2026-02-01',
    endDate: '2026-03-01',
    cumulatedCompensation: 0
  }
];

export const mockTasks: Task[] = [
  { 
    id: 't1', 
    projectId: 'p1', 
    companyName: 'TechCorp',
    description: 'Hero Section', 
    startDate: '2026-02-16', 
    endDate: '2026-02-18',
    dueDate: '2026-02-18'
  },
  { 
    id: 't2', 
    projectId: 'p1', 
    companyName: 'TechCorp',
    description: 'Footer Fixes', 
    startDate: '2026-02-19', 
    endDate: '2026-02-21',
    dueDate: '2026-02-21'
  }
];

export const mockPayments: Payment[] = [
  { id: 'pay1', projectId: 'p1', amount: 2500, currency: 'USD', date: '2026-02-10' },
  { id: 'pay2', projectId: 'p1', amount: 2500, currency: 'USD', date: '2026-01-15' },
  { id: 'pay3', projectId: 'p2', amount: 1200, currency: 'USD', date: '2025-11-20' },
  { id: 'pay4', projectId: 'p2', amount: 800, currency: 'USD', date: '2025-08-05' },
];