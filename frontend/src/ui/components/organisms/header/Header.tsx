import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Back from '@/ui/components/atoms/buttons/back/Back';
import LogoutButton from '@/ui/components/atoms/buttons/logout/Logout';
import RindusLogo from '@/ui/components/atoms/buttons/rindus-logo/RindusLogo';
import Search from '@/ui/components/atoms/buttons/search/Search';

import { AuthContext } from '@/ui/context/auth/Auth';

import '@/ui/components/organisms/header/Header.scss';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userProfileData } = useContext(AuthContext);

  const isHomePage = location.pathname === '/';
  const isProfilePage = location.pathname === `/profile/${userProfileData?.id}`;

  const handleSearchNavigate = () => {
    navigate('/search');
  };

  const handleLogo = () => {
    if (isLoggedIn) {
      navigate('/');
    }
  };

  const handleProfileNavigate = () => {
    navigate(`/profile/${userProfileData?.id}`);
  };

  if (!isLoggedIn)
    return (
      <header className="header__container--login" data-testid="header-login">
        <RindusLogo />
      </header>
    );

  return (
    <header className="header__container--logged" data-testid="header-logged">
      {isHomePage ? (
        <div className="search">
          <Search onClick={handleSearchNavigate} />
        </div>
      ) : (
        <div className="back">
          <Back />
        </div>
      )}

      <div className="rindusLogo">
        <RindusLogo onClick={handleLogo} />
      </div>

      {isProfilePage ? (
        <div className="logout">
          <LogoutButton />
        </div>
      ) : (
        <div className="profile">
          <button
            onClick={handleProfileNavigate}
            data-testid="profile"
            className="profile__button"
          >
            <img
              loading="lazy"
              src={userProfileData && `${userProfileData.profilePictureUrl}`}
            />
          </button>
        </div>
      )}
    </header>
  );
}
