import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { Meta } from '@/ui/components/atoms/meta/Meta';
import Page from '@/ui/components/layout/page/Page';
import { Analytics } from '@vercel/analytics/react';

import { Router } from '@/ui/router/Router';

import { AuthProvider } from '@/ui/context/auth/Auth';
import { StoreProvider } from '@/ui/context/store/Store';
import { Toast } from '@/ui/context/toast/Toast';

import '@/App.scss';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <Page>
              <Meta />
              <Router />
              <Toast />
              <Analytics />
            </Page>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
