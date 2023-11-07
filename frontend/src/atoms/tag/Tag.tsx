import '@/atoms/tag/Tag.scss';

interface Props {
  handleClick: (tagName: string) => void;
  tag: string;
  tagLabel?: string;
  noResults?: boolean;
}

export default function TagResult({
  handleClick,
  tag,
  tagLabel,
  noResults,
}: Props): JSX.Element {
  if (noResults) {
    return (
      <div className="tag">
        <p className="tag__no-result">No results found for {tag}</p>
      </div>
    );
  }

  return (
    <div className="tag">
      {tagLabel}
      <button onClick={() => handleClick(tag)} className="tag__button">
        {tag.toUpperCase()}
      </button>
    </div>
  );
}
