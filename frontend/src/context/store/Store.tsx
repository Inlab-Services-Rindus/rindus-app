import { createContext, useState, ReactNode } from 'react';

import { config } from '@/config/config';
import { Employee } from '@/model/Employee';
import { Partner } from '@/model/Partner';

interface PaginatedEmployees {
  data: Employee[];
  totalPages: number;
}

interface EmployeeData {
  data: Employee[];
  isLoading: boolean;
  hasMore: boolean;
  lastPage: number;
  totalPages: number;
}

interface PartnersData {
  data: Partner[];
  isLoading: boolean;
}

interface StoreContextType {
  employees: EmployeeData;
  partners: PartnersData;
  getEmployees: (first?: boolean) => void;
  getPartners: () => void;
}

export const StoreContext = createContext<StoreContextType>({
  employees: {
    data: [],
    isLoading: false,
    hasMore: false,
    lastPage: 0,
    totalPages: 0,
  },
  partners: {
    data: [],
    isLoading: false,
  },
  getEmployees: () => {},
  getPartners: () => {},
});

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps): JSX.Element {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    data: [],
    isLoading: false,
    hasMore: true,
    totalPages: 0,
    lastPage: 0,
  });
  const [partnersData, setPartnersData] = useState<PartnersData>({
    data: [],
    isLoading: false,
  });

  const getEmployees = (first?: boolean) => {
    if (employeeData.data.length === 0 || (!first && employeeData.hasMore)) {
      const page = employeeData.lastPage + 1;
      setEmployeeData({ ...employeeData, isLoading: true });

      fetch(`${config.backendUrl}/users?page=${page}`, {
        credentials: 'include',
      })
        .then((response) => response.json() as Promise<PaginatedEmployees>)
        .then((result) => {
          setEmployeeData({
            ...employeeData,
            data: [...employeeData.data, ...result.data],
            isLoading: false,
            hasMore: result.totalPages > page,
            totalPages: result.totalPages,
            lastPage: page,
          });
        });
    }
  };

  const getPartners = () => {
    if (partnersData.data.length === 0) {
      setPartnersData({ ...partnersData, isLoading: true });

      fetch(`${config.backendUrl}/partners`, {
        credentials: 'include',
      })
        .then((response) => response.json() as Promise<Partner[]>)
        .then((result) => {
          setPartnersData({
            ...partnersData,
            data: result,
            isLoading: false,
          });
        });
    }
  };

  const contextValue: StoreContextType = {
    employees: employeeData,
    getEmployees,
    partners: partnersData,
    getPartners,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}
