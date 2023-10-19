import '@/components/atoms/image/Image.scss';

interface Props {
  src: string;
  className: string;
}

export function Image({ src, className }: Props) {
  return (
    <div className={`image__container ${className}`} data-testid="image">
      <img className="image" src={src} />
    </div>
  );
}
