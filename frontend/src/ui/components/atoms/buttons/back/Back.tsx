import { useNavigate } from 'react-router-dom';

import arrowBack from '@/assets/icons/Arrow_back_24.svg';
import '@/ui/components/atoms/buttons/back/Back.scss';

export default function Back() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      className="back__button"
      data-testid="back"
      onClick={handleBack}
      type="button"
    >
      <img alt="SVG back" src={arrowBack} />
    </button>
  );
}
