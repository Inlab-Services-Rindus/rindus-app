import { BrowserRouter } from 'react-router-dom';

import '@/App.scss';
import { AuthProvider } from '@/context/auth/Auth';
import { Toast } from '@/context/toast/Toast';
import PageLayout from '@/organisms/layout/page/page';
import { Router } from '@/router/Router';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageLayout>
          <Router />
          <Toast />
        </PageLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
