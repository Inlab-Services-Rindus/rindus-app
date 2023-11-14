import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  isAuth: boolean;
}

export default function ProtectedRoutes({ isAuth }: Props): JSX.Element {
  return isAuth ? <Outlet data-testid="outlet" /> : <Navigate to="/login" />;
}
