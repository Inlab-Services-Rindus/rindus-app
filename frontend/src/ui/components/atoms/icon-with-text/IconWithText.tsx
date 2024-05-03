import { ReactNode } from 'react';

import '@/ui/components/atoms/icon-with-text/IconWithText.scss';

interface IconWithTextProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

export const IconWithText = ({ icon, title, subtitle }: IconWithTextProps) => (
  <section className="iconWithText">
    {icon}
    <div>
      <p className="iconWithText__title">{title}</p>
      {subtitle && <p className="iconWithText__subtitle">{subtitle}</p>}
    </div>
  </section>
);
