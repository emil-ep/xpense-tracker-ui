import React, { createContext, useContext, useState } from "react";

type BankAccountContextType = {
  selectedBankAccountId: string;
  setSelectedBankAccountId: (id: string) => void;
};

const BankAccountContext = createContext<BankAccountContextType | undefined>(undefined);

export const BankAccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>("");

  return (
    <BankAccountContext.Provider value={{ selectedBankAccountId, setSelectedBankAccountId }}>
      {children}
    </BankAccountContext.Provider>
  );
};

export const useBankAccount = () => {
  const context = useContext(BankAccountContext);
  if (!context) {
    throw new Error("useBankAccount must be used within a BankAccountProvider");
  }
  return context;
};
