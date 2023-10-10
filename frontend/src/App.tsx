import { BrowserRouter } from 'react-router-dom';

import '@/App.scss';
import { AuthProvider } from '@/context/auth/Auth';
import { Toast } from '@/context/toast/Toast';
import { Router } from '@/router/Router';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
        <Toast />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
