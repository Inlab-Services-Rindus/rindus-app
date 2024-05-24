import '@/ui/components/atoms/loader/Loader.scss';

export default function Loader() {
  return (
    <div className="spinner-container">
      <span className="spinner" data-testid="loader"></span>
    </div>
  );
}
