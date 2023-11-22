import closeButton from '@/assets/icons/Close_24.svg';

import '@/ui/components/atoms/buttons/close/Close.scss';

interface closeButtonProps {
  handleclick: () => void;
}

export default function Close({ handleclick }: closeButtonProps) {
  return (
    <button
      className="close__button"
      data-testid="close"
      onClick={handleclick}
      type="button"
    >
      <img alt="SVG close" src={closeButton} />
    </button>
  );
}
