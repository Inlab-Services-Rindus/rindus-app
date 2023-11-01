import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import '@/App.scss';

import { Meta } from '@/atoms/meta/Meta';
import { AuthProvider } from '@/context/auth/Auth';
import { Toast } from '@/context/toast/Toast';
import PageLayout from '@/organisms/layout/page/page';
import { Router } from '@/router/Router';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <PageLayout>
            <Meta />
            <Router />
            <Toast />
          </PageLayout>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
