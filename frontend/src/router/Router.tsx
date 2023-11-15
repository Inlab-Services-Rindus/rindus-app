import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from '@/atoms/loader/Loader';
import { AuthContext } from '@/context/auth/Auth';
import ProtectedRoutes from '@/organisms/protected-routes/ProtectedRoutes';
import { Home } from '@/pages/home/Home';
import { Login } from '@/pages/login/Login';
import Partner from '@/pages/partner/Partner';
import { Profile } from '@/pages/profile/Profile';
// import { SearchDetails } from '@/pages/search-details/SearchDetails';
import { Search } from '@/pages/search/Search';

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
        {/* <Route element={<SearchDetails />} path="/search/:query" /> */}
        <Route element={<Profile />} path="/profile/:id" />
        <Route element={<Partner />} path="/partner/:id" />
      </Route>
    </Routes>
  );
}
