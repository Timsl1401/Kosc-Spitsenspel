import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAdminEmails, addAdminEmail as addAdminEmailToDB, removeAdminEmail as removeAdminEmailFromDB } from '../lib/db';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  adminEmails: string[];
  addAdminEmail: (email: string) => Promise<void>;
  removeAdminEmail: (email: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);

  // Load admin emails from database
  const loadAdminEmailsSafe = async () => {
    try {
      const emails = await getAdminEmails();
      setAdminEmails(emails);
    } catch (error) {
      console.error('Error loading admin emails:', error);
      setAdminEmails(['timsl.tsl@gmail.com', 'Henkgerardus51@gmail.com', 'Nickveldhuis25@gmail.com']);
    }
  };

  // Load on mount
  useEffect(() => {
    loadAdminEmailsSafe();
  }, []);

  // Re-load when user changes (e.g., after login)
  useEffect(() => {
    loadAdminEmailsSafe();
  }, [user?.email]);

  useEffect(() => {
    if (user && user.email) {
      const userEmail = user.email.trim().toLowerCase();
      const isAdminUser = adminEmails.some(e => e.trim().toLowerCase() === userEmail);
      setIsAdmin(isAdminUser);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [user, adminEmails]);

  const addAdminEmail = async (email: string) => {
    if (!adminEmails.includes(email)) {
      const success = await addAdminEmailToDB(email);
      if (success) {
        const newAdminEmails = [...adminEmails, email];
        setAdminEmails(newAdminEmails);
        // Update admin status for current user if needed
        if (user && user.email && email.toLowerCase() === user.email.toLowerCase()) {
          setIsAdmin(true);
        }
      }
    }
  };

  const removeAdminEmail = async (email: string) => {
    const success = await removeAdminEmailFromDB(email);
    if (success) {
      const newAdminEmails = adminEmails.filter(e => e !== email);
      setAdminEmails(newAdminEmails);
      // Update admin status for current user if needed
      if (user && user.email && email.toLowerCase() === user.email.toLowerCase()) {
        setIsAdmin(false);
      }
    }
  };

  const value = {
    isAdmin,
    loading,
    adminEmails,
    addAdminEmail,
    removeAdminEmail
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};