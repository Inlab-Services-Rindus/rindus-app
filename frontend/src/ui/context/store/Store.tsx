import { createContext, useState, ReactNode } from 'react';

import { getAttendees } from '@/modules/attendees/application/get-attendees/getAttendees';
import { Attendee } from '@/modules/attendees/domain/Attendee';
import { createMockAttendeeRepository } from '@/modules/attendees/infrastructure/MockAttendeeRepository';
import { getAllEvents } from '@/modules/events/application/get-all/getAllEvents';
import { Event } from '@/modules/events/domain/Event';
import { createEventRepository } from '@/modules/events/infrastructure/EventRepository';
import { getAllPartners } from '@/modules/partners/application/get-all/getAllPartners';
import { Partner } from '@/modules/partners/domain/Partner';
import { createPartnerRepository } from '@/modules/partners/infrastructure/PartnerRepository';
import { getResults } from '@/modules/search/application/get-results/getResults';
import { getSuggestion } from '@/modules/search/application/get-suggestion/getSuggestion';
import { Item } from '@/modules/search/domain/Suggestion';
import { createSearchRepository } from '@/modules/search/infrastructure/SearchRepository';
import { getAllUsers } from '@/modules/users/application/get-all/getAllUsers';
import { User, UserExtended } from '@/modules/users/domain/User';
import { createUserRepository } from '@/modules/users/infrastructure/UserRepository';

import useIsMobile from '@/ui/hooks/useIsMobile/useIsMobile';

import { setTagsAndUsers } from '@/ui/helpers/searchHelpers';

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

export interface SearchData {
  tags: Item[];
  users: UserExtended[];
  results: UserExtended[];
  search: Item;
  hasError: boolean;
  noResults: boolean;
}
interface TabData {
  currentTab: number;
}
interface AttendeesData {
  data: Attendee[];
  hasError: boolean;
  isLoading: boolean;
}

interface EventsData {
  data: Event[];
  hasError: boolean;
  isLoading: boolean;
}

interface StoreContextType {
  users: UserData;
  partners: PartnersData;
  search: SearchData;
  tab: TabData;
  attendees: AttendeesData;
  query: string;
  events: EventsData;
  setQueryKey: (key: string) => void;
  getUsers: (first?: boolean) => void;
  getPartners: () => void;
  getSearchSuggestions: () => void;
  getSearchResults: (item: Item, custom: boolean) => void;
  getEvents: () => void;
  setSearchData: (item: Partial<SearchData>) => void;
  setCurrentTab: (currentTab: number) => void;
  getAttendance: (id: number) => void;
}

export function getInitialStoreContext() {
  return {
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
    search: {
      tags: [],
      users: [],
      results: [],
      search: { display: '', query: '' },
      hasError: false,
      noResults: false,
    },
    attendees: {
      data: [],
      hasError: false,
      isLoading: false,
    },

    setSearchData: () => {},
    setQueryKey: () => {},
    query: '',
    tab: {
      currentTab: 0,
    },
    events: {
      data: [],
      hasError: false,
      isLoading: false,
    },
    getEvents: () => {},
    getUsers: () => {},
    getPartners: () => {},
    getSearchSuggestions: () => {},
    getSearchResults: () => {},
    setCurrentTab: () => {},
    getAttendance: () => {},
  };
}

export const StoreContext = createContext<StoreContextType>({
  ...getInitialStoreContext(),
});

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps): JSX.Element {
  const [search, setSearch] = useState<SearchData>({
    tags: [],
    users: [],
    results: [],
    search: { display: '', query: '' },
    hasError: false,
    noResults: false,
  });
  const [query, setQuery] = useState<string>('');
  const userRepository = createUserRepository();
  const partnerRepository = createPartnerRepository();
  const searchRepository = createSearchRepository();
  const eventRepository = createEventRepository();
  const attendeeRepository = createMockAttendeeRepository();

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
  const [atendeesData, setAtendeesData] = useState<AttendeesData>({
    data: [],
    hasError: false,
    isLoading: false,
  });

  const [eventsData, setEventsData] = useState<EventsData>({
    data: [],
    hasError: false,
    isLoading: false,
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

  const getSearchSuggestions = async () => {
    try {
      const suggestion = await getSuggestion(searchRepository, query);
      const { tagNames, userItems } = setTagsAndUsers(suggestion);

      setSearchData({
        ...search,
        tags: tagNames,
        users: userItems,
        results: [],
        noResults: !tagNames.length && !userItems.length,
        hasError: false,
        search: { display: query, query: query },
      });
    } catch (error) {
      setSearchData({ ...search, hasError: true });
    }
  };

  const getSearchResults = async (item: Item, custom?: boolean) => {
    const searchTerm = custom ? item.display : item.query;

    try {
      const results = await getResults(searchRepository, searchTerm, !custom);

      if (results.length === 0) {
        setSearchData({
          ...search,
          noResults: true,
          search: { display: item.display, query: item.query },
        });
      } else {
        setSearchData({
          ...search,
          tags: [],
          users: [],
          results: results,
          search: { display: item.display, query: item.query },
        });
      }
    } catch (error) {
      setSearchData({ ...search, hasError: true });
    }
  };

  const getEvents = async () => {
    if (eventsData.data.length === 0) {
      setEventsData({ ...eventsData, isLoading: true });

      try {
        const events = await getAllEvents(eventRepository);

        setEventsData({
          data: events,
          hasError: false,
          isLoading: false,
        });
      } catch (error) {
        setEventsData({
          data: [],
          hasError: true,
          isLoading: false,
        });
      }
    }
  };

  const getAttendance = async (id: number) => {
    setAtendeesData({ ...atendeesData, isLoading: true });

    try {
      const attendees = await getAttendees(attendeeRepository, id.toFixed());
      setAtendeesData({
        data: attendees,
        hasError: false,
        isLoading: false,
      });
    } catch (error) {
      setAtendeesData({
        data: [],
        hasError: true,
        isLoading: false,
      });
    }
  };

  const setQueryKey = (key: string) => {
    setQuery(key);
  };

  const setSearchData = (items: Partial<SearchData>) => {
    setSearch({
      ...search,
      ...items,
    });
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
    search: search,
    setSearchData,
    tab: tabData,
    setCurrentTab,

    attendees: atendeesData,
    getAttendance,
    query: query,
    events: eventsData,
    getEvents,
    setQueryKey,
    getSearchSuggestions,
    getSearchResults,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}
