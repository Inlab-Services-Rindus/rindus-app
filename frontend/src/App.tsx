import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { Router } from '@/ui/router/Router';

import { AuthProvider } from '@/ui/context/auth/Auth';
import { StoreProvider } from '@/ui/context/store/Store';
import { Toast } from '@/ui/context/toast/Toast';

import { Meta } from '@/ui/components/atoms/meta/Meta';
import PageLayout from '@/ui/components/organisms/layout/page/page';

import '@/App.scss';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <PageLayout>
              <Meta />
              <Router />
              <Toast />
            </PageLayout>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
