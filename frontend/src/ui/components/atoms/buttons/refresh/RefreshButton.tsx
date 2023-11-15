import refreshIcon from '@/assets/icons/iconRefresh.svg';
import '@/ui/components/atoms/buttons/refresh/RefreshButton.scss';

interface Props {
  handleRefresh: () => void;
}

export default function RefreshButton({ handleRefresh }: Props) {
  return (
    <button
      className="refresh__button"
      data-testid="refresh-button"
      onClick={handleRefresh}
      type="button"
    >
      <img alt="refresh" src={refreshIcon} />
    </button>
  );
}
