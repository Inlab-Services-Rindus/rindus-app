import '@/atoms/tag/Tag.scss';

interface Props {
  handleClick?: (tagName: string) => void;
  tag: string;
  tagLabel?: string;
}

export default function Tag({
  handleClick,
  tag,
  tagLabel,
}: Props): JSX.Element {
  const handletagClick = () => {
    if (handleClick) {
      handleClick(tag);
    }
  };

  return (
    <div className="tag">
      {tagLabel}
      <button onClick={handletagClick} className="tag__button">
        {tag.toUpperCase()}
      </button>
    </div>
  );
}
