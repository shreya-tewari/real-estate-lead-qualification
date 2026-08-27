'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QualificationData, LeadScore, SelectedAppointment, AppStep, CRMData } from '@/types/Lead';
import { Message } from '@/types/Message';

interface LeadContextType {
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  qualificationData: QualificationData;
  updateQualificationData: (data: Partial<QualificationData>) => void;
  leadScore: LeadScore | null;
  setLeadScore: (score: LeadScore) => void;
  selectedAppointment: SelectedAppointment | null;
  setSelectedAppointment: (appt: SelectedAppointment) => void;
  crmData: CRMData | null;
  finalizeCRM: () => void;
  resetAll: () => void;
  backendLeadId: number | null;
  setBackendLeadId: (id: number | null) => void;
}

const defaultQualification: QualificationData = {
  name: '',
  email: '',
  phone: '',
  buyerType: '',
  budget: '',
  location: '',
  propertyType: '',
  timeline: '',
  financing: '',
  purpose: '',
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<AppStep>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [qualificationData, setQualificationData] = useState<QualificationData>(defaultQualification);
  const [leadScore, setLeadScore] = useState<LeadScore | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<SelectedAppointment | null>(null);
  const [crmData, setCrmData] = useState<CRMData | null>(null);
  const [backendLeadId, setBackendLeadId] = useState<number | null>(null);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMsg: Message = {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMsg]);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const updateQualificationData = useCallback((data: Partial<QualificationData>) => {
    setQualificationData(prev => ({ ...prev, ...data }));
  }, []);

  const finalizeCRM = useCallback(() => {
    if (!leadScore) return;
    const assignedTeam = qualificationData.location.toLowerCase().includes('dubai')
      ? 'Dubai Team'
      : qualificationData.location.toLowerCase().includes('abu dhabi')
      ? 'Abu Dhabi Team'
      : 'General Sales Team';

    const salesBrief = `${qualificationData.name || 'This lead'} is a ${qualificationData.buyerType.toLowerCase() || 'potential'} buyer looking for a ${qualificationData.propertyType.toLowerCase() || 'property'} in ${qualificationData.location || 'the region'} with a budget of ${qualificationData.budget || 'TBD'}. Their timeline is ${qualificationData.timeline.toLowerCase() || 'flexible'} and they plan to use ${qualificationData.financing.toLowerCase() || 'standard financing'} for the purchase. Primary investment goal is ${qualificationData.purpose || 'not specified'}. With a lead score of ${leadScore.score}/100, they are categorized as "${leadScore.status}" and have been assigned to the ${assignedTeam} for immediate follow-up.`;

    setCrmData({
      lead: qualificationData,
      score: leadScore,
      appointment: selectedAppointment,
      assignedTeam,
      salesBrief,
    });
  }, [qualificationData, leadScore, selectedAppointment]);

  const resetAll = useCallback(() => {
    setCurrentStep('home');
    setMessages([]);
    setQualificationData(defaultQualification);
    setLeadScore(null);
    setSelectedAppointment(null);
    setCrmData(null);
    setBackendLeadId(null);
  }, []);

  return (
    <LeadContext.Provider value={{
      currentStep,
      setCurrentStep,
      messages,
      addMessage,
      clearMessages,
      qualificationData,
      updateQualificationData,
      leadScore,
      setLeadScore,
      selectedAppointment,
      setSelectedAppointment,
      crmData,
      finalizeCRM,
      resetAll,
      backendLeadId,
      setBackendLeadId,
    }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLead must be used within LeadProvider');
  return ctx;
}
