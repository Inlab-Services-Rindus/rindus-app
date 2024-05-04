import arrowRight from '@/assets/icons/Arrow_right_24.svg';

export default function RightButton() {
  return (
    <button className="right__button" type="button">
      <img alt="SVG right" src={arrowRight} />
    </button>
  );
}
