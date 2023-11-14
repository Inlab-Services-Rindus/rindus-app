import RefreshButton from '@/ui/components/atoms/buttons/refresh/RefreshButton';
import '@/ui/components/organisms/retry/Retry.scss';

interface Props {
  refresh: () => void;
}

export default function Retry({ refresh }: Props): JSX.Element {
  return (
    <div className="retry" data-testid="retry-component">
      <div className="retry__content">
        <p>
          Oops! Something went wrong. Please click to refresh and try again.
        </p>
        <RefreshButton handleRefresh={refresh} />
      </div>
    </div>
  );
}
