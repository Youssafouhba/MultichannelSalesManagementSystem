/*

import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalVariables {
  apiUrl: string;
  theme: 'light' | 'dark';
  userToken: string | null;
}

interface GlobalVariablesContextType {
  globalVars: GlobalVariables;
  setGlobalVars: React.Dispatch<React.SetStateAction<GlobalVariables>>;
}

const GlobalVariablesContext = createContext<GlobalVariablesContextType | undefined>(undefined);

export const GlobalVariablesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalVars, setGlobalVars] = useState<GlobalVariables>({
    apiUrl: 'https://api.example.com',
    theme: 'light',
    userToken: null,
  });

  return (
    <GlobalVariablesContext.Provider value={{ globalVars, setGlobalVars }}>
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export const useGlobalVariables = () => {
  const context = useContext(GlobalVariimport React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface GlobalVariables {
  apiUrl: string;
  theme: 'light' | 'dark';
  userToken: string | null;
}

interface GlobalVariablesContextType {
  globalVars: GlobalVariables;
  setGlobalVars: Dispatch<SetStateAction<GlobalVariables>>;
}

const GlobalVariablesContext = createContext<GlobalVariablesContextType | undefined>(undefined);

export const GlobalVariablesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalVars, setGlobalVars] = useState<GlobalVariables>({
    apiUrl: 'https://api.example.com',
    theme: 'light',
    userToken: null,
  });

  return (
    <GlobalVariablesContext.Provider value={{ globalVars, setGlobalVars }}>
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export const useGlobalVariables = () => {
  const context = useContext(GlobalVariablesContext);
  if (!context) {
    throw new Error('useGlobalVariables must be used within a GlobalVariablesProvider');
  }
  return context;
};
ablesContext);
  if (context === undefined) {
    throw new Error('useGlobalVariables must be used within a GlobalVariablesProvider');
  }
  return context;
};

*/