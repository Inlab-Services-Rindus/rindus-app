import React from 'react';

import '@/organisms/notificationLayout/NotificationLayout.scss';

interface NotificationLayoutProps {
  children: React.ReactNode;
}

export const NotificationLayout = ({ children }: NotificationLayoutProps) => (
  <div className="notificationLayout">
    <div className="notificationLayout__content">{children}</div>
  </div>
);
