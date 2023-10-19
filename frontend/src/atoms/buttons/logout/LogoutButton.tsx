import { useContext } from 'react';

import logoutIcon from '@/assets/logout.svg';
import '@/atoms/buttons/logout/LogoutButton.scss';
import { AuthContext } from '@/context/auth/Auth';

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <button className="logout__button" data-testid="logout" onClick={logout}>
      <img alt="SVG logout" src={logoutIcon} />
    </button>
  );
}
