import { useNavigate } from 'react-router-dom';

import Back from '@/assets/svgs/Back';
import '@/components/atoms/buttons/back/BackButton.scss';

export function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      className="back__button"
      data-testid="back-button"
      onClick={handleBack}
      type="button"
    >
      <Back />
    </button>
  );
}
