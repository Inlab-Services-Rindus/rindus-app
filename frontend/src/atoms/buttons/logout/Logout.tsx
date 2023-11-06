import { useContext } from 'react';

import logoutIcon from '@/assets/icons/Logout_24.svg';
import '@/atoms/buttons/logout/Logout.scss';
import { AuthContext } from '@/context/auth/Auth';

export default function Logout() {
  const { logout } = useContext(AuthContext);

  return (
    <button className="logout__button" data-testid="logout" onClick={logout}>
      <img alt="SVG logout" src={logoutIcon} />
    </button>
  );
}
