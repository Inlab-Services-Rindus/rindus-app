import '@/atoms/loader/Loader.scss';

export default function Loader() {
  return (
    <div className="loader">
      <span className="loader__spinner" data-testid="loader"></span>
    </div>
  );
}
