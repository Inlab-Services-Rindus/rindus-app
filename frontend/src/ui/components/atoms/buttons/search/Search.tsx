import searchIcon from '@/assets/icons/Search_24.svg';
import '@/ui/components/atoms/buttons/search/Search.scss';

interface Props {
  onClick?: () => void;
}

export default function Search({ onClick }: Props) {
  return (
    <button className="search__button" data-testid="search" onClick={onClick}>
      <img alt="SVG search" src={searchIcon} />
    </button>
  );
}
