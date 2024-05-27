import { ReactNode } from 'react';

import '@/ui/components/atoms/icon-with-text/IconWithText.scss';

interface IconWithTextProps {
  icon: ReactNode;
  children: ReactNode;
}

export const IconWithText = ({ icon, children }: IconWithTextProps) => (
  <section className="iconWithText">
    <div>{icon}</div>
    <div className="iconWithText__title">{children}</div>
  </section>
);
