import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Back from '@/atoms/buttons/back/Back';
import LogoutButton from '@/atoms/buttons/logout/LogoutButton';
import Mag from '@/atoms/buttons/mag/Mag';
import RindusLogo from '@/atoms/buttons/rindus-logo/RindusLogo';
import { config } from '@/config/config';
import { SVGColorGreen, SVGColorWhite } from '@/constants/svgColor';
import { AuthContext } from '@/context/auth/Auth';
import '@/organisms/header/Header.scss';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userProfileData } = useContext(AuthContext);

  const isHomePage = location.pathname === '/';
  const isSearchPage = location.pathname === '/search';
  const isProfilePage = location.pathname === '/profile';

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

  if (!isLoggedIn)
    return (
      <header className="header__container--login" data-testid="header-login">
        <RindusLogo color={SVGColorWhite} />
      </header>
    );

  if (isProfilePage) {
    return (
      <header className="header__container--logged" data-testid="header-logged">
        <div className="back">
          <Back />
        </div>

        <div className="logout">
          <LogoutButton />
        </div>
      </header>
    );
  }

  return (
    <header className="header__container--logged" data-testid="header-logged">
      <div className="left">
        <Mag
          onClick={handleSearchNavigate}
          background={isSearchPage ? SVGColorWhite : SVGColorGreen}
          color={isSearchPage ? SVGColorGreen : SVGColorWhite}
        />
      </div>

      <div className="center">
        <RindusLogo
          onClick={handleLogo}
          background={isHomePage ? SVGColorWhite : SVGColorGreen}
          color={isHomePage ? SVGColorGreen : SVGColorWhite}
        />
      </div>
      <div className="right">
        <button
          onClick={handleProfileNavigate}
          data-testid="profile"
          className="button__logo"
        >
          <img
            src={userProfileData && `${userProfileData.profilePictureUrl}`}
          />
        </button>
      </div>
    </header>
  );
}
