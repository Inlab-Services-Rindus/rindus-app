import RefreshButton from '@/ui/components/atoms/buttons/refresh/RefreshButton';
import '@/ui/components/organisms/retry/Retry.scss';

interface Props {
  refresh: () => void;
  message?: string;
}

export default function Retry({ refresh, message }: Props): JSX.Element {
  const isError = message === 'Oops! Something went wrong. Please click to refresh and try again.';
  return (
    <div className="retry" data-testid="retry-component">
      <div className="retry__content">
        <p>{message || 'Oops! Something went wrong. Please click to refresh and try again.'}</p>
        {isError && <RefreshButton handleRefresh={refresh} />}
      </div>
    </div>
  );
}
