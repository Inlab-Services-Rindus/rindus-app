import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Mag from '@/assets/svgs/Mag';
import RindusLogo from '@/assets/svgs/RindusLogo';
import { AuthContext } from '@/context/auth/Auth';
import '@/organisms/header/Header.scss';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useContext(AuthContext);

  const isSearchPage = location.pathname === '/search';
  const isHomePage = location.pathname === '/';

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

  const renderRindusLogo = () => (
    <div className="header__logo">
      <button
        className={`header__button header__button${
          isHomePage ? '--white' : '--green'
        }`}
        data-testid="logo"
        onClick={handleLogo}
      >
        <RindusLogo selected={isHomePage} />
      </button>
    </div>
  );

  if (!isLoggedIn)
    return (
      <div className="header__container--login" data-testid="header-login">
        {renderRindusLogo()}
      </div>
    );

  return (
    <div className="header__container--logged" data-testid="header-logged">
      <div className="header__mag">
        <button
          data-testid="mag"
          className={`header__button header__button${
            isSearchPage ? '--white' : '--green'
          }`}
          onClick={handleSearchNavigate}
        >
          <Mag selected={isSearchPage} />
        </button>
      </div>

      {renderRindusLogo()}

      <div className="header__profile">
        <button onClick={handleProfileNavigate} data-testid="profile">
          <img src="https://placehold.co/50x50?text=profile" />
        </button>
      </div>

      {/* //TODO: Add logout button on profile header {isLoggedIn && <LogoutButton />} */}
    </div>
  );
}
