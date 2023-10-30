import React from 'react';

import Loader from '@/atoms/loader/Loader';
import Retry from '@/organisms/retry/Retry';

interface TabProps {
  isLoading: boolean;
  className?: string;
  dataTestId?: string;
  refresh?: () => void;
  shouldRefresh?: boolean;
  children: React.ReactNode;
}

const Tab = ({
  isLoading,
  className,
  dataTestId,
  children,
  refresh,
  shouldRefresh,
}: TabProps) => {
  if (isLoading) {
    return <Loader />;
  }

  if (refresh && shouldRefresh) {
    return <Retry refresh={refresh} />;
  }

  return (
    <section className={className} data-testid={dataTestId}>
      {children}
    </section>
  );
};

export default Tab;
