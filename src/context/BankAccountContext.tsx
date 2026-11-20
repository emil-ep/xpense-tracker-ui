import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUrlQuery } from '../utils/UrlStateUtil';

type BankAccountContextType = {
  selectedBankAccountId: string;
  setSelectedBankAccountId: (id: string) => void;
};

const BankAccountContext = createContext<BankAccountContextType | undefined>(undefined);

export const BankAccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedBankAccountId, setSelectedBankAccountIdState] = useState(() => new URLSearchParams(location.search).get('bankAccountId') ?? '');

  const setSelectedBankAccountId = useCallback((id: string) => {
    setSelectedBankAccountIdState(id);
    updateUrlQuery(navigate, location.pathname, location.search, location.hash, { bankAccountId: id || null });
  }, [location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    const urlAccountId = new URLSearchParams(location.search).get('bankAccountId') ?? '';
    setSelectedBankAccountIdState(previous => previous === urlAccountId ? previous : urlAccountId);
  }, [location.search]);

  return (
    <BankAccountContext.Provider value={{ selectedBankAccountId, setSelectedBankAccountId }}>
      {children}
    </BankAccountContext.Provider>
  );
};

export const useBankAccount = () => {
  const context = useContext(BankAccountContext);
  if (!context) throw new Error('useBankAccount must be used within a BankAccountProvider');
  return context;
};
