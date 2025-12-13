'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Quotation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  pax: number;
  unit: string;
  amountUSD: number;
  exchangeRate: number; // e.g. 1460
  amountARS: number;
  depositPercentage: number; // e.g. 30, 50
  depositAmount: number;
  balanceAmount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
}

interface QuotationsContextType {
  quotations: Quotation[];
  addQuotation: (q: Quotation) => void;
  updateQuotation: (q: Quotation) => void;
  deleteQuotation: (id: string) => void;
}

const QuotationsContext = createContext<QuotationsContextType | undefined>(undefined);

export function QuotationsProvider({ children }: { children: React.ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('quotations');
    if (stored) {
        setQuotations(JSON.parse(stored, (key, value) => {
            if (key === 'checkIn' || key === 'checkOut' || key === 'createdAt') return new Date(value);
            return value;
        }));
    }
  }, []);

  useEffect(() => {
      if (quotations.length > 0) {
        localStorage.setItem('quotations', JSON.stringify(quotations));
      }
  }, [quotations]);

  const addQuotation = (q: Quotation) => {
    setQuotations(prev => [...prev, q]);
  };

  const updateQuotation = (q: Quotation) => {
    setQuotations(prev => prev.map(item => item.id === q.id ? q : item));
  };

  const deleteQuotation = (id: string) => {
    setQuotations(prev => prev.filter(item => item.id !== id));
  };

  return (
    <QuotationsContext.Provider value={{ quotations, addQuotation, updateQuotation, deleteQuotation }}>
      {children}
    </QuotationsContext.Provider>
  );
}

export function useQuotations() {
  const context = useContext(QuotationsContext);
  if (context === undefined) {
    throw new Error('useQuotations must be used within a QuotationsProvider');
  }
  return context;
}
