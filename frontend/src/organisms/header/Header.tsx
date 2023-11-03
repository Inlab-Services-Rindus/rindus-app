import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Back from '@/atoms/buttons/back/Back';
import LogoutButton from '@/atoms/buttons/logout/Logout';
import RindusLogo from '@/atoms/buttons/rindus-logo/RindusLogo';
import Search from '@/atoms/buttons/search/Search';
import { AuthContext } from '@/context/auth/Auth';
import '@/organisms/header/Header.scss';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userProfileData } = useContext(AuthContext);

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
        <RindusLogo />
      </header>
    );

  if (isProfilePage) {
    return (
      <header className="header__container--logged" data-testid="header-logged">
        <div className="back">
          <Back />
        </div>

        <div className="rindusLogo">
          <RindusLogo onClick={handleLogo} />
        </div>

        <div className="logout">
          <LogoutButton />
        </div>
      </header>
    );
  }

  return (
    <header className="header__container--logged" data-testid="header-logged">
      <div className="search">
        <Search onClick={handleSearchNavigate} />
      </div>

      <div className="rindusLogo">
        <RindusLogo onClick={handleLogo} />
      </div>

      <div className="profile">
        <button
          onClick={handleProfileNavigate}
          data-testid="profile"
          className="profile__button"
        >
          <img
            src={userProfileData && `${userProfileData.profilePictureUrl}`}
          />
        </button>
      </div>
    </header>
  );
}
