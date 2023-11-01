import '@/atoms/tag-result/TagResult.scss';

interface Props {
  tagName: string;
  handleClick?: (tagName: string) => void;
}

export default function TagResult({
  tagName,
  handleClick,
}: Props): JSX.Element {
  const handleClickButton = () => {
    if (handleClick) {
      handleClick(tagName);
    }
  };
  return (
    <div className="tag-result">
      <button onClick={handleClickButton} className="tag-result__button">
        {tagName.toUpperCase()}
      </button>
    </div>
  );
}
