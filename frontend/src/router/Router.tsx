import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from '@/context/auth/Auth';
import ProtectedRoutes from '@/organisms/protected-routes/ProtectedRoutes';
import { Home } from '@/pages/home/Home';
import { Login } from '@/pages/login/Login';
import { Profile } from '@/pages/profile/Profile';
import { Search } from '@/pages/search/Search';

export function Router() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div data-testid="loader">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        path="/login"
      />
      <Route element={<ProtectedRoutes isAuth={isLoggedIn} />}>
        <Route element={<Home />} path="/" />
        <Route element={<Search />} path="/search" />
        <Route element={<Profile />} path="/profile" />
      </Route>
    </Routes>
  );
}
