import {
  SVGColorGreen,
  SVGColorWhite,
  SvgColor,
  SvgColorCode,
} from '@/constants/svgColor';

interface Props {
  background?: SvgColorCode;
  color?: SvgColorCode;
  onClick?: () => void;
}

export default function Mag({
  onClick,
  background = SVGColorGreen,
  color = SVGColorWhite,
}: Props) {
  return (
    <button
      className={`button__logo button__logo--${background}`}
      data-testid="mag"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path
          d="M34.4 38L26.72 30.08C25.52 31.04 24.14 31.8 22.58 32.36C21.02 32.92 19.36 33.2 17.6 33.2C13.24 33.2 9.55 31.69 6.53 28.67C3.51 25.65 2 21.96 2 17.6C2 13.24 3.51 9.55 6.53 6.53C9.55 3.51 13.24 2 17.6 2C21.96 2 25.65 3.51 28.67 6.53C31.69 9.55 33.2 13.24 33.2 17.6C33.2 19.36 32.92 21.02 32.36 22.58C31.8 24.14 31.04 25.52 30.08 26.72L37.76 34.64L34.4 38ZM17.6 28.4C20.6 28.4 23.15 27.35 25.25 25.25C27.35 23.15 28.4 20.6 28.4 17.6C28.4 14.6 27.35 12.05 25.25 9.95C23.15 7.85 20.6 6.8 17.6 6.8C14.6 6.8 12.05 7.85 9.95 9.95C7.85 12.05 6.8 14.6 6.8 17.6C6.8 20.6 7.85 23.15 9.95 25.25C12.05 27.35 14.6 28.4 17.6 28.4Z"
          fill={SvgColor[color]}
        />
      </svg>
    </button>
  );
}
