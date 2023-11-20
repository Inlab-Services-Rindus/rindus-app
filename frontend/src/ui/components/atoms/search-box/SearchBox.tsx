import Close from '@/ui/components/atoms/buttons/close/Close';

import '@/ui/components/atoms/search-box/SearchBox.scss';

interface Props {
  inputHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  enterHandler?: (
    event: React.KeyboardEvent<HTMLInputElement>,
    item?: any,
    custom?: any,
  ) => void;
  closeHandler: () => void;
}

export default function SearchBox({
  inputHandler,
  inputValue,
  enterHandler,
  closeHandler,
}: Props): JSX.Element {
  return (
    <div className="searchbox">
      <input
        type="text"
        placeholder="Search"
        className="searchbox__input"
        value={inputValue}
        onChange={inputHandler}
        onKeyDown={enterHandler}
      ></input>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className="searchbox__icon"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Search">
          <path
            id="Vector"
            d="M17.3154 19L13.4497 15.04C12.8456 15.52 12.151 15.9 11.3658 16.18C10.5805 16.46 9.74497 16.6 8.85906 16.6C6.66443 16.6 4.80705 15.845 3.28692 14.335C1.76678 12.825 1.00671 10.98 1.00671 8.8C1.00671 6.62 1.76678 4.775 3.28692 3.265C4.80705 1.755 6.66443 1 8.85906 1C11.0537 1 12.9111 1.755 14.4312 3.265C15.9513 4.775 16.7114 6.62 16.7114 8.8C16.7114 9.68 16.5705 10.51 16.2886 11.29C16.0067 12.07 15.6242 12.76 15.1409 13.36L19.0067 17.32L17.3154 19ZM8.85906 14.2C10.3691 14.2 11.6527 13.675 12.7097 12.625C13.7668 11.575 14.2953 10.3 14.2953 8.8C14.2953 7.3 13.7668 6.025 12.7097 4.975C11.6527 3.925 10.3691 3.4 8.85906 3.4C7.349 3.4 6.06544 3.925 5.00839 4.975C3.95134 6.025 3.42282 7.3 3.42282 8.8C3.42282 10.3 3.95134 11.575 5.00839 12.625C6.06544 13.675 7.349 14.2 8.85906 14.2Z"
            fill="#303140"
          />
        </g>
      </svg>
      <Close handleclick={closeHandler} />
    </div>
  );
}
