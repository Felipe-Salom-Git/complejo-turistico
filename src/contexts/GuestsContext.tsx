'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  document: string; // DNI or Passport
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  reservationsCount: number;
  lastVisit: string | null;
  notes: string;
}

interface GuestsContextType {
  guests: Guest[];
  addGuest: (guest: Guest) => void;
  updateGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;
  incrementVisits: (id: string) => void;
}

const GuestsContext = createContext<GuestsContextType | undefined>(undefined);

export function GuestsProvider({ children }: { children: React.ReactNode }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('guests');
    if (stored) {
      setGuests(JSON.parse(stored));
    } else {
      // Mock data for initial load if empty (optional, matching current "mock" experience)
      // Leaving empty for now, or could migrate the hardcoded data here.
      // Let's migrate the hardcoded data from the page to here as initial state if LS is empty
      // to avoid empty state shock, but commented out or minimal.
      // Actually, let's start fresh or use the data from page.tsx as seed if needed.
    }
    setLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('guests', JSON.stringify(guests));
    }
  }, [guests, loaded]);

  const addGuest = (guest: Guest) => {
    setGuests(prev => [...prev, guest]);
  };

  const updateGuest = (updatedGuest: Guest) => {
    setGuests(prev => prev.map(g => g.id === updatedGuest.id ? updatedGuest : g));
  };

  const deleteGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  const incrementVisits = (id: string) => {
      setGuests(prev => prev.map(g => {
          if (g.id === id) {
              return { ...g, reservationsCount: g.reservationsCount + 1, lastVisit: new Date().toISOString().split('T')[0] };
          }
          return g;
      }));
  };

  return (
    <GuestsContext.Provider value={{ guests, addGuest, updateGuest, deleteGuest, incrementVisits }}>
      {children}
    </GuestsContext.Provider>
  );
}

export function useGuests() {
  const context = useContext(GuestsContext);
  if (context === undefined) {
    throw new Error('useGuests must be used within a GuestsProvider');
  }
  return context;
}
