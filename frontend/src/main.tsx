import ReactDOM from 'react-dom/client';

import App from '@/App.tsx';
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Analytics />
    <App />
  </>,
);
