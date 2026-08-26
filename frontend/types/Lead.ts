export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface QualificationData {
  name: string;
  email: string;
  phone: string;
  buyerType: string;
  budget: string;
  location: string;
  propertyType: string;
  timeline: string;
  financing: string;
  purpose: string;
}

export interface LeadScore {
  score: number;
  status: 'Highly Qualified' | 'Partially Qualified' | 'Not Qualified';
  reasons: ScoreReason[];
}

export interface ScoreReason {
  label: string;
  points: number;
  achieved: boolean;
}

export interface SelectedAppointment {
  date: string;
  time: string;
  consultant: string;
  consultantTitle: string;
  dayLabel: string;
}

export type AppStep = 'home' | 'conversation' | 'scoring' | 'booking' | 'crm';

export interface CRMData {
  lead: QualificationData;
  score: LeadScore;
  appointment: SelectedAppointment | null;
  assignedTeam: string;
  salesBrief: string;
}
