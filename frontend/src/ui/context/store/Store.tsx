import { createContext, useState, ReactNode } from 'react';

import { getAllPartners } from '@/modules/partners/application/get-all/getAllPartners';
import { Partner } from '@/modules/partners/domain/Partner';
import { createPartnerRepository } from '@/modules/partners/infrastructure/PartnerRepository';
import { getAllUsers } from '@/modules/users/application/get-all/getAllUsers';
import { User } from '@/modules/users/domain/User';
import { createUserRepository } from '@/modules/users/infrastructure/UserRepository';

import useIsMobile from '@/ui/hooks/useIsMobile/useIsMobile';

interface UserData {
  data: User[];
  hasMore: boolean;
  hasError: boolean;
  lastPage: number;
  totalPages: number;
}

interface PartnersData {
  data: Partner[];
  hasError: boolean;
  isLoading: boolean;
}

interface TabData {
  currentTab: number;
}

interface StoreContextType {
  users: UserData;
  partners: PartnersData;
  tab: TabData;
  getUsers: (first?: boolean) => void;
  getPartners: () => void;
  setCurrentTab: (currentTab: number) => void;
}

export const StoreContext = createContext<StoreContextType>({
  users: {
    data: [],
    hasMore: false,
    hasError: false,
    lastPage: 0,
    totalPages: 0,
  },
  partners: {
    data: [],
    hasError: false,
    isLoading: false,
  },
  tab: {
    currentTab: 0,
  },
  getUsers: () => {},
  getPartners: () => {},
  setCurrentTab: () => {},
});

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps): JSX.Element {
  const userRepository = createUserRepository();
  const partnerRepository = createPartnerRepository();

  const isMobile = useIsMobile();

  const [usersData, setUsersData] = useState<UserData>({
    data: [],
    hasMore: true,
    hasError: false,
    totalPages: 0,
    lastPage: 0,
  });
  const [partnersData, setPartnersData] = useState<PartnersData>({
    data: [],
    hasError: false,
    isLoading: false,
  });
  const [tabData, setTabData] = useState<TabData>({
    currentTab: 0,
  });

  const getUsers = async (first?: boolean) => {
    if (usersData.data.length === 0 || (!first && usersData.hasMore)) {
      const page = first ? 1 : usersData.lastPage + 1;
      const pageSize = isMobile ? 15 : 40;

      try {
        const users = await getAllUsers(userRepository, page, pageSize);

        setUsersData({
          data: [...usersData.data, ...users.data],
          hasError: false,
          hasMore: users.totalPages > page,
          totalPages: users.totalPages,
          lastPage: page,
        });
      } catch (error) {
        setUsersData({
          data: [],
          hasError: true,
          hasMore: false,
          totalPages: 0,
          lastPage: 0,
        });
      }
    }
  };

  const getPartners = async () => {
    if (partnersData.data.length === 0) {
      setPartnersData({ ...partnersData, isLoading: true });

      try {
        const partners = await getAllPartners(partnerRepository);

        setPartnersData({
          data: partners,
          hasError: false,
          isLoading: false,
        });
      } catch (error) {
        setPartnersData({
          data: [],
          hasError: true,
          isLoading: false,
        });
      }
    }
  };

  const setCurrentTab = (currentTab: number) => {
    setTabData({
      currentTab,
    });
  };

  const contextValue: StoreContextType = {
    users: usersData,
    getUsers,
    partners: partnersData,
    getPartners,
    tab: tabData,
    setCurrentTab,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}
