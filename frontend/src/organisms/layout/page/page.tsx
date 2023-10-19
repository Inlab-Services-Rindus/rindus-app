import { ReactNode } from 'react';

import { Header } from '@/organisms/header/Header';

interface Props {
  children: ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
