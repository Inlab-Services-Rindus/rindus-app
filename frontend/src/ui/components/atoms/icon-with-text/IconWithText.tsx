import { ReactNode } from 'react';

import '@/ui/components/atoms/icon-with-text/IconWithText.scss';

interface IconWithTextProps {
  icon: ReactNode;
  children: ReactNode;
}

export const IconWithText = ({ icon, children }: IconWithTextProps) => (
  <div className="iconWithText">
    <div className="iconWithText__icon">{icon}</div>
    <div className="iconWithText__title">{children}</div>
  </div>
);
