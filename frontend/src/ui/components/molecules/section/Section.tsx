import React from 'react';

import Loader from '@/ui/components/atoms/loader/Loader';
import Retry from '@/ui/components/organisms/retry/Retry';

interface SectionProps {
  isLoading?: boolean;
  className?: string;
  dataTestId?: string;
  refresh?: () => void;
  shouldRefresh?: boolean;
  retryMessage?: string;
  children: React.ReactNode;
}

const Section = ({
  isLoading,
  className,
  dataTestId,
  children,
  refresh,
  shouldRefresh,
  retryMessage
}: SectionProps) => {
  if (isLoading) {
    return <Loader />;
  }

  if (refresh && shouldRefresh) {
    return <Retry refresh={refresh} message={retryMessage} />;
  }

  return (
    <section className={className} data-testid={dataTestId}>
      {children}
    </section>
  );
};

export default Section;
