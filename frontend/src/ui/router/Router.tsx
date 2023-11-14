import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from '@/ui/components/atoms/loader/Loader';
import ProtectedRoutes from '@/ui/components/organisms/protected-routes/ProtectedRoutes';
import { Home } from '@/ui/section/home/Home';
import { Login } from '@/ui/section/login/Login';
import { PartnerInfo as Partner } from '@/ui/section/partner/Partner';
import { Profile } from '@/ui/section/profile/Profile';
import { SearchDetails } from '@/ui/section/search-details/SearchDetails';
import { Search } from '@/ui/section/search/Search';

import { AuthContext } from '@/ui/context/auth/Auth';

export function Router() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="loader__container">
        <Loader />
      </div>
    );
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
        <Route element={<SearchDetails />} path="/search/:query" />
        <Route element={<Profile />} path="/profile/:id" />
        <Route element={<Partner />} path="/partner/:id" />
      </Route>
    </Routes>
  );
}
