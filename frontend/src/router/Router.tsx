import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContext } from '@/context/auth/Auth';
import ProtectedRoutes from '@/organisms/protectedRoutes/ProtectedRoutes';
import { Home } from '@/pages/home/Home';
import { Login } from '@/pages/login/Login';
import { Search } from '@/pages/search/Search';

export function Router() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route element={<Login />} path="/login" />
      <Route element={<ProtectedRoutes isAuth={isLoggedIn} />}>
        <Route element={<Home />} path="/" />
        <Route element={<Search />} path="/search" />
      </Route>
    </Routes>
  );
}
