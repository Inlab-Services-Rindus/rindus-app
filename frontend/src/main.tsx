import ReactDOM from 'react-dom/client';

import App from '@/App.tsx';
import { Analytics } from '@vercel/analytics/react';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Analytics />
    <App />
  </>,
);
