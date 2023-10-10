import { useNavigate, useLocation } from 'react-router-dom';

import nCage from '@/assets/ncage.png';
import Mag from '@/assets/svgs/Mag';
import RindusLogo from '@/assets/svgs/RindusLogo';
import LogoutButton from '@/atoms/buttons/logout/LogoutButton';
import { Image } from '@/atoms/image/Image';
import '@/organisms/header/Header.scss';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSearchPage = location.pathname === '/search';

  const magClassName = `header__mag${isSearchPage ? '-white' : '-green'}`;
  const logoClassName = `header__logo${isSearchPage ? '-green' : '-white'}`;

  const handleNavigate = () => {
    navigate('/search');
  };

  return (
    <div className="header" data-testid="header">
      <button className={magClassName} onClick={handleNavigate}>
        <Mag className={magClassName} />
      </button>
      <div className={logoClassName} data-testid="logo">
        <RindusLogo className={logoClassName} />
      </div>
      <Image className="header__profile" src={nCage} />
      <LogoutButton />
    </div>
  );
}
