import React from 'react';

import Loader from '@/ui/components/atoms/loader/Loader';
import Retry from '@/ui/components/organisms/retry/Retry';

interface SectionProps {
  isLoading?: boolean;
  className?: string;
  dataTestId?: string;
  refresh?: () => void;
  shouldRefresh?: boolean;
  children: React.ReactNode;
}

const Section = ({
  isLoading,
  className,
  dataTestId,
  children,
  refresh,
  shouldRefresh,
}: SectionProps) => {
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

export default Section;
