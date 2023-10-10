import refreshIcon from '@/assets/iconRefresh.svg';
import '@/atoms/buttons/refresh/RefreshButton.scss';

interface Props {
  handleRefresh: () => void;
}

export default function RefreshButton({ handleRefresh }: Props) {
  return (
    <button
      className="refresh_button"
      data-testid="refresh-button"
      onClick={handleRefresh}
      type="button"
    >
      <img alt="refresh" src={refreshIcon} />
    </button>
  );
}
