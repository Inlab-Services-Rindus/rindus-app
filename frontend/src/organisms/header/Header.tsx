import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Mag from '@/assets/svgs/Mag';
import RindusLogo from '@/assets/svgs/RindusLogo';
import LogoutButton from '@/atoms/buttons/logout/LogoutButton';
import { AuthContext } from '@/context/auth/Auth';
import '@/organisms/header/Header.scss';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useContext(AuthContext);

  const isSearchPage = location.pathname === '/search';

  const headerClassName = `header${isLoggedIn ? '-multiple' : '-single'}`;
  const magClassName = `header__mag${isSearchPage ? '-white' : '-green'}`;
  const logoClassName = `header__logoBtn${isSearchPage ? '-green' : '-white'}`;

  const handleSearchNavigate = () => {
    navigate('/search');
  };

  const handleLogo = () => {
    if (isLoggedIn) {
      navigate('/');
    }
  };

  const handleProfileNavigate = () => {
    navigate('/profile');
  };

  return (
    <div className={headerClassName} data-testid="header">
      {isLoggedIn && (
        <button className={magClassName} onClick={handleSearchNavigate}>
          <Mag className={magClassName} />
        </button>
      )}
      <button className={logoClassName} data-testid="logo" onClick={handleLogo}>
        <RindusLogo className="header__logo" selected={!isSearchPage} />
      </button>
      {isLoggedIn && (
        <button className="header__profile" onClick={handleProfileNavigate}>
          <img
            className="header__profile"
            src="https://placehold.co/50x50?text=profile"
          />
        </button>
      )}
      {isLoggedIn && <LogoutButton />}
    </div>
  );
}
