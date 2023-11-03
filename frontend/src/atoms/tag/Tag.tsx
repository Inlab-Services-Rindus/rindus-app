import '@/atoms/tag/Tag.scss';

interface Props {
  handleClick: (tagName: string) => void;
  tag: string;
  tagLabel?: string;
}

export default function TagResult({
  handleClick,
  tag,
  tagLabel,
}: Props): JSX.Element {
  return (
    <div className="tag">
      {tagLabel}
      <button onClick={() => handleClick(tag)} className="tag__button">
        {tag.toUpperCase()}
      </button>
    </div>
  );
}
