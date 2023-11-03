import rindusLogo from '@/assets/icons/Anchor_40.svg';
import '@/atoms/buttons/rindus-logo/RindusLogo.scss';

interface Props {
  onClick?: () => void;
}

export default function RindusLogo({ onClick }: Props) {
  return (
    <button
      className="rindusLogo__button"
      data-testid="rindusLogo"
      onClick={onClick}
    >
      <img alt="SVG search" src={rindusLogo} />
    </button>
  );
}
