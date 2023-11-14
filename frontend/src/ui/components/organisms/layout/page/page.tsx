import { ReactNode } from 'react';

import { Header } from '@/ui/components/organisms/header/Header';
import '@/ui/components/organisms/layout/page/Page.scss';

interface Props {
  children: ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="page">
      <Header />
      <main>{children}</main>
    </div>
  );
}
